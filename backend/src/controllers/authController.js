import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../database/models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import {
  getRefreshCookieOptions,
  clearRefreshCookieOptions,
} from "../utils/cookie.js";
import { isProfileComplete } from "../utils/profileCheck.js";
import { getUserGroupStatus } from "../helpers/groupHelper.js";
import {
  created,
  ok,
  badRequest,
  unauthorized,
  conflict,
  serverError,
} from "../utils/apiResponse.js";

// ─── REGISTER ─────────────────────────────────────────────────────────────────
// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check for existing account
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return conflict(res, "An account with this email already exists");
    }

    // 2. Hash password (salt rounds = 12 — good balance of security vs speed)
    const passwordHash = await bcrypt.hash(password, 12);

    // 3. Create user
    const user = await User.create({ name, email, passwordHash, role });

    // 4. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 5. Store hashed refresh token in DB
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refreshTokens = [hashedRefreshToken];
    await user.save();

    // 6. Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

    return created(res, "Account created successfully", {
      accessToken,
      user,
    });
  } catch (err) {
    console.error("register error:", err);
    return serverError(res);
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Fetch user with sensitive fields
    const user = await User.findByEmailForAuth(email);
    if (!user) {
      // Generic message — don't reveal whether email exists
      return unauthorized(res, "Invalid email or password");
    }

    // 2. Check if account is locked
    if (user.isLocked) {
      return unauthorized(
        res,
        "Account temporarily locked due to too many failed attempts. Try again in 15 minutes.",
      );
    }

    // 3. Check if account is active
    if (!user.isActive) {
      return unauthorized(res, "Your account has been deactivated");
    }

    // 4. Verify password
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      await user.incrementLoginAttempts();
      const remaining = 5 - (user.loginAttempts + 1);
      const message =
        remaining > 0
          ? `Invalid email or password. ${remaining} attempt(s) remaining`
          : "Account locked due to too many failed attempts. Try again in 15 minutes.";
      return unauthorized(res, message);
    }

    // 5. Reset failed attempts on successful login
    await user.resetLoginAttempts();

    // 6. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 7. Store hashed refresh token (keep up to 5 devices)
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const MAX_SESSIONS = 5;
    const existingTokens = user.refreshTokens || [];
    const updatedTokens = [
      ...existingTokens.slice(-(MAX_SESSIONS - 1)),
      hashedRefreshToken,
    ];
    user.refreshTokens = updatedTokens;
    await user.save();

    // 8. Set refresh token cookie
    res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

    const profileDone = await isProfileComplete(user);

    let redirectTo = "/setup-profile";

    // 1. Force profile completion first
    if (!profileDone) {
      redirectTo = "/setup-profile";
    } else {
      // 2. Then role-based routing
      if (user.role === "student") {
        const groupStatus = await getUserGroupStatus(user._id);

        redirectTo =
          groupStatus.isInGroup && groupStatus.isGroupCompleted
            ? "/student/dashboard"
            : "/student/initialdashboard";
      }

      if (user.role === "supervisor") {
        redirectTo = "/supervisor/dashboard";
      }

      if (user.role === "coordinator") {
        redirectTo = "/coordinator/dashboard";
      }
    }
    return ok(res, "Login successful", {
      accessToken,
      user,
      redirectTo,
    });
  } catch (err) {
    console.error("login error:", err);
    return serverError(res);
  }
};

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
// POST /api/auth/refresh
// Client sends no body — refresh token is read from httpOnly cookie
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return unauthorized(res, "Refresh token not found");
    }

    // 1. Verify JWT signature and expiry
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      res.clearCookie("refreshToken", clearRefreshCookieOptions());
      return unauthorized(res, "Invalid or expired refresh token");
    }

    // 2. Find user and check stored tokens
    const user = await User.findById(payload.sub).select("+refreshTokens");
    if (!user || !user.isActive) {
      return unauthorized(res, "User not found or deactivated");
    }

    // 3. Check if incoming token matches any stored hash (rotation detection)
    let matchedIndex = -1;
    for (let i = 0; i < user.refreshTokens.length; i++) {
      const match = await bcrypt.compare(token, user.refreshTokens[i]);
      if (match) {
        matchedIndex = i;
        break;
      }
    }

    if (matchedIndex === -1) {
      // Token not in DB — possible token theft. Invalidate ALL sessions.
      user.refreshTokens = [];
      await user.save();
      res.clearCookie("refreshToken", clearRefreshCookieOptions());
      return unauthorized(
        res,
        "Refresh token reuse detected. All sessions have been invalidated.",
      );
    }

    // 4. Rotate: remove old token, issue new pair
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    const hashedNew = await bcrypt.hash(newRefreshToken, 10);

    user.refreshTokens.splice(matchedIndex, 1, hashedNew);
    await user.save();

    res.cookie("refreshToken", newRefreshToken, getRefreshCookieOptions());

    return ok(res, "Token refreshed", { accessToken: newAccessToken });
  } catch (err) {
    console.error("refresh error:", err);
    return serverError(res);
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      // Remove this specific refresh token from DB (logout current device only)
      const user = await User.findById(req.user.id).select("+refreshTokens");
      if (user) {
        const filtered = [];
        for (const stored of user.refreshTokens) {
          const match = await bcrypt.compare(token, stored);
          if (!match) filtered.push(stored);
        }
        user.refreshTokens = filtered;
        await user.save();
      }
    }

    res.clearCookie("refreshToken", clearRefreshCookieOptions());
    return ok(res, "Logged out successfully");
  } catch (err) {
    console.error("logout error:", err);
    return serverError(res);
  }
};

