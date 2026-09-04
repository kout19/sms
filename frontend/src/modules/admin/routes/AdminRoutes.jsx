import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../../shared/utils";
import AdminDashboard from "../dashboard/pages/AdminDashboard";
 import AdminLayout from "../layouts/AdminLayout";
import Settings from "../settings/pages/SettingsPage";
import Students from "../students/pages/StudentsPage";
import Teachers from "../teachers/pages/TeachersPage";
import Classes from "../classes/pages/ClassesPage";
import Attendance from "../attendance/pages/AttendancePage";
import DepartmentsPage from "../departments/pages/DepartmentsPage";
import AccountantsPage from "../accountants/pages/AccountantsPage";
import ParentsPage from "../parents/pages/ParentsPage";
import SubjectsPage from "../subjects/pages/SubjectsPage";
import ExamsPage from "../exams/pages/ExamsPage";



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
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="exams" element={<ExamsPage />} />
          </Route>
        </Routes>
      }
      fallbackPath="/"
    />
  );
};

export default AdminRoutes;
