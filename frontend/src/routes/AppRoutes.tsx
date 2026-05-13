// src/routes/AppRoutes.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Auth pages
import SignUpPage from "../pages/SignUp/SignUpPage";
import SignInPage from "../pages/SignIn/SignInPage";

// Shared pages (authenticated users only)
import Profile from "../pages/Profile/Profile";
import Repository from "../pages/Repository/Repository";
import SetupProfilePage from "../pages/SetupProfile/SetupProfile";

// Supervisor pages
import SDashboard from "../pages/Supervisor/Dashboard/SDashboard";
import SProjects from "../pages/Supervisor/Projects/SProjects";
import ProjectDetails from "../pages/Supervisor/Projects/ProjectDetails";
import SMeetings from "../pages/Supervisor/Meetings/SMeetings";
import SRequests from "../pages/Supervisor/Requests/SRequests";

// Student pages
import InitDashboard from "../pages/Student/Dashboard/InitDashboard";
import FindTeam from "../pages/Student/FindTeam/FindTeam";
import FindSupervisor from "../pages/Student/FindSupervisors/FindSupervisor";
import PendingRequest from "../pages/Student/PendingRequest/PendingRequest";

import StudDashboard from "../pages/Student/Dashboard/StudDashboard";
import StudMeetings from "../pages/Student/Meetings/studMeetings";

// Coordinator pages
import CoordDashboard from "../pages/Coordinator/Dashboard/CoordDashboard";
import CoordDeadlines from "../pages/Coordinator/Deadlines/CoordDeadlines";
import CoordRubrics from "../pages/Coordinator/Rubric/CoordRubric";
import CoordEvaluations from "../pages/Coordinator/Evaluations/CoordEvaluations";
import CoordWorkload from "../pages/Coordinator/Workload/CoordWorkload";
import CoordProjects from "../pages/Coordinator/Projects/CoordProjects";

import AssignmentDetail from "../pages/Supervisor/Projects/Tabs/AssignmentDetail";
const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= Public Routes ================= */}
      <Route path="/" element={<SignUpPage />} />
      <Route path="/login" element={<SignInPage />} />

      {/* ================= Shared Authenticated Routes ================= */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/repository" element={<Repository />} />
        <Route path="/setup-profile" element={<SetupProfilePage />} />
      </Route>
      {/* ================= Student Routes ================= */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        {/* Initial group-formation flow */}
        <Route path="/student/initialdashboard" element={<InitDashboard />} />
        <Route path="/student/findteam" element={<FindTeam />} />
        <Route path="/student/findsupervisor" element={<FindSupervisor />} />
        <Route path="/student/requests" element={<PendingRequest />} />

        <Route
          path="/student/projects/:projectId"
          element={<ProjectDetails role="student" />}
        />
        <Route
          path="/student/projects/:projectId/assignments/:assignmentId"
          element={<AssignmentDetail role="student" />}
        />
        {/* Full project dashboard */}
        <Route path="/student/dashboard" element={<StudDashboard />} />
        <Route path="/student/meetings" element={<StudMeetings />} />
      </Route>
      {/* ================= Supervisor Routes ================= */}
      <Route element={<ProtectedRoute allowedRoles={["supervisor"]} />}>
        <Route path="/supervisor/dashboard" element={<SDashboard />} />
        <Route path="/supervisor/projects" element={<SProjects />} />
        <Route path="/supervisor/meetings" element={<SMeetings />} />
        <Route path="/supervisor/requests" element={<SRequests />} />
        <Route
          path="/projects/:projectId"
          element={<ProjectDetails role="supervisor" />}
        />
        <Route
          path="/projects/:projectId/assignments/:assignmentId"
          element={<AssignmentDetail role="supervisor" />}
        />
      </Route>
      {/* ================= Coordinator Routes ================= */}
      <Route element={<ProtectedRoute allowedRoles={["coordinator"]} />}>
        <Route path="/coordinator/dashboard" element={<CoordDashboard />} />
        <Route path="/coordinator/projects" element={<CoordProjects />} />
        <Route path="/coordinator/deadlines" element={<CoordDeadlines />} />
        <Route path="/coordinator/rubrics" element={<CoordRubrics />} />
        <Route path="/coordinator/evaluations" element={<CoordEvaluations />} />
        <Route path="/coordinator/workload" element={<CoordWorkload />} />
      </Route>
      {/* ================= Unauthorized ================= */}
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
      {/* ================= Fallback ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
