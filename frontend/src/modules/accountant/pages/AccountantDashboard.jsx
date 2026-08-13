import { useAuth } from "../../auth/hooks/useAuth";
import RolePlaceholderPage from "../../../shared/components/RolePlaceholderPage";

const AccountantDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Finance operations
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Welcome, {user?.firstName || "Accountant"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Review fees, invoices, payments, and financial oversight from a
          dedicated finance workspace.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RolePlaceholderPage
          title="Finance overview"
          description="Revenue, expense summaries, and payment status snapshots will be surfaced here."
          backPath="/accountant/dashboard"
          backLabel="Stay on finance dashboard"
        />
        <RolePlaceholderPage
          title="Finance actions"
          description="Accounting workflows, transaction review, and reporting views will be introduced in the next stage."
          backPath="/accountant/dashboard"
          backLabel="Stay on finance dashboard"
        />
      </div>
    </div>
  );
};

export default AccountantDashboard;
