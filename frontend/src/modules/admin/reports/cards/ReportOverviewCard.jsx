import React from "react";
import { ArrowRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";

const THEME_STYLES = {
  indigo: {
    headerBg: "bg-gradient-to-r from-blue-600 to-purple-500",
    strokeColor: "#6366f1",
    buttonBg: "bg-indigo-50/70 text-indigo-600 hover:bg-indigo-700 hover:text-white",
    secondStatColor: "text-slate-900",
  },
  emerald: {
    headerBg: "bg-gradient-to-r from-emerald-600 to-emerald-500",
    strokeColor: "#10b981",
    buttonBg: "bg-emerald-50/70 text-emerald-600 hover:bg-emerald-700 hover:text-white",
    secondStatColor: "text-rose-500",
  },
  purple: {
    headerBg: "bg-gradient-to-r from-purple-700 to-indigo-600",
    strokeColor: "#8b5cf6",
    buttonBg: "bg-purple-50/70 text-purple-600 hover:bg-purple-700 hover:text-white",
    secondStatColor: "text-slate-900",
  },
};

// Default Recharts data structure
const DEFAULT_CHART_DATA = [
  { val: 15 },
  { val: 11 },
  { val: 16 },
  { val: 12 },
  { val: 8 },
];

const ReportOverviewCard = ({
  title,
  subtitle,
  icon: Icon,
  stat1Label,
  stat1Value,
  stat2Label,
  stat2Value,
  buttonText,
  onViewReport,
  theme = "indigo",
  chartData = DEFAULT_CHART_DATA,
}) => {
  const styles = THEME_STYLES[theme] || THEME_STYLES.indigo;
  const gradientId = `recharts-grad-${theme}`;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between transition-all hover:shadow-md">
      {/* Header Banner */}
      <div className={`p-5 text-white relative overflow-hidden ${styles.headerBg}`}>
        <div className="absolute -right-6 -bottom-8 w-28 h-28 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute right-6 -top-10 w-24 h-24 bg-white/10 rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
            {Icon && <Icon className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="text-xs text-white/80 font-medium">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="h-16 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={styles.strokeColor} stopOpacity={0.25} />
                <stop offset="100%" stopColor={styles.strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Invisible Tooltip to trigger hover cursor pointer detection */}
            <Tooltip
              content={() => null}
              cursor={false}
            />

            <Area
              type="monotone"
              dataKey="val"
              stroke={styles.strokeColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false} // Hidden by default
              activeDot={(props) => {
                const { cx, cy } = props;
                return (
                  <g key={`activedot-${cx}-${cy}`}>
                    {/* Pulsing halo indicator */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={7}
                      fill={styles.strokeColor}
                      opacity={0.25}
                      className="animate-ping"
                    />
                    {/* Center white pointer dot */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={3.5}
                      fill="#ffffff"
                      stroke={styles.strokeColor}
                      strokeWidth={2}
                    />
                  </g>
                );
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Row */}
      <div className="px-6 py-2 grid grid-cols-2 gap-4">
        <div>
          <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
            {stat1Label}
          </span>
          <span className="text-2xl font-bold text-slate-900">{stat1Value}</span>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
            {stat2Label}
          </span>
          <span className={`text-2xl font-bold ${styles.secondStatColor}`}>
            {stat2Value}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 pt-2">
        <button
          onClick={onViewReport}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors duration-150 ${styles.buttonBg}`}
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ReportOverviewCard;