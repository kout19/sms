import { useAuth } from "../../auth/hooks/useAuth";
import { dateFromatter } from "../../../shared/utils/dateFromatter";
import MetricCard from "../cards/MetricCard";
import SchoolGrowthChart from "../cards/SchoolGrouthChart";
import GenericBarChart from "../cards/GenericBarChart";
import SchoolOverviewWidget from "../cards/SchoolOverviewWidget";
import SystemAlertsWidget from "../cards/SystemAlertsWidget";

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  console.log(user);
  // const [stats, setStats] = useState(null);
  //  const [chartData, setChartData] = useState(null);
  // cosnt [loading, setLoading] = useState(true);

  // Backend response for this must like this:
  // {
  //   "success": true,
  //   "data": {
  //     "totalSchools": { "value": 58, "badge": "+4 this month", "subtext": "vs 54 last month", "trend": "positive" },
  //     "activeSchools": { "value": 55, "badge": "+3 this month", "subtext": "94.8% active rate", "trend": "positive" },
  //     "totalStudents": { "value": "42,840", "badge": "+1,240", "subtext": "across all schools", "trend": "positive" },
  //     "monthlyRevenue": { "value": "ETB 8.4M", "badge": "+12.3%", "subtext": "vs July 2026", "trend": "positive" },
  //     "totalTeachers": { "value": "3,218", "badge": null, "subtext": "platform-wide", "trend": "neutral" },
  //     "activeSubscriptions": { "value": 52, "badge": null, "subtext": "3 in trial", "trend": "neutral" },
  //     "systemAlerts": { "value": 3, "badge": null, "subtext": "1 critical", "trend": "danger" },
  //     "pendingRenewals": { "value": 5, "badge": null, "subtext": "expiring < 30d", "trend": "warning" }
  //   }
  // }
  const cardConfigs = [
    {
      title: "TOTAL SCHOOLS",
      value: 58,
      badgeText: "+4 this month",
      subtext: "vs last month",
      indicatorColor: "bg-purple-600",
      badgeColor: "text-emerald-600",
    },
    {
      title: "ACTIVE SCHOOLS",
      value: 55,
      badgeText: "+3 this month",
      subtext: "94.8 active rate",
      indicatorColor: "bg-blue-600",
      badgeColor: "text-emerald-600",
    },
    {
      title: "TOTAL STUDENTS",
      value: 42840,
      badgeText: "+12 from last month",
      subtext: "across all schools",
      indicatorColor: "bg-blue-600",
      badgeColor: "text-emerald-600",
    },
    {
      title: "MONTHLY REVENUE",
      value: 8400000,
      badgeText: "+12.3% from last month",
      subtext: "vs July 2025",
      indicatorColor: "bg-emerald-600",
      badgeColor: "text-emerald-600",
    },
    {
      title: "TOTAL TEACHERS",
      value: 3218,
      subtext: "Platform wide",
      indicatorColor: "bg-blue-600",
    },
    {
      title: "ACTIVE SUBSCRIPTIONS",
      value: 52,
      subtext: "3 in trial",
      indicatorColor: "bg-emerald-600",
    },
    {
      title: "SYSTEM ALERTS",
      value: 3,
      subtext: "1 in critical",
      indicatorColor: "bg-red-500",
      badgeColor: "text-red-600",
    },
    {
      title: "PENDING RENEWALS",
      value: 5,
      subtext: "expring <30d",
      indicatorColor: "bg-amber-500",
      badgeColor: "text-amber-600",
    },
  ];

  // Backend resoponse for charts must be like this:
  //   {
  //   "success": true,
  //   "data": {
  //     "schoolGrowth": [
  //       { "month": "Mar", "active": 38, "total": 42 },
  //       { "month": "Apr", "active": 41, "total": 45 },
  //       { "month": "May", "active": 44, "total": 47 },
  //       { "month": "Jun", "active": 48, "total": 51 },
  //       { "month": "Jul", "active": 51, "total": 54 },
  //       { "month": "Aug", "active": 55, "total": 58 }
  //     ],
  //     "platformRevenue": [
  //       { "month": "Mar", "revenue": 840, "target": 500 },
  //       { "month": "Apr", "revenue": 920, "target": 580 },
  //       { "month": "May", "revenue": 750, "target": 500 },
  //       { "month": "Jun", "revenue": 1100, "target": 620 },
  //       { "month": "Jul", "revenue": 1200, "target": 700 },
  //       { "month": "Aug", "revenue": 980, "target": 600 }
  //     ]
  //   }
  // }

  const schoolGrowth = [
    { month: "Mar", active: 38, total: 42 },
    { month: "Apr", active: 41, total: 45 },
    { month: "May", active: 44, total: 47 },
    { month: "Jun", active: 48, total: 51 },
    { month: "Jul", active: 51, total: 54 },
    { month: "Aug", active: 55, total: 58 },
  ];
  const platformRevenu = [
    { month: "Mar", revenue: 840, expense: 500 },
    { month: "Apr", revenue: 920, expense: 580 },
    { month: "May", revenue: 750, expense: 500 },
    { month: "Jun", revenue: 1100, expense: 620 },
    { month: "Jul", revenue: 1200, expense: 700 },
    { month: "Aug", revenue: 980, expense: 600 },
  ];

  // Schools table must backend must like this:
  // {
  //   "success": true,
  //   "count": 3,
  //   "data": [
  //     {
  //       "id": "sch_01",
  //       "code": "SCH-1001",
  //       "name": "Haile Academy",
  //       "status": "Active",
  //       "studentCount": 1240,
  //       "teacherCount": 85,
  //       "plan": "Enterprise",
  //       "email": "info@haileacademy.edu.et",
  //       "logoUrl": null
  //     },
  //     {
  //       "id": "sch_02",
  //       "code": "SCH-1002",
  //       "name": "Bole Community School",
  //       "status": "Active",
  //       "studentCount": 850,
  //       "teacherCount": 42,
  //       "plan": "Standard",
  //       "email": "admin@bolecommunity.com",
  //       "logoUrl": null
  //     }
  //   ]
  // }

  const schoolsCard = [
    {
      id: "sch_01",
      code: "SCH-1001",
      name: "Haile Academy",
      status: "Active",
      studentCount: 1240,
      teacherCount: 85,
      plan: "Enterprise",
      email: "info@haileacademy.edu.et",
      logoUrl: null,
    },
    {
      id: "sch_02",
      code: "SCH-1002",
      name: "Bole Community School",
      status: "Active",
      studentCount: 850,
      teacherCount: 42,
      plan: "Standard",
      email: "admin@bolecommunity.com",
      logoUrl: null,
    },
    {
      id: "sch_03",
      code: "SCH-1003",
      name: "Bole Community School",
      status: "Active",
      studentCount: 850,
      teacherCount: 42,
      plan: "Standard",
      email: "admin@bolecommunity.com",
      logoUrl: null,
    },
  ];

  // System Alert backend must like this:
  // {
  //   "success": true,
  //   "data": [
  //     {
  //       "id": "alt_01",
  //       "severity": "critical",
  //       "message": "3 failed login spike at Unity Academy — 47 attempts in 2h",
  //       "timeAgo": "12 min ago",
  //       "timestamp": "2026-08-14T21:20:00Z"
  //     },
  //     {
  //       "id": "alt_02",
  //       "severity": "warning",
  //       "message": "Subscription expiring: Capital School, Sunrise International, + 3 more in 14 days",
  //       "timeAgo": "2h ago",
  //       "timestamp": "2026-08-14T19:30:00Z"
  //     },
  //     {
  //       "id": "alt_03",
  //       "severity": "info",
  //       "message": "v2.4.1 patch deployment queued for 15 Aug 02:00 UTC",
  //       "timeAgo": "5h ago",
  //       "timestamp": "2026-08-14T16:30:00Z"
  //     }
  //   ]
  // }

  const systemAlerts = [
    {
      id: "alt_01",
      severity: "critical",
      message: "3 failed login spike at Unity Academy — 47 attempts in 2h",
      timeAgo: "12 min ago",
      timestamp: "2026-08-14T21:20:00Z",
    },
    {
      id: "alt_02",
      severity: "warning",
      message:
        "Subscription expiring: Capital School, Sunrise International, + 3 more in 14 days",
      timeAgo: "2h ago",
      timestamp: "2026-08-14T19:30:00Z",
    },
    {
      id: "alt_03",
      severity: "info",
      message: "v2.4.1 patch deployment queued for 15 Aug 02:00 UTC",
      timeAgo: "5h ago",
      timestamp: "2026-08-14T16:30:00Z",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between ">
        <div className="">
          <h1 className="text-2xl font-bold text-slate-900">
            Plarform Overview
          </h1>
          <span className="text-sm text-slate-600">
            All Schools -- {dateFromatter(user?.lastLogin)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs py-1.5 px-3  bg-violet-100 rounded-md border-violet-50 ">
          <span className="w-2 h-2 bg-violet-600 rounded-full"></span>
          <span className="text-violet-700 ">
            {user?.role || "Super Admin"} All Tenants
          </span>
        </div>
      </div>

      {/* Meteric Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cardConfigs.map((card, index) => (
          <MetricCard
            key={index}
            title={card.title}
            value={card.value}
            badgeText={card.badgeText}
            subtext={card.subtext}
            indicatorColor={card.indicatorColor}
            badgeColor={card.badgeColor}
          />
        ))}
      </div>

      {/* Chart cards */}
      <div className="grid  grid-cols-1 lg:grid-cols-2  gap-6">
        <SchoolGrowthChart data={schoolGrowth} />
        <GenericBarChart
          title="Revenue vs Expense"
          rightElement="ETB Thousands :6 months"
          data={platformRevenu}
          xAxisKey="month"
          bars={[
            { dataKey: "revenue", fill: "#2563EB", name: "Revenue (ETB)" },
            { dataKey: "expense", fill: "#DBEAFE", name: "Expense (ETB)" },
          ]}
        />
      </div>
      {/* School table card */}
      <div className="">
        <SchoolOverviewWidget schools={schoolsCard} />
      </div>
      {/* System alert cards */}
      <div>
        <SystemAlertsWidget alerts={systemAlerts} />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
