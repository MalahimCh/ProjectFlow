import { body } from "express-validator";

// ─── Register ─────────────────────────────────────────────────────────────────
export const registerValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),

 body("password")
  .notEmpty().withMessage("Password is required")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  .matches(/\d/).withMessage("Password must contain at least one number"),
 ,

  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["student", "supervisor", "coordinator"]).withMessage(
      "Role must be student, supervisor, or coordinator"
    ),
];

// ─── Login ────────────────────────────────────────────────────────────────────
export const loginValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

// ─── Forgot Password ──────────────────────────────────────────────────────────
export const forgotPasswordValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),
];

// ─── Reset Password ───────────────────────────────────────────────────────────
export const resetPasswordValidator = [
  body("token")
    .notEmpty().withMessage("Reset token is required"),

body("newPassword")
  .notEmpty().withMessage("New password is required")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  .matches(/\d/).withMessage("Password must contain at least one number"),
];

// ─── Change Password (authenticated) ─────────────────────────────────────────
export const changePasswordValidator = [
  body("currentPassword")
    .notEmpty().withMessage("Current password is required"),

 body("newPassword")
  .notEmpty().withMessage("New password is required")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  .matches(/\d/).withMessage("Password must contain at least one number")
  
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("New password must differ from the current password");
      }
      return true;
    }),
];