// ─── LOGOUT ALL DEVICES ────────────────────────────────────────────────────────
// POST /api/auth/logout-all
export const logoutAll = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshTokens: [] });
    res.clearCookie("refreshToken", clearRefreshCookieOptions());
    return ok(res, "Logged out from all devices");
  } catch (err) {
    console.error("logoutAll error:", err);
    return serverError(res);
  }
};

// ─── GET CURRENT USER ─────────────────────────────────────────────────────────
// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return unauthorized(res, "User not found");
    return ok(res, "User fetched", { user });
  } catch (err) {
    console.error("getMe error:", err);
    return serverError(res);
  }
};

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
// PATCH /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Must fetch passwordHash explicitly (select: false)
    const user = await User.findById(req.user.id).select(
      "+passwordHash +refreshTokens",
    );
    if (!user) return unauthorized(res, "User not found");

    const match = await user.comparePassword(currentPassword);
    if (!match) return badRequest(res, "Current password is incorrect");

    user.passwordHash = await bcrypt.hash(newPassword, 12);

    // Invalidate all existing sessions — user must re-login everywhere
    user.refreshTokens = [];
    await user.save();

    res.clearCookie("refreshToken", clearRefreshCookieOptions());

    return ok(res, "Password changed successfully. Please log in again.");
  } catch (err) {
    console.error("changePassword error:", err);
    return serverError(res);
  }
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// In production: sends an email with the reset link.
// Here: returns the token directly (replace with email service for production).
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always respond with the same message — don't reveal if email exists
    const GENERIC_MSG =
      "If an account with that email exists, a reset link has been sent.";

    if (!user) return ok(res, GENERIC_MSG);

    // Generate a random reset token (raw)
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Store hashed version — never store raw tokens in DB
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    // ── In production, send an email here ────────────────────────────────────
    // const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
    // await sendEmail({ to: user.email, subject: "Password Reset", resetUrl });
    // ─────────────────────────────────────────────────────────────────────────

    // DEV ONLY: return token in response for testing
    const devData =
      process.env.NODE_ENV !== "production" ? { resetToken: rawToken } : {};

    return ok(res, GENERIC_MSG, devData);
  } catch (err) {
    console.error("forgotPassword error:", err);
    return serverError(res);
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Hash the incoming raw token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordHash +refreshTokens");

    if (!user) {
      return badRequest(res, "Password reset token is invalid or has expired");
    }

    // Update password and clear reset fields
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.refreshTokens = []; // invalidate all sessions
    await user.save();

    res.clearCookie("refreshToken", clearRefreshCookieOptions());

    return ok(
      res,
      "Password reset successful. Please log in with your new password.",
    );
  } catch (err) {
    console.error("resetPassword error:", err);
    return serverError(res);
  }
};
