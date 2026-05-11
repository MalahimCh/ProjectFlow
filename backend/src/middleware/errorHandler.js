import { sendError } from "../utils/apiResponse.js";

// ─── 404 Handler ──────────────────────────────────────────────────────────────
// Catches requests to routes that don't exist
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Catches anything thrown with next(err) or unhandled throw in async routes
// Must have exactly 4 parameters for Express to treat it as an error handler
export const globalErrorHandler = (err, req, res, _next) => {
  console.error("💥 Unhandled error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return sendError(res, 400, "Validation failed", errors);
  }

  // Mongoose duplicate key (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, 409, `${field} already exists`);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return sendError(res, 400, `Invalid value for field: ${err.path}`);
  }

  // JWT errors (shouldn't reach here if middleware handles them, but just in case)
  if (err.name === "JsonWebTokenError") {
    return sendError(res, 401, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return sendError(res, 401, "Token expired");
  }

  // Default: generic 500
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong"
      : err.message || "Internal server error";

  return sendError(res, statusCode, message);
};