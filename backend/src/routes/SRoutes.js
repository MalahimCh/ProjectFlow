import express from "express";
import { createSupervisorProfile } from "../controllers/Supervisor/SProfileController.js";
import { authenticate } from "../middleware/authenticate.js";
import {
  getSupervisorRequests,
  acceptSupervisorRequest,
  rejectSupervisorRequest,
} from "../controllers/Supervisor/RequestController.js";
import { getSupervisorProjects } from "../controllers/Supervisor/ProjectController.js";
import { getSupervisorDashboard } from "../controllers/Supervisor/SDashboardController.js";

const router = express.Router();

// GET /api/supervisor/dashboard
router.get("/dashboard", authenticate, getSupervisorDashboard);

router.post("/supervisor-profile", authenticate, createSupervisorProfile);
router.get("/requests", authenticate, getSupervisorRequests);
router.get("/projects", authenticate, getSupervisorProjects);
router.put("/accept/:requestId", authenticate, acceptSupervisorRequest);
router.put("/reject/:requestId", authenticate, rejectSupervisorRequest);
export default router;
