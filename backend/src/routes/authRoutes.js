import { Router } from "express";
import {
  register,
  login,
  refreshAccessToken,
  logout,
  logoutAll,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import validate from "../middleware/validate.js";
import { getUser } from "../helpers/getUser.js";
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} from "../validator/auth.validator.js";

const router = Router();

// ─── Public Routes (no token required) ───────────────────────────────────────

// POST /api/auth/register
router.post("/register", registerValidator, validate, register);

// POST /api/auth/login
router.post("/login", loginValidator, validate, login);

// POST /api/auth/refresh  — reads refreshToken from httpOnly cookie
router.post("/refresh", refreshAccessToken);

// POST /api/auth/forgot-password
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  forgotPassword,
);

// POST /api/auth/reset-password
router.post("/reset-password", resetPasswordValidator, validate, resetPassword);

// ─── Protected Routes (valid access token required) ───────────────────────────

// GET /api/auth/me
router.get("/me", authenticate, getUser);

// POST /api/auth/logout — logs out current device
router.post("/logout", authenticate, logout);

// POST /api/auth/logout-all — logs out all devices
router.post("/logout-all", authenticate, logoutAll);

// PATCH /api/auth/change-password
router.patch(
  "/change-password",
  authenticate,
  changePasswordValidator,
  validate,
  changePassword,
);

export default router;
