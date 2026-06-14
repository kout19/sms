import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../../shared/utils";
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "../pages/StudentDashboard";

/**
 * Student Routes - Protected routes for student module
 * Only users with 'student' role can access these routes
 *
 * Uses the reusable Layout component that handles:
 * - Header with user info
 * - Sidebar with student-specific menu items
 * - Responsive behavior
 */
const StudentRoutes = () => {
  return (
    <ProtectedRoute
      allowedRoles={["student"]}
      element={
        <Routes>
          <Route path="/" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            {/* <Route path="grades" element={<Grades />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="schedule" element={<Schedule />} /> */}
          </Route>
        </Routes>
      }
      fallbackPath="/"
    />
  );
};

export default StudentRoutes;
