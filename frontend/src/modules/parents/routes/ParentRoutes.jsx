import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../../shared/utils";
import ParentLayout from "../layouts/ParentLayout";
import ParentDashboard from "../pages/ParentDashboard";

/**
 * Parent Routes - Protected routes for parent module
 * Only users with 'parent' role can access these routes
 *
 * Uses the reusable Layout component that handles:
 * - Header with user info
 * - Sidebar with parent-specific menu items
 * - Responsive behavior
 */
const ParentRoutes = () => {
  return (
    <ProtectedRoute
      allowedRoles={["parent"]}
      element={
        <Routes>
          <Route path="/" element={<ParentLayout />}>
            <Route index element={<ParentDashboard />} />
            {/* <Route path="child/:childId/progress" element={<ChildProgress />} />
            <Route path="child/:childId/attendance" element={<Attendance />} />
            <Route path="messages" element={<Messages />} /> */}
          </Route>
        </Routes>
      }
      fallbackPath="/"
    />
  );
};

export default ParentRoutes;
