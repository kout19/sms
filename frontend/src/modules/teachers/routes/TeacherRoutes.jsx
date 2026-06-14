import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../../shared/utils";
import TeacherLayout from "../layouts/TeacherLayout";
import TeacherDashboard from "../pages/TeacherDashboard";

/**
 * Teacher Routes - Protected routes for teacher module
 * Only users with 'teacher' role can access these routes
 *
 * Uses the reusable Layout component that handles:
 * - Header with user info
 * - Sidebar with teacher-specific menu items
 * - Responsive behavior
 */
const TeacherRoutes = () => {
  return (
    <ProtectedRoute
      allowedRoles={["teacher"]}
      element={
        <Routes>
          <Route path="/" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            {/* <Route path="classes" element={<Classes />} />
            <Route path="grades" element={<StudentGrades />} />
            <Route path="attendance" element={<Attendance />} /> */}
          </Route>
        </Routes>
      }
      fallbackPath="/"
    />
  );
};

export default TeacherRoutes;
