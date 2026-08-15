import { useAuth } from "../../auth/hooks/useAuth";
import RolePlaceholderPage from "../../../shared/components/RolePlaceholderPage";
import  MetricCard  from "../../superAdmin/cards/MetricCard";

const DepartmentHeadDashboard = () => {
  const { user } = useAuth();
  console.log(user);




  // Backend for department overview must be like this: 
  // api end point must be difference from the super admin matric cards endpoint
//   {
//   "success": true,
//   "data": {
//     "teachersCount": { "value": 18, "subtext": "3 pending review", "indicatorColor": "bg-blue-600" },
//     "studentsCount": { "value": 724, "subtext": "across 12 classes", "indicatorColor": "bg-blue-600" },
//     "attendanceRate": { "value": "91.4%", "badgeText": "-2.1% this week", "subtext": "vs last week", "badgeColor": "text-emerald-600", "indicatorColor": "bg-amber-500" },
//     "avgPerformance": { "value": "72.8%", "badgeText": "+1.3%", "subtext": "vs last exam", "badgeColor": "text-emerald-600", "indicatorColor": "bg-emerald-600" },
//     "subjectsCount": { "value": 8, "subtext": "this semester", "indicatorColor": "bg-blue-600" },
//     "classesCount": { "value": 12, "subtext": "active", "indicatorColor": "bg-blue-600" },
//     "assignmentCompletion": { "value": "84%", "subtext": "7-day average", "indicatorColor": "bg-emerald-600" },
//     "pendingTasks": { "value": 6, "subtext": "require attention", "indicatorColor": "bg-red-500" }
//   }
// }

const deptCardConfigs=[
  {
    title: "Teachers",
    value: 18,
    subtext: "3 pending review",
    indicatorColor: "bg-blue-600",
  },
  {
    title: "Students",
    value: 724,
    subtext: "across 12 classes",
    indicatorColor: "bg-blue-600",
  },
  {
    title: "Attendance Rate",
    value: "91.4%",
    badgeText: "-2.1% this week",
    subtext: "vs last week",
    badgeColor: "text-emerald-600",
    indicatorColor: "bg-amber-500",
  },
  {
    title: "Average Performance",
    value: "72.8%",
    badgeText: "+1.3%",
    subtext: "vs last exam",
    badgeColor: "text-emerald-600",
    indicatorColor: "bg-emerald-600",
  },
  {
    title: "Subjects",
    value: 8,
    subtext: "this semester",
    indicatorColor: "bg-blue-600",
  },
  {
    title: "Classes",
    value: 12,
    subtext: "active",
    indicatorColor: "bg-blue-600",
  },
  {
    title: "Assignment Completion",
    value: "84%",
    subtext: "7-day average",
    indicatorColor: "bg-emerald-600",
  },
  {
    title: "Pending Tasks",
    value: 6,
    subtext: "require attention",
    indicatorColor: "bg-red-500",
  },
]

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-xl font-bold">Deaprtment Overview</h1>
          <p className="text-xs   text-slate-500">
            Natural Science Dept. Addis International Academy
          </p>
        </div>
        <div className="flex items-center gap-2 border bg-violet-50 rounded-lg px-3 py-1.5 border-violet-100 text-violet-500 text-xs">
          <div className="h-2 w-2 bg-violet-500 rounded-full"></div>
        
            Dept. Head . Semister 1 2026/27
          
        </div>
      </div>
      {/* Dept overciew cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {deptCardConfigs.map((cardConfig, index) => (
          <MetricCard key={index} {...cardConfig} />
        ))}
      </div>

      
    </div>
  );
};

export default DepartmentHeadDashboard;
