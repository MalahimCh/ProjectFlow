import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "../pages/SignUp/SignUpPage";
import SignInPage from "../pages/SignIn/SignInPage";

import SDashboard from "../pages/Supervisor/Dashboard/SDashboard";
import SProjects from "../pages/Supervisor/Projects/SProjects";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={<SignUpPage />} />
      <Route path="/login" element={<SignInPage />} />

      {/* Supervisor routes */}
      <Route path="/supervisor/dashboard" element={<SDashboard />} />
      <Route path="/supervisor/projects" element={<SProjects />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;