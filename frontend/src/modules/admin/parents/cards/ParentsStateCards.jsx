// modules/admin/components/ParentStatsCards.jsx
import { Users, UserCheck, UserX, GraduationCap } from "lucide-react";
import { useParents } from "../hooks/useParents";

export default function ParentStatsCards() {
  const { data, isLoading } = useParents();
  if (isLoading || !data) return null;

  const cards = [
    { title: "Total Parents", subtitle: "All registered", value: data.totalParents, trend: data.totalParentsTrend, icon: Users, iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
    { title: "Active", subtitle: `${data.activePercentage} of total`, value: data.activeParents, trend: data.activeParentsTrend, icon: UserCheck, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { title: "Inactive", subtitle: "Need follow-up", value: data.inactiveParents, trend: null, icon: UserX, iconBg: "bg-rose-50", iconColor: "text-rose-600" },
    { title: "Linked Students", subtitle: "Across all parents", value: data.linkedStudents, trend: data.linkedStudentsTrend, icon: GraduationCap, iconBg: "bg-sky-50", iconColor: "text-sky-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            {card.trend && <span className="text-xs font-medium text-emerald-600">{card.trend}</span>}
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-3">{card.value}</p>
          <p className="text-sm text-gray-500">{card.title}</p>
          <p className="text-xs text-gray-400">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}