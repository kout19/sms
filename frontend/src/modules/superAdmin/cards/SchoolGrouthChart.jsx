
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "./ChartCard";

const SchoolGrowthChart = ({ data, isLoading }) => {
  return (
    <ChartCard
      title="SCHOOL GROWTH"
      rightElement="6-month view"
      isLoading={isLoading}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right:10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#F1F5F9"
          />
          <XAxis
            dataKey="month"
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFF",
              borderRadius: "8px",
              borderColor: "#E2E8F0",
            }}
            labelStyle={{ fontWeight: "bold", color: "#334155" }}
          />
          {/* Active Schools Line */}
          <Line
            type="monotone"
            dataKey="active"
            stroke="#2563EB" // Blue
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
          {/* Total Schools Line */}
          <Line
            type="monotone"
            dataKey="total"
            stroke="#8B5CF6" // Purple
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default SchoolGrowthChart;
