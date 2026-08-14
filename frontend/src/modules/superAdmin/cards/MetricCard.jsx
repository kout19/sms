import { formatNumber } from "../../../shared/utils/numberFormatter";
const MetricCard = ({ 
  title, 
  value, 
  badgeText, 
  subtext, 
  indicatorColor = "bg-blue-500", // Default dot indicator
  badgeColor = "text-emerald-600"  // Default positive growth color
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {/* Color Dot Indicator */}
        <span className={`h-2.5 w-2.5 rounded-full ${indicatorColor}`} />
      </div>

      {/* Main Metric Value */}
      <div className="text-3xl font-bold text-slate-900 mb-2">
        {formatNumber(value)}
      </div>

      {/* Footer / Subtext Row */}
      <div className="flex items-center text-xs font-medium space-x-1.5">
        {badgeText && (
          <span className={`${badgeColor} font-semibold`}>{badgeText}</span>
        )}
        {subtext && <span className="text-slate-400">{subtext}</span>}
      </div>
    </div>
  );
};

export default MetricCard;