import { Calculator, UserCheck, UserX } from "lucide-react";
import StatCard from "../cards/AccountantStatCard";
import { useAccountantOverview } from "../hooks/useAccountants";

export default function FinanceOverviewCards() {
  const { data, isLoading, isError } = useAccountantOverview();

  if (isLoading) {
    return <p className="text-sm text-gray-400">Loading accountant summary...</p>;
  }
  if (isError) {
    return (
      <p role="alert" className="text-sm text-rose-600">
        Could not load the accountant summary.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        icon={Calculator}
        value={data.totalAccountants.toLocaleString()}
        title="Accountants"
        subtitle="Total in this school"
        color="indigo"
      />
      <StatCard
        icon={UserCheck}
        value={data.activeAccountants.toLocaleString()}
        title="Active"
        subtitle="Accounts enabled"
        color="emerald"
      />
      <StatCard
        icon={UserX}
        value={data.inactiveAccountants.toLocaleString()}
        title="Inactive"
        subtitle="Accounts disabled"
        color="amber"
      />
    </div>
  );
}
