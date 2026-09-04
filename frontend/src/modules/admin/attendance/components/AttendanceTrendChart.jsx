import { TrendingUp } from "lucide-react";
import { useAttendanceTrend } from "../hooks/useAttendance";

export default function AttendanceTrendCard() {
  const { data, isLoading } = useAttendanceTrend();
  if (isLoading || !data) return null;

  const maxRate = 100;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Attendance Trend</h3>
          <p className="text-sm text-gray-500">
            Last {data.daysTracked} school days
          </p>
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" />
          {data.weekTrend} this week
        </span>
      </div>

      <div className="flex items-end gap-4 h-40 mb-2">
        {data.days.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500">{day.rate}%</span>
            <div className="w-full h-32 flex items-end">
              <div
                className={`w-full rounded-t-md transition-all ${day.isToday ? "bg-indigo-600" : "bg-indigo-200"}`}
                style={{ height: `${(day.rate / maxRate) * 100}%` }}
              />
            </div>
            <span
              className={`text-xs ${day.isToday ? "font-semibold text-indigo-600" : "text-gray-400"}`}
            >
              {day.label}
            </span>
            {day.isToday && (
              <span className="text-[10px] text-indigo-400">today</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600" /> Today
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-200" /> Previous
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-center">
        <div>
          <p className="text-lg font-bold text-indigo-600">{data.avgRate}%</p>
          <p className="text-xs text-gray-400">Avg Rate</p>
        </div>
        <div>
          <p className="text-lg font-bold text-emerald-600">
            {data.bestDayRate}%
          </p>
          <p className="text-xs text-gray-400">Best Day</p>
        </div>
        <div>
          <p className="text-lg font-bold text-amber-600">{data.lowestRate}%</p>
          <p className="text-xs text-gray-400">Lowest</p>
        </div>
      </div>
    </div>
  );
}
