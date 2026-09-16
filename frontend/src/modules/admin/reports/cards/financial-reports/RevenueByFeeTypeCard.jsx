import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useRevenueByFeeType } from "../../hooks/useFinanceReport";

export default function RevenueByFeeTypeCard({ filters }) {
  const { data, isLoading } = useRevenueByFeeType(filters);
  if (isLoading || !data) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900">Revenue by Fee Type</h3>
      <p className="text-sm text-gray-500 mb-4">
        Distribution of expected revenue across fee categories
      </p>

      <div className="flex items-center gap-6">
        <div className="relative w-40 h-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.categories}
                dataKey="expected"
                nameKey="category"
                innerRadius={55}
                outerRadius={78}
                paddingAngle={2}
                stroke="none"
              >
                {data.categories.map((c) => (
                  <Cell key={c.category} fill={c.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {data.overallCollectedPct}%
            </span>
            <span className="text-xs text-gray-400">collected</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {data.categories.map((c) => (
            <div key={c.category}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-1.5 text-gray-700">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.category}
                </span>
                <span className="font-semibold text-gray-900">{c.pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
