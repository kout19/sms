import QuickInsightCard from "../cards/QuickInsightCard";
import { useQuickInsights } from "../hooks/useReport";

const QuickInsightsSection = ({ onNavigate }) => {
  const { data: insights, isLoading } = useQuickInsights();

  return (
    <div className="space-y-4 mt-4 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Quick Insights</h3>
        <span className="text-xs text-slate-400 font-medium">
          Items that need your attention
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse"
              />
            ))
          : insights?.map((item) => (
              <QuickInsightCard
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                type={item.type}
                icon={item.icon}
                onClick={() => onNavigate && onNavigate(item.action)}
              />
            ))}
      </div>
    </div>
  );
};

export default QuickInsightsSection;
