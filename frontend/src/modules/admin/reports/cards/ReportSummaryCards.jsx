import StatCard from "@shared/components/StatCard";
import { useAcademicOverview } from "../hooks/useAcademicReports";

export default function ReportSummaryCards({ filters }) {
  const { data, isLoading } = useAcademicOverview(filters);
  if (isLoading || !data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        tone="accent"
        color="indigo"
        title="Average Score"
        value={`${data.averageScore}%`}
        trend={data.averageScoreTrend}
        trendDirection="up"
        subtitle="Class avg across all subjects"
      />
      <StatCard
        tone="accent"
        color="emerald"
        title="Pass Rate"
        value={`${data.passRate}%`}
        trend={data.passRateTrend}
        trendDirection="up"
        subtitle={data.passRateDetail}
      />
      <StatCard
        tone="accent"
        color="rose"
        title="Failed Students"
        value={data.failedStudents}
        trend={data.failedStudentsTrend}
        trendDirection="down"
        subtitle="Score below 50"
      />
      <StatCard
        tone="accent"
        color="amber"
        title="Top Performers"
        value={data.topPerformersCount}
        trend={data.topPerformersTrend}
        trendDirection="up"
        subtitle="Score 90% and above"
      />
    </div>
  );
}
