import express from "express";
import { getInitDashboard } from "../controllers/Student/StudDashboardController.js";
import { createStudentProfile } from "../controllers/Student/StudProfileController.js";

import { getAllStudentProfiles } from "../controllers/Student/FindTeamController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/init-dashboard", authenticate, getInitDashboard);

router.post("/student-profile", authenticate, createStudentProfile);

router.get("/find-team", authenticate, getAllStudentProfiles);

export default router;
