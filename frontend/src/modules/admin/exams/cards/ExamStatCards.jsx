import { CalendarCheck, CalendarClock, CheckCircle2, ClipboardList } from "lucide-react";

const cards = [
  { key: "scheduled", label: "SCHEDULED", icon: CalendarClock, color: "text-blue-600 bg-blue-50" },
  { key: "ongoing", label: "ONGOING", icon: CalendarCheck, color: "text-emerald-600 bg-emerald-50" },
  { key: "completed", label: "COMPLETED", icon: CheckCircle2, color: "text-purple-600 bg-purple-50" },
  { key: "total", label: "TOTAL EXAMS", icon: ClipboardList, color: "text-indigo-600 bg-indigo-50" },
];

export default function ExamStatCards({ stats, isLoading }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, color }) => (
        <div key={key} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-500">{label}</p>
            {isLoading ? (
              <div className="mt-3 h-7 w-12 animate-pulse rounded bg-slate-100" />
            ) : (
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats?.[key] ?? 0}</p>
            )}
          </div>
          <span className={`rounded-xl p-3 ${color}`}><Icon className="h-5 w-5" /></span>
        </div>
      ))}
    </div>
  );
}
