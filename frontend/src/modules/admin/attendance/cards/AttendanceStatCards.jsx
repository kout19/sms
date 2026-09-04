import { CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";
import StatCard from "@shared/components/StatCard";
import { useAttendanceStats } from "../hooks/useAttendance";

export default function AttendanceStatsCards() {
  const { data, isLoading } = useAttendanceStats();
  if (isLoading || !data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={CheckCircle2}
        value={data.presentToday}
        title="Present Today"
        subtitle={`of ${data.totalStudents} students`}
        color="emerald"
      />
      <StatCard
        icon={XCircle}
        value={data.absentToday}
        title="Absent Today"
        subtitle={`${data.absentRate}% absence rate`}
        color="rose"
      />
      <StatCard
        icon={Clock}
        value={data.lateArrivals}
        title="Late Arrivals"
        subtitle={`After ${data.lateCutoff}`}
        color="amber"
      />
      <StatCard
        icon={TrendingUp}
        value={`${data.attendanceRate}%`}
        title="Attendance Rate"
        subtitle="Present + Late"
        color="indigo"
      />
    </div>
  );
}
