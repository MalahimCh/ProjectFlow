import express from "express";
import {
  getStudentMeetings,
  createStudentMeeting,
  getSupervisorMeetings,
  createSupervisorMeeting,
  updateMeeting,
  deleteMeeting,
} from "../controllers/meetingController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

/* ───────────── STUDENT ROUTES ───────────── */

// Get all meetings of student's project
router.get("/student", authenticate, getStudentMeetings);

// Create a meeting for student's project
router.post("/student", authenticate, createStudentMeeting);

/* ──────────── SUPERVISOR ROUTES ─────────── */

// Get all meetings of supervisor's projects
router.get("/supervisor", authenticate, getSupervisorMeetings);

// Create meeting for selected project
router.post("/supervisor", authenticate, createSupervisorMeeting);

/* ───────────── SHARED ROUTES ───────────── */

// Update meeting
router.put("/:meetingId", authenticate, updateMeeting);

// Delete meeting
router.delete("/:meetingId", authenticate, deleteMeeting);

export default router;
