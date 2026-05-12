import express from "express";
import { createSupervisorProfile } from "../controllers/Supervisor/SProfileController.js";
import { authenticate } from "../middleware/authenticate.js";
import {
  getSupervisorRequests,
  acceptSupervisorRequest,
  rejectSupervisorRequest,
} from "../controllers/Supervisor/RequestController.js";

const router = express.Router();
router.post("/supervisor-profile", authenticate, createSupervisorProfile);
router.get("/requests", authenticate, getSupervisorRequests);
router.put("/accept/:requestId", authenticate, acceptSupervisorRequest);
router.put("/reject/:requestId", authenticate, rejectSupervisorRequest);
export default router;
