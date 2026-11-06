import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../../shared/utils";
import AdminDashboard from "../dashboard/pages/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import Students from "../students/pages/StudentsPage";
import Teachers from "../teachers/pages/TeachersPage";
import Classes from "../classes/pages/ClassesPage";
import AttendancePage from "../attendance/pages/AttendancePage";
import DepartmentsPage from "../departments/pages/DepartmentsPage";
import AccountantsPage from "../accountants/pages/AccountantsPage";
import ParentsPage from "../parents/pages/ParentsPage";
import SubjectsPage from "../subjects/pages/SubjectsPage";
import ExamsPage from "../exams/pages/ExamsPage";
import ReportsPage from "../reports/pages/ReportsPage";
import AttencdanceReportsPage from "../reports/pages/AttendanceReportsPage";
import AccademicReportsPage from "../reports/pages/AccademicReportsPage";
import FinancialReportsPage from "../reports/pages/FinancialReportsPage";
import MessagesPage from "../messages/pages/MessagesPage";
import Announcements from "../announcements/pages/AnnouncementsPage";
import AnnouncementDetailPage from "../announcements/pages/AnnouncementDetailPage";
import AnnouncementFormPage from "../announcements/pages/AnnouncementFormPage";
import Settingspage from "../settings/pages/SettingsPage";
import UserManagementSettingsPage from "../settings/pages/UserManagementSettingsPage";
import RolePermissionsSettingsPage from "../settings/pages/RolePermissionsSettingsPage";
import GeneralSettingsPage from "../settings/pages/GeneralSettingsPage";

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
            <Route path="students" element={<Students />} />
            <Route path="students/add" element={<Students />} />
            <Route path="students/import" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="teachers/add" element={<Teachers />} />
            <Route path="classes" element={<Classes />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="accountants" element={<AccountantsPage />} />
            <Route path="parents" element={<ParentsPage />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="exams" element={<ExamsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route
              path="reports/attendance-reports"
              element={<AttencdanceReportsPage />}
            />
            <Route
              path="reports/academic-reports"
              element={<AccademicReportsPage />}
            />
            <Route
              path="reports/financial-reports"
              element={<FinancialReportsPage />}
            />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="announcements" element={<Announcements />} />
            <Route
              path="announcements/:id"
              element={<AnnouncementDetailPage />}
            />
            <Route
              path="announcements/new"
              element={<AnnouncementFormPage />}
            />
            <Route
              path="announcements/:id/edit"
              element={<AnnouncementFormPage />}
            />
            <Route path="settings" element={<Settingspage />} />
            <Route path = "settings/general" element={<GeneralSettingsPage />} />
            <Route path = "settings/user-management" element={<UserManagementSettingsPage />} />
            <Route path = "settings/roles-permissions" element={<RolePermissionsSettingsPage />} />
          </Route>
        </Routes>
      }
      fallbackPath="/"
    />
  );
};

export default AdminRoutes;
