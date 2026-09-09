import React from "react";
import {
  ChevronRight,
  AlertTriangle,
  Activity,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const ICON_MAP = {
  AlertTriangle,
  Activity,
  DollarSign,
  TrendingUp,
};

const VARIANT_STYLES = {
  danger: {
    border: "border-rose-100 hover:border-rose-300",
    iconBg: "bg-rose-100/70 text-rose-500",
  },
  warning: {
    border: "border-amber-100 hover:border-amber-300",
    iconBg: "bg-amber-100/70 text-amber-600",
  },
  purple: {
    border: "border-purple-100 hover:border-purple-300",
    iconBg: "bg-purple-100/70 text-purple-600",
  },
  success: {
    border: "border-emerald-100 hover:border-emerald-300",
    iconBg: "bg-emerald-100/70 text-emerald-600",
  },
};

const QuickInsightCard = ({
  title,
  subtitle,
  icon,
  type = "danger",
  onClick,
}) => {
  const styles = VARIANT_STYLES[type] || VARIANT_STYLES.danger;
  const IconComponent = ICON_MAP[icon] || AlertTriangle;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border ${styles.border} p-6 flex items-center justify-between cursor-pointer transition-all duration-150 shadow-2xs hover:shadow-xs group`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg}`}
        >
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0 ml-2" />
    </div>
  );
};

export default QuickInsightCard;
