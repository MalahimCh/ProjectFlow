import express from "express";
import { createSupervisorProfile } from "../controllers/Supervisor/SProfileController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
router.post("/supervisor-profile", authenticate, createSupervisorProfile);

export default router;
