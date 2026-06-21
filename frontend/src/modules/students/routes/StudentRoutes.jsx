import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../../shared/utils";
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "../pages/StudentDashboard";
import StudentGradesPage from "../pages/StudentGradesPage";
import StudentAttendancePage from "../pages/StudentAttendancePage";
import StudentSchedulePage from "../pages/StudentSchedulePage";
import StudentAssignmentsPage from "../pages/StudentAssignmentsPage";
import StudentAnnouncementsPage from "../pages/StudentAnnouncementsPage";
import StudentMessagesPage from "../pages/StudentMessagesPage";

const StudentRoutes = () => {
  return (
    <ProtectedRoute
      allowedRoles={["student"]}
      element={
        <Routes>
          <Route path="/" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="grades" element={<StudentGradesPage />} />
            <Route path="attendance" element={<StudentAttendancePage />} />
            <Route path="schedule" element={<StudentSchedulePage />} />
            <Route path="assignments" element={<StudentAssignmentsPage />} />
            <Route path="announcements" element={<StudentAnnouncementsPage />} />
            <Route path="messages" element={<StudentMessagesPage />} />
          </Route>
        </Routes>
      }
      fallbackPath="/"
    />
  );
};

export default StudentRoutes;
