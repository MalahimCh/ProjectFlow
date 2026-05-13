import express from "express";
import { authenticate } from "../middleware/authenticate.js";

import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

import {
  getMaterials,
  createMaterial,
  deleteMaterial,
} from "../controllers/materialController.js";

import {
  getAssignments,
  getAssignmentDetail,
  createAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
} from "../controllers/assignmentController.js";

import { getProjectById } from "../controllers/projectController.js";

const router = express.Router({ mergeParams: true }); // mergeParams to get :projectId

/* ─────────────────────────────────────────────
   ANNOUNCEMENTS
──────────────────────────────────────────── */

// Get all announcements for a project (supervisor + student)
router.get("/announcements", authenticate, getAnnouncements);

// Post an announcement (supervisor only — enforced in controller)
router.post("/announcements", authenticate, createAnnouncement);

// Delete an announcement (supervisor only — enforced in controller)
router.delete("/announcements/:id", authenticate, deleteAnnouncement);

/* ─────────────────────────────────────────────
   MATERIALS
──────────────────────────────────────────── */

// Get all materials for a project (supervisor + student)
router.get("/materials", authenticate, getMaterials);

// Upload a material (supervisor only — enforced in controller)
router.post("/materials", authenticate, createMaterial);

// Delete a material (supervisor only — enforced in controller)
router.delete("/materials/:id", authenticate, deleteMaterial);

/* ─────────────────────────────────────────────
   ASSIGNMENTS
──────────────────────────────────────────── */

// Get all assignments for a project (supervisor + student)
router.get("/assignments", authenticate, getAssignments);

// Create an assignment (supervisor only — enforced in controller)
router.post("/assignments", authenticate, createAssignment);

// Get single assignment detail
// supervisor sees all submissions, student sees only their own
router.get("/assignments/:id", authenticate, getAssignmentDetail);

// Delete an assignment + cascade (supervisor only — enforced in controller)
router.delete("/assignments/:id", authenticate, deleteAssignment);

// Student submits an assignment (student only — enforced in controller)
router.post("/assignments/:id/submit", authenticate, submitAssignment);

// View all submissions for an assignment (supervisor only — enforced in controller)
router.get("/assignments/:id/submissions", authenticate, getSubmissions);

// Get project overview/details
router.get("/", authenticate, getProjectById);
export default router;
