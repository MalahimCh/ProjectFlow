import { verifyAccessToken } from "../utils/jwt.js";
import { unauthorized, forbidden, serverError } from "../utils/apiResponse.js";
import User from "../database/models/user.model.js";

// ─── helper: normalize user shape ─────────────────────────────────────────────
const normalizeUser = (user) => ({
  id: user._id ? user._id.toString() : user.id,
  role: user.role,
  email: user.email,
  name: user.name,
  isActive: user.isActive,
});

// ─── authenticate ─────────────────────────────────────────────────────────────
// Lightweight auth (no DB hit)
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return unauthorized(res, "Access token required");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
      name: payload.name,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return unauthorized(res, "Access token expired");
    }
    if (err.name === "JsonWebTokenError") {
      return unauthorized(res, "Invalid access token");
    }
    return serverError(res, "Authentication error");
  }
};

// ─── authenticateFresh ────────────────────────────────────────────────────────
// DB-backed auth (fresh user state)
export const authenticateFresh = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return unauthorized(res, "Access token required");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub);

    if (!user || !user.isActive) {
      return unauthorized(res, "Account not found or deactivated");
    }

    req.user = normalizeUser(user);

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return unauthorized(res, "Access token expired");
    }
    if (err.name === "JsonWebTokenError") {
      return unauthorized(res, "Invalid access token");
    }
    return serverError(res, "Authentication error");
  }
};

// ─── authorizeRoles ───────────────────────────────────────────────────────────
// Role-based access control
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorized(res, "Unauthorized");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return forbidden(
        res,
        `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      );
    }

    next();
  };
};
