import { BookOpen, CheckCircle2, UserPlus, Building2 } from "lucide-react";

const SubjectMetricsGrid = ({
  data = {
    totalSubjects: 15,
    activeSubjects: 14,
    assignedSubjects: 15,
    departments: 6,
  },
  isLoading = false,
}) => {
  const cards = [
    {
      id: "total-subjects",
      title: "TOTAL SUBJECTS",
      value: data.totalSubjects,
      icon: BookOpen,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      id: "active-subjects",
      title: "ACTIVE SUBJECTS",
      value: data.activeSubjects,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      id: "assigned-subjects",
      title: "ASSIGNED SUBJECTS",
      value: data.assignedSubjects,
      icon: UserPlus,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "departments",
      title: "DEPARTMENTS",
      value: data.departments,
      icon: Building2,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs animate-pulse space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="w-24 h-3 bg-slate-200 rounded" />
              <div className="w-9 h-9 bg-slate-100 rounded-lg" />
            </div>
            <div className="w-8 h-8 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card) => {
        const IconComponent = card.icon;

        return (
          <div
            key={card.id}
            className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
          >
            {/* Top Row: Label and Icon Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                {card.title}
              </span>

              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.iconBg}`}
              >
                <IconComponent className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>

            {/* Bottom Row: Big Metric Value */}
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </h2>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubjectMetricsGrid;
