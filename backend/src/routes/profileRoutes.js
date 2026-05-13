import { Router } from "express";
import {
  getProfile,
  updateProfile,
  resetPassword,
} from "../controllers/profileController.js";
import { authenticate } from "../middleware/authenticate.js"; // your existing JWT middleware

const router = Router();

/**
 * GET  /api/profile
 * Returns the full profile for the authenticated user, shaped by role.
 */
router.get("/", authenticate, getProfile);

/**
 * PUT  /api/profile
 * Updates name, email, shared UserProfile fields, and role-specific fields.
 *
 * Body examples:
 *
 * Student:
 *   { name, email, phone, department, address, rollNumber, gpa, batchYear, interests }
 *
 * Supervisor:
 *   { name, email, phone, department, address, designation, specialization, interests, workload }
 */
router.put("/", authenticate, updateProfile);

/**
 * PUT  /api/profile/reset-password
 * Changes the authenticated user's own password.
 *
 * Body: { currentPassword, newPassword }
 */
router.put("/reset-password", authenticate, resetPassword);

export default router;
