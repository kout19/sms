
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "./ChartCard";

const PlatformRevenueChart = ({ data, isLoading }) => {
  return (
    <ChartCard
      title="PLATFORM REVENUE"
      rightElement="ETB thousands"
      isLoading={isLoading}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={6}
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
            cursor={{ fill: "#F8FAFC" }}
          />
          {/* Main Revenue Bar */}
          <Bar
            dataKey="revenue"
            fill="#2563EB"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
          {/* Secondary / Projected Bar */}
          <Bar
            dataKey="target"
            fill="#E2E8F0"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default PlatformRevenueChart;
