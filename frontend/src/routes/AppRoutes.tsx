import { Routes, Route } from "react-router-dom";
import SignUpPage from "../pages/SignUp/SignUpPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUpPage />} />
    </Routes>
  );
};

export default AppRoutes;