import StatCard from "@shared/components/StatCard";
import { formatNumber } from "@shared/utils/numberFormatter";
import { useFinanceReportOverview } from "../../hooks/useFinanceReport";

export default function FinanceReportSummaryCard({ filters }) {
  const { data, isLoading } = useFinanceReportOverview(filters);

  if (isLoading || !data) {
    return null;
  }

  const missingData = Boolean(data.missingData);

  return (
    <div className="mt-6 mb-6 space-y-4">
      {missingData && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {typeof data.missingData === "string" ? data.missingData : "Financial data is currently unavailable in the schema."}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          tone="accent"
          color="emerald"
          title="Total Revenue"
          value={formatNumber(data.totalRevenue)}
          trend={data.totalRevenueTrend}
          trendDirection="up"
          subtitle="No invoice ledger yet"
        />
        <StatCard
          tone="accent"
          color="indigo"
          title="Collected"
          value={formatNumber(data.collectedThisMonth)}
          trend={data.collectedTrend}
          trendDirection="up"
          subtitle="Successful cash-in only"
        />
        <StatCard
          tone="accent"
          color="rose"
          title="Outstanding"
          value={formatNumber(data.outstandingFees)}
          trend={data.outstandingFeesTrend}
          trendDirection="down"
          subtitle="No receivable ledger yet"
        />
        <StatCard
          tone="accent"
          color="amber"
          title="Expenses"
          value={formatNumber(data.expenses)}
          trend={data.expensesTrend}
          trendDirection="down"
          subtitle="No expense ledger yet"
        />
        <StatCard
          tone="accent"
          color="purple"
          title="Collection rate"
          value={formatNumber(data.collectionRate)}
          trend={data.collectionRateTrend}
          trendDirection="up"
          subtitle="Calculated only when ledger data exists"
        />
      </div>
    </div>
  );
}