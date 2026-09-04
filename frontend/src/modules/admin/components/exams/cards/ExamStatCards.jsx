import { Calendar, Clock, CheckCircle2, CalendarDays } from "lucide-react";

const STAT_ITEMS = [
  {
    id: "upcoming",
    title: "UPCOMING EXAMS",
    key: "upcoming",
    subKey: "upcomingSubtitle",
    icon: Calendar,
    bgColor: "bg-blue-50/80",
    iconColor: "text-blue-500",
  },
  {
    id: "active",
    title: "ACTIVE EXAMS",
    key: "active",
    subKey: "activeSubtitle",
    icon: Clock,
    bgColor: "bg-emerald-50/80",
    iconColor: "text-emerald-500",
  },
  {
    id: "completed",
    title: "COMPLETED",
    key: "completed",
    subKey: "completedSubtitle",
    icon: CheckCircle2,
    bgColor: "bg-purple-50/80",
    iconColor: "text-purple-500",
  },
  {
    id: "total",
    title: "TOTAL EXAMS",
    key: "total",
    subKey: "totalSubtitle",
    icon: CalendarDays,
    bgColor: "bg-indigo-50/80",
    iconColor: "text-indigo-500",
  },
];

const ExamStatCards = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_ITEMS.map((item) => {
        const IconComponent = item.icon;
        return (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {item.title}
              </span>
              <div className={`w-9 h-9 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                <IconComponent className={`w-4 h-4 ${item.iconColor}`} />
              </div>
            </div>

            <div className="mt-4 space-y-1">
              {isLoading ? (
                <div className="h-8 w-12 bg-slate-100 animate-pulse rounded-md" />
              ) : (
                <h3 className="text-2xl font-bold text-slate-900 leading-none">
                  {stats?.[item.key] ?? "0"}
                </h3>
              )}
              <p className="text-xs text-slate-400 font-medium">
                {stats?.[item.subKey] ?? ""}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExamStatCards;