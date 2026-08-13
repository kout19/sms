import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../../shared/utils";
import AccountantLayout from "../layouts/AccountantLayout";
import AccountantDashboard from "../pages/AccountantDashboard";
import RolePlaceholderPage from "../../../shared/components/RolePlaceholderPage";

const AccountantRoutes = () => {
  return (
    <ProtectedRoute
      allowedRoles={["accountant"]}
      element={
        <Routes>
          <Route path="/" element={<AccountantLayout />}>
            <Route index element={<AccountantDashboard />} />
            <Route path="dashboard" element={<AccountantDashboard />} />
            <Route
              path="fees"
              element={
                <RolePlaceholderPage
                  title="Fees"
                  description="Fee schedules and collections will be managed here."
                  backPath="/accountant/dashboard"
                  backLabel="Back to finance dashboard"
                />
              }
            />
            <Route
              path="payments"
              element={
                <RolePlaceholderPage
                  title="Payments"
                  description="Payment records and reconciliation workflows will appear here."
                  backPath="/accountant/dashboard"
                  backLabel="Back to finance dashboard"
                />
              }
            />
            <Route
              path="invoices"
              element={
                <RolePlaceholderPage
                  title="Invoices"
                  description="Invoice generation and finance documents will be available here."
                  backPath="/accountant/dashboard"
                  backLabel="Back to finance dashboard"
                />
              }
            />
            <Route
              path="expenses"
              element={
                <RolePlaceholderPage
                  title="Expenses"
                  description="Expense tracking and vendor entries will be managed here."
                  backPath="/accountant/dashboard"
                  backLabel="Back to finance dashboard"
                />
              }
            />
            <Route
              path="transactions"
              element={
                <RolePlaceholderPage
                  title="Transactions"
                  description="Transaction history and finance operations will be displayed here."
                  backPath="/accountant/dashboard"
                  backLabel="Back to finance dashboard"
                />
              }
            />
            <Route
              path="reports"
              element={
                <RolePlaceholderPage
                  title="Financial Reports"
                  description="Finance reports and summaries will be centralized here."
                  backPath="/accountant/dashboard"
                  backLabel="Back to finance dashboard"
                />
              }
            />
            <Route
              path="students-accounts"
              element={
                <RolePlaceholderPage
                  title="Students Accounts"
                  description="Student account balances and finance statements will be managed here."
                  backPath="/accountant/dashboard"
                  backLabel="Back to finance dashboard"
                />
              }
            />
            <Route
              path="settings"
              element={
                <RolePlaceholderPage
                  title="Settings"
                  description="Finance configuration and account preferences will be managed here."
                  backPath="/accountant/dashboard"
                  backLabel="Back to finance dashboard"
                />
              }
            />
          </Route>
        </Routes>
      }
    />
  );
};

export default AccountantRoutes;
