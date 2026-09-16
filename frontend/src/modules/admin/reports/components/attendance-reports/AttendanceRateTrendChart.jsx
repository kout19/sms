import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAttendanceTrend } from "../../hooks/useAttendanceReport";

export default function AttendanceRateTrendChart({ filters }) {
  const { data, isLoading } = useAttendanceTrend(filters);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Attendance Rate Trend</h3>
          <p className="text-sm text-gray-500">
            Monthly attendance rate over the academic year
          </p>
        </div>
        {data && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {data.badge}
          </span>
        )}
      </div>

      {isLoading || !data ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data.days}>
            <defs>
              <linearGradient
                id="attendanceTrendFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              domain={[80, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip formatter={(value) => `${value}%`} />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#attendanceTrendFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
