import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useScoreTrend } from "../hooks/useAcademicReports";

export default function ScoreTrendChart({ filters }) {
  const { data = [], isLoading } = useScoreTrend(filters);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Score Trend</h3>
          <p className="text-sm text-gray-500">
            Average score and pass rate over time
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600" /> Avg Score
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Pass Rate
          </span>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="avgScoreFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="passRateFill" x1="0" y1="0" x2="0" y2="1">
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
              domain={[60, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip formatter={(value) => `${value}%`} />
            <Area
              type="monotone"
              dataKey="passRate"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#passRateFill)"
            />
            <Area
              type="monotone"
              dataKey="avgScore"
              stroke="#4f46e5"
              strokeWidth={2}
              fill="url(#avgScoreFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
