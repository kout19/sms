import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
// import RolePlaceholderPage from "../../../shared/components/RolePlaceholderPage";
import MetricCard from "../../superAdmin/cards/MetricCard";
import GenericBarChart from "../../superAdmin/cards/GenericBarChart";
import AttendanceAndEventsCard from "../deptCards/AttenndanceAdnEventsCard";
import TeacherOverviewWidget from "../deptCards/TeacherOverviewWidget";

const DepartmentHeadDashboard = () => {
  const { user } = useAuth();
  const[loading, setLoading] = useState(false);


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

  const deptCardConfigs = [
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
  ];
 const subjectPerformanceData = [
   { subject: "Math", avgScore: 84, passRate: 80 },
   { subject: "Physics", avgScore: 82, passRate: 75 },
   { subject: "Chemistry", avgScore: 79, passRate: 70 },
   { subject: "Biology", avgScore: 86, passRate: 85 },
   { subject: "English", avgScore: 89, passRate: 90 },
   { subject: "French", avgScore: 78, passRate: 65 },
   { subject: "Geography", avgScore: 85, passRate: 80 },
   { subject: "History", avgScore: 80, passRate: 70 },
 ];

//  attendance and eventes card

 const sampleAttendanceData = [
  { label: "Present", percentage: 91, color: "bg-emerald-500" },
  { label: "Absent", percentage: 6, color: "bg-red-400" },
  { label: "Late", percentage: 3, color: "bg-amber-400" },
];

 const sampleEventsData = [
  { id: 1, month: "Aug", day: "15", title: "Mid-Term Exam — Grade 10 Math" },
  {
    id: 2,
    month: "Aug",
    day: "17",
    title: "Teacher Observation: Mr. Getachew",
  },
  { id: 3, month: "Aug", day: "20", title: "Dept. Staff Meeting" },
];

// teacher Overview Widgets
const teacherOverviewWidgets = [
  {
    id:1,
  name:"John Doe",
  subject: "Math",
  attendance:"91.4%",
  assignmentCompletion:"84%",
  avgScore:"72.8%",
  status:"Active",
  },
  {
    id:2,
    name:"John Doe",
    subject: "Math",
    attendance:"91.4%",
    assignmentCompletion:"84%",
    avgScore:"72.8%",
    status:"Active",
  },
  {
    id:3,
    name:"John Doe",
    subject: "Math",
    attendance:"91.4%",
    assignmentCompletion:"84%",
    avgScore:"72.8%",
    status:"Active",
  }

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
      {/* Subject performance comaparision chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="">
        <GenericBarChart
          title="SUBJECT PERFORMANCE COMPARISON"
          rightElement="Avg score vs pass rate %"
          data={subjectPerformanceData}
          xAxisKey="subject"
          bars={[
            { dataKey: "avgScore", fill: "#2563EB", name: "Avg Score (%)" },
            { dataKey: "passRate", fill: "#DBEAFE", name: "Pass Rate (%)" },
          ]}
        />
      </div>
      <div className="lg:col-span-1">
        <AttendanceAndEventsCard
          attendance={sampleAttendanceData}
          events={sampleEventsData}
          isLoading={loading}
        />
      </div>
      </div>
      <div>
        <TeacherOverviewWidget
          teachers={teacherOverviewWidgets}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default DepartmentHeadDashboard;
