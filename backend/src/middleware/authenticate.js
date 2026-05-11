import { verifyAccessToken } from "../utils/jwt.js";
import { unauthorized, forbidden, serverError } from "../utils/apiResponse.js";

import User from "../database/models/user.model.js";

// ─── authenticate ─────────────────────────────────────────────────────────────
// Verifies the Bearer access token from Authorization header.
// Attaches req.user (lightweight payload from token — no DB hit by default).
// For routes that need a fresh DB user, use authenticateFresh below.

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return unauthorized(res, "Access token required");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    // Attach decoded payload to request
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
// Same as authenticate but also queries DB to get the latest user document.
// Use on sensitive routes (change password, account settings).

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

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return unauthorized(res, "Access token expired");
    }
    if (err.name === "JsonWebTokenError") {
      return unauthorized(res, "Invalid access token");
    }
    return serverError(res);
  }
};

// ─── authorizeRoles ───────────────────────────────────────────────────────────
// Role guard — use after authenticate.
// Usage: authorizeRoles("coordinator")
//        authorizeRoles("supervisor", "coordinator")

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorized(res);
    }
    if (!allowedRoles.includes(req.user.role)) {
      return forbidden(
        res,
        `Access denied. Required role: ${allowedRoles.join(" or ")}`
      );
    }
    next();
  };
};