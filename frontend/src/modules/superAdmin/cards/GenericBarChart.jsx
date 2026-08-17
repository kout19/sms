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

const GenericBarChart = ({
  title = "BAR CHART",
  rightElement,
  data = [],
  xAxisKey = "name",
  bars = [], // Array of bar configs: [{ dataKey: "score", fill: "#2563EB", name: "Avg Score" }]
  isLoading = false,
}) => {
  return (
    <ChartCard title={title} rightElement={rightElement} isLoading={isLoading}>
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
            dataKey={xAxisKey}
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
          {/* Dynamically render all configured bars */}
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name || bar.dataKey}
              fill={bar.fill || "#2563EB"}
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default GenericBarChart;
