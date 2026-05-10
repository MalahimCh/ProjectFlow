import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "../pages/SignUp/SignUpPage";
import SignInPage from "../pages/SignIn/SignInPage";
import Settings from "../pages/Settings/Settings";
import Profile from "../pages/Profile/Profile";
import Repository from "../pages/Repository/Repository";

import SDashboard from "../pages/Supervisor/Dashboard/SDashboard";
import SProjects from "../pages/Supervisor/Projects/SProjects";
import ProjectDetails from "../pages/Supervisor/Projects/ProjectDetails";
import SMeetings from "../pages/Supervisor/Meetings/SMeetings";
import SRequests from "../pages/Supervisor/Requests/SRequests";

import InitDashboard from "../pages/Student/Dashboard/InitDashboard";
import FindTeam from "../pages/Student/FindTeam/FindTeam";
import FindSupervisor from "../pages/Student/FindSupervisors/FindSupervisor";
import PendingRequest from "../pages/Student/PendingRequest/PendingRequest";

import StudDashboard from "../pages/Student/Dashboard/StudDashboard";
import StudMeetings from "../pages/Student/Meetings/studMeetings";
import StudProject from "../pages/Student/Project/StudProject";

import CoordDashboard from "../pages/Coordinator/Dashboard/CoordDashboard";
import CoordDeadlines from "../pages/Coordinator/Deadlines/CoordDeadlines";
import CoordRubrics from "../pages/Coordinator/Rubric/CoordRubric";
import CoordEvaluations from "../pages/Coordinator/Evaluations/CoordEvaluations";
import CoordWorkload from "../pages/Coordinator/Workload/CoordWorkload";
import CoordProjects from "../pages/Coordinator/Projects/CoordProjects";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={<SignUpPage />} />
      <Route path="/login" element={<SignInPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/repository" element={<Repository />} />

      {/* Coordinator routes */}
      <Route path="/coordinator/dashboard" element={<CoordDashboard />} />
      <Route path="/coordinator/projects" element={<CoordProjects />} />
      <Route path="/coordinator/deadlines" element={<CoordDeadlines />} />
      <Route path="/coordinator/rubrics" element={<CoordRubrics />} />
      <Route path="/coordinator/evaluations" element={<CoordEvaluations />} />
      <Route path="/coordinator/workload" element={<CoordWorkload />} />

      {/* Supervisor routes */}
      <Route path="/supervisor/dashboard" element={<SDashboard />} />
      <Route path="/supervisor/projects" element={<SProjects />} />
      <Route path="/supervisor/meetings" element={<SMeetings />} />
      <Route path="/supervisor/requests" element={<SRequests />} />
      <Route
        path="/supervisor/projects/:projectId"
        element={<ProjectDetails />}
      />

      {/* Student routes */}
      <Route path="/student/initialdashboard" element={<InitDashboard />} />
      <Route path="/student/findteam" element={<FindTeam />} />
      <Route path="/student/findsupervisor" element={<FindSupervisor />} />
      <Route path="/student/requests" element={<PendingRequest />} />

      <Route path="/student/dashboard" element={<StudDashboard />} />
      <Route path="/student/meetings" element={<StudMeetings />} />
      <Route path="/student/project" element={<StudProject />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
