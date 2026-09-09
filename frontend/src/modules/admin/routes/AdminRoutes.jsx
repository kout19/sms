import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../../shared/utils";
import AdminDashboard from "../dashboard/pages/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import Settings from "../settings/pages/SettingsPage";
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
          </Route>
        </Routes>
      }
      fallbackPath="/"
    />
  );
};

export default AdminRoutes;
