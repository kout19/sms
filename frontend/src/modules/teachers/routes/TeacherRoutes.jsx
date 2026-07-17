import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../../shared/utils";
import TeacherLayout from "../layouts/TeacherLayout";
import TeacherDashboard from "../pages/TeacherDashboard";
import TeacherClassesPage from "../pages/TeacherClassesPage";
import TeacherStudentsPage from "../pages/TeacherStudentsPage";
import TeacherGradesPage from "../pages/TeacherGradesPage";
import TeacherAttendancePage from "../pages/TeacherAttendancePage";
import TeacherAnnouncementsPage from "../pages/TeacherAnnouncementsPage";
import TeacherMessagesPage from "../pages/TeacherMessagesPage";

const TeacherRoutes = () => {
  return (
    <ProtectedRoute
      allowedRoles={["teacher", "super-admin"]}
      element={
        <Routes>
          <Route path="/" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="classes" element={<TeacherClassesPage />} />
            <Route path="students" element={<TeacherStudentsPage />} />
            <Route path="grades" element={<TeacherGradesPage />} />
            <Route path="attendance" element={<TeacherAttendancePage />} />
            <Route
              path="announcements"
              element={<TeacherAnnouncementsPage />}
            />
            <Route path="messages" element={<TeacherMessagesPage />} />
          </Route>
        </Routes>
      }
      fallbackPath="/"
    />
  );
};

export default TeacherRoutes;
