import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Unauthorized from "../pages/Unauthorized";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>
      <Route path="/auth/*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AuthRoutes;
