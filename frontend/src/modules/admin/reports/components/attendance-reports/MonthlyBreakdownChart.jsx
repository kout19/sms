import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMonthlyBreakdown } from "../../hooks/useAttendanceReport";

export default function MonthlyBreakdownChart({ filters }) {
  const { data = [], isLoading } = useMonthlyBreakdown(filters);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <h3 className="font-semibold text-gray-900">Monthly Breakdown</h3>
      <p className="text-sm text-gray-500 mb-4">
        Present, absent, and late by month
      </p>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
              />
              <Tooltip />
              <Bar dataKey="absent" stackId="a" fill="#f43f5e" />
              <Bar
                dataKey="late"
                stackId="a"
                fill="#f59e0b"
                // radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="present"
                stackId="a"
                fill="#10b981"
                radius={[4,4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-5 mt-3 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Present
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Absent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Late
            </span>
          </div>
        </>
      )}
    </div>
  );
}
