import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../../shared/utils";
import AdminDashboard from "../pages/AdminDashboard";
 import AdminLayout from "../layouts/AdminLayout";
import Settings from "../pages/SettingsPage";
import Students from "../pages/StudentsPage";
import Teachers from "../pages/TeachersPage";
import Classes from "../pages/ClassesPage";
import Attendance from "../pages/AttendancePage";
import DepartmentsPage from "../pages/DepartmentsPage";
import AccountantsPage from "../pages/AccountantsPage";
import ParentsPage from "../pages/ParentsPage";




/**
 * Admin Routes - Protected routes for admin module
 * Only users with 'admin' role can access these routes
 * All routes are wrapped with ProtectedRoute for security
 */
const AdminRoutes = () => {
  return (
    <ProtectedRoute
      allowedRoles={["admin"]}
      element={
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="classes" element={<Classes />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="accountants" element={<AccountantsPage />} />
            <Route path="parents" element={<ParentsPage />} />
          </Route>
        </Routes>
      }
      fallbackPath="/"
    />
  );
};

export default AdminRoutes;
