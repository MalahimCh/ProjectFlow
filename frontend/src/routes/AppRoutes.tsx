import { Routes, Route } from "react-router-dom";
import SignUpPage from "../pages/SignUp/SignUpPage";
import SignInPage from "../pages/SignIn/SignInPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUpPage />} />
      <Route path="/login" element={<SignInPage />} />

    </Routes>
  );
};

export default AppRoutes;