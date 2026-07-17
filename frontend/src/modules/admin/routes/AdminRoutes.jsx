import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import Settings from "../pages/Settings";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import Classes from "../pages/Classes";
import Attendance from "../pages/Attendance";
import { ProtectedRoute } from "../../../shared/utils";

/**
 * Admin Routes - Protected routes for admin module
 * Only users with 'admin' role can access these routes
 * All routes are wrapped with ProtectedRoute for security
 */
const AdminRoutes = () => {
  return (
    <ProtectedRoute
      allowedRoles={["admin", "super-admin"]}
      element={
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="classes" element={<Classes />} />
            <Route path="attendance" element={<Attendance />} />
          </Route>
        </Routes>
      }
      fallbackPath="/"
    />
  );
};

export default AdminRoutes;
