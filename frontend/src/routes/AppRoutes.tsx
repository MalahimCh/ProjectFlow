import { Routes, Route } from "react-router-dom";
import SignUpPage from "../pages/SignUp/SignUpPage";
import SignInPage from "../pages/SignIn/SignInPage";
import SDashboard from "../pages/Supervisor/Dashboard/SDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUpPage />} />
      <Route path="/login" element={<SignInPage />} />
      <Route path="/dashboard" element={<SDashboard />} />

    </Routes>
  );
};

export default AppRoutes;