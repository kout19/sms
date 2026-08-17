import { useAuth } from "../../auth/hooks/useAuth";
import RolePlaceholderPage from "../../../shared/components/RolePlaceholderPage";

const AccountantDashboard = () => {
  const { user } = useAuth();
  console.log(user);

  return (
    <div className="space-y-6 p-6">
      <div>
        <div>
          <h1>Finance Overview</h1>
          <span>{user?.school?.name || "No defined school"}</span>
        </div>
        <div>
          <div className="w-2 h-2 bg-green-500"></div>
          Finance Officer . A.A
        </div>
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
