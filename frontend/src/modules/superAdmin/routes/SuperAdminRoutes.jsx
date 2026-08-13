import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../../shared/utils";
import SuperAdminLayout from "../layouts/SuperAdminLayout";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";
import RolePlaceholderPage from "../../../shared/components/RolePlaceholderPage";

const SuperAdminRoutes = () => {
  return (
    <ProtectedRoute
      allowedRoles={["super_admin"]}
      element={
        <Routes>
          <Route path="/" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route
              path="schools"
              element={
                <RolePlaceholderPage
                  title="Schools"
                  description="School management and tenant oversight will be configured here as the multi-school architecture expands."
                  backPath="/super-admin/dashboard"
                  backLabel="Back to super admin dashboard"
                />
              }
            />
            <Route
              path="administrators"
              element={
                <RolePlaceholderPage
                  title="Administrators"
                  description="Administrative accounts and delegated management controls will be surfaced here."
                  backPath="/super-admin/dashboard"
                  backLabel="Back to super admin dashboard"
                />
              }
            />
            <Route
              path="users"
              element={
                <RolePlaceholderPage
                  title="Users"
                  description="User lifecycle operations and role administration will be managed from this area."
                  backPath="/super-admin/dashboard"
                  backLabel="Back to super admin dashboard"
                />
              }
            />
            <Route
              path="settings"
              element={
                <RolePlaceholderPage
                  title="System Settings"
                  description="System-wide configuration and governance controls will be introduced here."
                  backPath="/super-admin/dashboard"
                  backLabel="Back to super admin dashboard"
                />
              }
            />
          </Route>
        </Routes>
      }
    />
  );
};

export default SuperAdminRoutes;
