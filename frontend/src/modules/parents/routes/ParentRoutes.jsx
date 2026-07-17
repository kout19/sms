import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../../shared/utils";
import ParentLayout from "../layouts/ParentLayout";
import ParentDashboard from "../pages/ParentDashboard";
import ParentProgressPage from "../pages/ParentProgressPage";
import ParentAnnouncementsPage from "../pages/ParentAnnouncementsPage";
import ParentMessagesPage from "../pages/ParentMessagesPage";
import ParentFeesPage from "../pages/ParentFeesPage";
import ParentDocumentsPage from "../pages/ParentDocumentsPage";

const ParentRoutes = () => {
  return (
    <ProtectedRoute
      allowedRoles={["parent", "super-admin"]}
      element={
        <Routes>
          <Route path="/" element={<ParentLayout />}>
            <Route index element={<ParentDashboard />} />
            <Route path="progress" element={<ParentProgressPage />} />
            <Route path="announcements" element={<ParentAnnouncementsPage />} />
            <Route path="messages" element={<ParentMessagesPage />} />
            <Route path="fees" element={<ParentFeesPage />} />
            <Route path="documents" element={<ParentDocumentsPage />} />
          </Route>
        </Routes>
      }
      fallbackPath="/"
    />
  );
};

export default ParentRoutes;
