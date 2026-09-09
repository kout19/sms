import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useGradePerformance } from "../hooks/useAcademicReports";

export default function GradePerformanceChart({ filters }) {
  const { data = [], isLoading } = useGradePerformance(filters);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900">Performance by Grade</h3>
      <p className="text-sm text-gray-500 mb-4">Average score and pass rate per grade level</p>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
            <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="avgScore" name="Avg Score" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="passRate" name="Pass Rate" fill="#86efac" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}