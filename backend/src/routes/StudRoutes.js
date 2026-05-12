import express from "express";
import { getInitDashboard } from "../controllers/Student/StudDashboardController.js";
import { createStudentProfile } from "../controllers/Student/StudProfileController.js";
import { getAllSupervisors } from "../controllers/Student/FindSupervisorController.js";
import { getAllStudentProfiles } from "../controllers/Student/FindTeamController.js";
import { authenticate } from "../middleware/authenticate.js";
import {
  sendGroupRequest,
  acceptRequest,
  rejectRequest,
  inviteMember,
  getMyGroup,
  getIncomingRequests,
} from "../controllers/Student/GroupController.js";

import { sendSupervisorRequest } from "../controllers/Student/supervisorRequestController.js";

const router = express.Router();

// dashboard + profile
router.get("/init-dashboard", authenticate, getInitDashboard);
router.post("/student-profile", authenticate, createStudentProfile);

// discovery
router.get("/find-team", authenticate, getAllStudentProfiles);
router.get("/find-supervisor", authenticate, getAllSupervisors);

// group self
router.get("/group/me", authenticate, getMyGroup);
router.get("/group/requests/incoming", authenticate, getIncomingRequests);

// group actions
router.post("/group/request/:receiverId", authenticate, sendGroupRequest);
router.post("/group/accept/:requestId", authenticate, acceptRequest);
router.post("/group/reject/:requestId", authenticate, rejectRequest);
router.post("/group/:groupId/invite/:studentId", authenticate, inviteMember);

router.post("/sendSupervisorRequest", authenticate, sendSupervisorRequest);

export default router;
