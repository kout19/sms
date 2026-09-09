import { GraduationCap, Users, DollarSign } from "lucide-react";
import ReportOverviewCard from "../cards/ReportOverviewCard";

const ReportsOverviewSection = ({ data, onNavigate }) => {
  const reportsData = data || {
    academic: { avgScore: "78%", passRate: "91%" },
    attendance: { attendanceRate: "91.4%", chronicAbsent: "3" },
    financial: { totalRevenue: "$485K", collectionRate: "81%" },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {/* Academic Performance */}
      <ReportOverviewCard
        theme="blue"
        icon={GraduationCap}
        title="Academic Performance"
        subtitle="Student grades & subject analytics"
        stat1Label="Avg Score"
        stat1Value={reportsData.academic.avgScore}
        stat2Label="Pass Rate"
        stat2Value={reportsData.academic.passRate}
        buttonText="View Academic Reports"
        onViewReport={() => onNavigate && onNavigate("academic")}
      />

      {/* Attendance Analytics */}
      <ReportOverviewCard
        theme="emerald"
        icon={Users}
        title="Attendance Analytics"
        subtitle="Historical patterns & trends"
        stat1Label="Attendance Rate"
        stat1Value={reportsData.attendance.attendanceRate}
        stat2Label="Chronic Absent"
        stat2Value={reportsData.attendance.chronicAbsent}
        buttonText="View Attendance Reports"
        onViewReport={() => onNavigate && onNavigate("attendance")}
      />

      {/* Financial Reports */}
      <ReportOverviewCard
        theme="purple"
        icon={DollarSign}
        title="Financial Reports"
        subtitle="Revenue, fees & expenses"
        stat1Label="Total Revenue"
        stat1Value={reportsData.financial.totalRevenue}
        stat2Label="Collection Rate"
        stat2Value={reportsData.financial.collectionRate}
        buttonText="View Financial Reports"
        onViewReport={() => onNavigate && onNavigate("financial")}
      />
    </div>
  );
};

export default ReportsOverviewSection;
