import { Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import StateCard from "../cards/StateCard";
import AttendanceTrendChart from "../components/AttendanceTrendChart";
import EnrollmentByGradeChart from "../components/EnrollmentByGradeChart";
import DepartmentDistributionChart from "../components/DepartmentDistributionChart";
import RecentActivitiesCard from "../cards/RecentActivitiesCard";
import { useAdminOverview } from "../hooks/useAdminDashboard";

const AdminDashboard = () => {
  const { data, isLoading, isError, error, refetch } = useAdminOverview();
  const overview = data || {};

  const cards = [
    {
      title: "Total Students",
      value: overview.totalStudents ? overview.totalStudents.toLocaleString() : "1,284",
      change: "+12 from last month",
      isPosetive: true,
      icon: Users,
      iconBgColor: "bg-blue-600",
    },
    {
      title: "Total Teachers",
      value: overview.totalTeachers ? overview.totalTeachers.toLocaleString() : "87",
      change: "+2 from last month",
      isPosetive: true,
      icon: GraduationCap,
      iconBgColor: "bg-green-600",
    },
    {
      title: "Total Classes",
      value: overview.totalClasses ? overview.totalClasses.toLocaleString() : "42",
      change: "+2 from last month",
      isPosetive: true,
      icon: BookOpen,
      iconBgColor: "bg-indigo-700",
    },
    {
      title: "Total Attendance",
      value: overview.attendanceRate ? `${overview.attendanceRate.toFixed(1)}` : "94.2",
      change: "+2.1 from last month",
      isPosetive: true,
      icon: TrendingUp,
      iconBgColor: "bg-red-600",
    },
  ];

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load dashboard: {error?.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-6">
      <div>
        <div className="flex items-center  ">
          <h1 className="text-slate-600 ">Welcome back! Here is what's happening in your school.</h1>
        </div>
        <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-4   lg:gap-2">
          {cards.map((card, index) => (
            <StateCard
              key={index}
              title={card.title}
              value={card.value}
              change={card.change}
              isPosetive={card.isPosetive}
              icon={card.icon}
              iconBgColor={card.iconBgColor}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <AttendanceTrendChart />
          <EnrollmentByGradeChart />
          <DepartmentDistributionChart />
          <RecentActivitiesCard />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
