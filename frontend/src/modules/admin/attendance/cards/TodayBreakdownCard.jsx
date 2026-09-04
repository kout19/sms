import { useTodayBreakdown } from "../hooks/useAttendance";
import { ATTENDANCE_STATUSES } from "../constants/colorConstants";

export default function TodayBreakdownCard() {
  const { data, isLoading } = useTodayBreakdown();
  if (isLoading || !data) return null;

  const rows = [
    { key: "present", count: data.present },
    { key: "absent", count: data.absent },
    { key: "late", count: data.late },
    { key: "excused", count: data.excused },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Today's Breakdown</h3>

      <div className="space-y-4">
        {rows.map(({ key, count }) => {
          const style = ATTENDANCE_STATUSES[key];
          const pct = data.total ? Math.round((count / data.total) * 100) : 0;
          return (
            <div key={key}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-1.5 text-gray-700">
                  <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                  {style.label}
                </span>
                <span className="font-semibold text-gray-900">
                  {count}{" "}
                  <span className="text-gray-400 font-normal">({pct}%)</span>
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${style.bar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-6 mb-3">
        By Grade
      </p>
      <div className="space-y-3">
        {data.byGrade.map((g) => (
          <div key={g.grade} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-16 flex-shrink-0">
              {g.grade}
            </span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-400"
                style={{ width: `${g.rate}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 w-10 text-right">
              {g.rate}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
