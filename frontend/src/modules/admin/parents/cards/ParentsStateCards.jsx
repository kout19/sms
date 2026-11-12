// modules/admin/components/ParentStatsCards.jsx
import { Users, UserCheck, UserX, GraduationCap } from "lucide-react";

export default function ParentStatsCards({ summary, isLoading }) {
  if (isLoading || !summary) return null;

  const cards = [
    { title: "Total Parents", subtitle: "All registered", value: summary.totalParents, icon: Users, iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
    { title: "Active", subtitle: `${summary.activePercentage}% of total`, value: summary.activeParents, icon: UserCheck, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { title: "Inactive", subtitle: "Deactivated accounts", value: summary.inactiveParents, icon: UserX, iconBg: "bg-rose-50", iconColor: "text-rose-600" },
    { title: "Linked Students", subtitle: "Across all parents", value: summary.linkedStudents, icon: GraduationCap, iconBg: "bg-sky-50", iconColor: "text-sky-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            </div>
          <p className="text-2xl font-bold text-gray-900 mt-3">{card.value}</p>
          <p className="text-sm text-gray-500">{card.title}</p>
          <p className="text-xs text-gray-400">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}