import { useAttendanceReportOverview } from "../../hooks/useAttendanceReport";
import StatCard from "@shared/components/StatCard";

export default function AttendanceReportSummaryCard() {
  const { data, isLoading } = useAttendanceReportOverview();
  if (isLoading || !data) return null;

  return (
    <div  className="mt-6 mb-6">
      <div className="grid grid-cols-2  lg:grid-cols-5 gap-4">
        <StatCard
          tone="accent"
          color="emerald"
          title="Attendance Rate"
          value={`${data.attendanceRate}%`}
          trend={data.attendanceRateTrend}
          trendDirection="up"
          subtitle="Overall avg"
        />
        <StatCard
          tone="accent"
          color="rose"
          title="Chronic Absent"
          value={data.presentDays}
          trend={data.presentDaysTrend}
          trendDirection="up"
          subtitle="Total present"
        />
        <StatCard
          tone="accent"
          color="indigo"
          title="Late Arrivals"
          value={data.absentDays}
          trend={data.absentDaysTrend}
          trendDirection="up"
          subtitle="Total absent"
        />
        <StatCard
          tone="accent"
          color="rose"
          title="Absent Today"
          value={data.lateArivals}
          trend={data.lateArivalsTrend}
          trendDirection="up"
          subtitle="Total late"
        />
        <StatCard
          tone="accent"
          color="emerald"
          title="Chronic Absent"
          value={data.chronicAbsence}
          trend={data.chronicAbsenceTrend}
          trendDirection="down"
          subtitle="Below 75%"
        />
      </div>
    </div>
  );
}
