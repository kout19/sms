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
import { useExpensesByCategory } from "../../hooks/useFinanceReport";

export default function ExpensesByCategoryCard({ filters }) {
  const { data, isLoading } = useExpensesByCategory(filters);
  if (isLoading || !data) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900">Expenses by Category</h3>
      <p className="text-sm text-gray-500 mb-5">
        Total expenses:{" "}
        <span className="font-semibold text-gray-700">
          ${data.total.toLocaleString()}
        </span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          {data.categories.map((c) => (
            <div key={c.category}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-700">{c.category}</span>
                <span className="font-semibold text-gray-900">
                  ${c.amount.toLocaleString()}{" "}
                  <span className="text-gray-400 font-normal">({c.pct}%)</span>
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data.categories}
            layout="vertical"
            margin={{ left: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#f1f5f9"
            />
            <XAxis
              type="number"
              tickFormatter={(v) => `$${v / 1000}K`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
            />
            <YAxis
              type="category"
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              width={90}
            />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={16}>
              {data.categories.map((c) => (
                <Cell key={c.category} fill={c.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
