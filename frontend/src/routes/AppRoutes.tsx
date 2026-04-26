import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "../pages/SignUp/SignUpPage";
import SignInPage from "../pages/SignIn/SignInPage";

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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={<SignUpPage />} />
      <Route path="/login" element={<SignInPage />} />

      {/* Supervisor routes */}
      <Route path="/supervisor/dashboard" element={<SDashboard />} />
      <Route path="/supervisor/projects" element={<SProjects />} />
      <Route path="/supervisor/meetings" element={<SMeetings />} />
      <Route path="/supervisor/requests" element={<SRequests />} />
      <Route
        path="/supervisor/projects/:projectId"
        element={<ProjectDetails />}
      />

      <Route path="/student/initialdashboard" element={<InitDashboard />} />
      <Route path="/student/findteam" element={<FindTeam />} />
      <Route path="/student/findsupervisor" element={<FindSupervisor />} />
      <Route path="/student/requests" element={<PendingRequest />} />

      <Route path="/student/dashboard" element={<StudDashboard />} />
      <Route path="/student/meetings" element={<StudMeetings />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
