import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useSubjectPerformance } from "../hooks/useAcademicReports";

function tierColor(score) {
  if (score >= 80) return "#10b981"; // emerald - strong
  if (score >= 70) return "#4f46e5"; // indigo - solid
  return "#f59e0b"; // amber - needs attention
}

export default function SubjectPerformanceChart({ filters }) {
  const { data = [], isLoading } = useSubjectPerformance(filters);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900">Subject Performance</h3>
      <p className="text-sm text-gray-500 mb-4">
        Average score by subject, highest first
      </p>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#f1f5f9"
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <YAxis
              type="category"
              dataKey="subject"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              width={50}
            />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={16}>
              {data.map((entry, index) => (
                <Cell key={index} fill={tierColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
