import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FORCE correct .env location
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import mongoose from "mongoose";

// ================================
// Import models
// ================================
import Announcement from "./models/announcement.model.js";
import Assignment from "./models/assignment.model.js";
import AssignmentAttachment from "./models/assignmentAttachment.model.js";
import CriterionScore from "./models/criterionScore.model.js";
import Deadline from "./models/deadline.model.js";
import EvaluationPanel from "./models/evaluationPanel.model.js";
import Group from "./models/group.model.js";
import GroupMember from "./models/groupMember.model.js";
import GroupRequest from "./models/groupRequest.model.js";
import Material from "./models/material.model.js";
import Meeting from "./models/meeting.model.js";
import Notification from "./models/notification.model.js";
import PanelProject from "./models/panelProject.model.js";
import PanelSupervisor from "./models/panelSupervisor.model.js";
import Project from "./models/project.model.js";
import ProjectEvaluation from "./models/projectEvaluation.model.js";
import ProjectRating from "./models/projectRating.model.js";
import ProjectTechnology from "./models/projectTechnology.model.js";
import Rubric from "./models/rubric.model.js";
import RubricCriterion from "./models/rubricCriterion.model.js";
import StudentProfile from "./models/studentProfile.model.js";
import Submission from "./models/submission.model.js";
import SubmissionAttachment from "./models/submissionAttachment.model.js";
import SupervisorProfile from "./models/supervisorProfile.model.js";
import SupervisorRequest from "./models/supervisorRequest.model.js";
import User from "./models/user.model.js";
import UserProfile from "./models/userProfile.model.js";

// ================================
// Main function
// ================================
const run = async () => {
  try {
    // Connect DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    console.log("🔄 Syncing indexes...");

    // ================================
    // Sync indexes
    // ================================
    await Announcement.syncIndexes();
    await Assignment.syncIndexes();
    await AssignmentAttachment.syncIndexes();
    await CriterionScore.syncIndexes();
    await Deadline.syncIndexes();
    await EvaluationPanel.syncIndexes();
    await Group.syncIndexes();
    await GroupMember.syncIndexes();
    await GroupRequest.syncIndexes();
    await Material.syncIndexes();
    await Meeting.syncIndexes();
    await Notification.syncIndexes();
    await PanelProject.syncIndexes();
    await PanelSupervisor.syncIndexes();
    await Project.syncIndexes();
    await ProjectEvaluation.syncIndexes();
    await ProjectRating.syncIndexes();
    await ProjectTechnology.syncIndexes();
    await Rubric.syncIndexes();
    await RubricCriterion.syncIndexes();
    await StudentProfile.syncIndexes();
    await Submission.syncIndexes();
    await SubmissionAttachment.syncIndexes();
    await SupervisorProfile.syncIndexes();
    await SupervisorRequest.syncIndexes();
    await User.syncIndexes();
    await UserProfile.syncIndexes();

    console.log("✅ All indexes synced successfully!");
  } catch (error) {
    console.error("❌ Error syncing indexes:", error);
  } finally {
    // Always close DB properly
    await mongoose.disconnect();
    console.log("🔌 MongoDB Disconnected");
    process.exit(0);
  }
};

run();
