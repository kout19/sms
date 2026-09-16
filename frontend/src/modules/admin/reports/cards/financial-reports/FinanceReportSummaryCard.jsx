import {useFinanceReportOverview} from "../../hooks/useFinanceReport";
import StatCard from "@shared/components/StatCard";
import { formatNumber } from "@shared/utils/numberFormatter";

export default function FinanceReportSummaryCard() {
    const { data, isLoading } = useFinanceReportOverview();
    if (isLoading || !data) return null;

    return (
      <div className="mt-6 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            tone="accent"
            color="emerald"
            title="Total Revenue"
            value={formatNumber(data.totalRevenue)}
            trend={data.totalRevenueTrend}
            trendDirection="up"
            subtitle="Expected this year"
          />
          <StatCard
            tone="accent"
            color="indigo"
            title="Collected"
            value={formatNumber(data.collectedThisMonth)}
            trend={data.collectedTrend}
            trendDirection="up"
            subtitle="81% of total"
          />
          <StatCard
            tone="accent"
            color="rose"
            title="Outstanding"
            value={formatNumber(data.outstandingFees)}
            trend={data.outstandingFeesTrend}
            trendDirection="down"
            subtitle="Unpaid balance"
            />
          <StatCard
            tone="accent"
            color="amber"
            title="Expenses"
            value={formatNumber(data.expenses)}
            trend={data.expensesTrend}
            trendDirection="down"
            subtitle="Total outflows"
          />
          <StatCard
            tone="accent"
            color="purple"
            title="Collection rate"
            value={formatNumber(data.collectionRate)}
            trend={data.collectionRateTrend}
            trendDirection="up"
            subtitle="Paid of total owend"
            />
        </div>
      </div>
    );
}