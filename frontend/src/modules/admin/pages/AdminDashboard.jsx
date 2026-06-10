import { Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import StateCard from "../cards/StateCard";
import AttendanceTrendChart from "../components/AttendanceTrendChart";
import EnrollmentByGradeChart from "../components/EnrollmentByGradeChart";
import DepartmentDistributionChart from "../components/DepartmentDistributionChart";
import RecentActivitiesCard from "../components/RecentActivitiesCard";
const AdminDashboard = () => {
  const cards = [
    {
      title: "Total Students",
      value: "1,284",
      change: "+12 from last month",
      isPosetive: true,
      icon: Users,
      iconBgColor: "bg-blue-600",
    },
    {
      title: "Total Teachers",
      value: "87",
      change: "+2 from last month",
      isPosetive: true,
      icon: GraduationCap,
      iconBgColor: "bg-green-600",
    },
    {
      title: "Total Classes",
      value: "42",
      change: "+2 from last month",
      isPosetive: true,
      icon: BookOpen,
      iconBgColor: "bg-indigo-700",
    },
    {
      title: "Total Attendance",
      value: "94.2",
      change: "+2.1 from last month",
      isPosetive: true,
      icon: TrendingUp,
      iconBgColor: "bg-red-600",
    },
  ];

  return (
    <div className="w-full py-12 px-6">
      <div>
        <div className="flex items-center  ">
          <h1 className="text-slate-600 ">
            Welcome back! Here is what's happening in your school.
          </h1>
        </div>
        {/* Card part */}
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
