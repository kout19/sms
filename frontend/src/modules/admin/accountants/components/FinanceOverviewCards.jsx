import {
  Calculator,
  UserCheck,
  Clock,
  Activity,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Wallet,
} from "lucide-react";
import StatCard from "../cards/AccountantStatCard";
import { useFinanceOverview } from "../hooks/useAccountants";

export default function FinanceOverviewCards() {
  const { data, isLoading } = useFinanceOverview();
  if (isLoading || !data) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Calculator}
          value={data.totalAccountants}
          title="Finance Staff"
          subtitle="Total accountants"
          color="indigo"
        />
        <StatCard
          icon={UserCheck}
          value={data.activeToday}
          title="Active"
          subtitle="On duty today"
          color="emerald"
        />
        <StatCard
          icon={Clock}
          value={data.pendingTasks}
          title="Pending Tasks"
          subtitle="Require attention"
          color="amber"
        />
        <StatCard
          icon={Activity}
          value={data.transactionCount.toLocaleString()}
          title="Transactions"
          subtitle="This academic year"
          color="sky"
          trend={data.transactionTrend}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          tone="colored"
          color="emerald"
          icon={TrendingUp}
          value={`$${data.totalRevenue.toLocaleString()}`}
          title="Total Revenue"
          subtitle="2023-24 Academic Year"
        />
        <StatCard
          tone="colored"
          color="sky"
          icon={CreditCard}
          value={`$${data.collectedThisMonth.toLocaleString()}`}
          title="Collected This Month"
          subtitle="January 2024"
        />
        <StatCard
          tone="colored"
          color="amber"
          icon={AlertCircle}
          value={`$${data.outstandingFees.toLocaleString()}`}
          title="Outstanding Fees"
          subtitle={`${data.outstandingStudentCount} students pending`}
        />
        <StatCard
          tone="colored"
          color="purple"
          icon={Wallet}
          value={`$${data.disbursements.toLocaleString()}`}
          title="Disbursements"
          subtitle="Scholarships & Refunds"
        />
      </div>
    </div>
  );
}
