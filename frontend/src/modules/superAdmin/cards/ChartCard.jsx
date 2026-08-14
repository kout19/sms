

const ChartCard = ({ title, subtitle, rightElement, children, isLoading }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col justify-between w-full">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {/* Optional Right Action (e.g., '6-month view' tag, dropdown, or currency badge) */}
        {rightElement && (
          <div className="text-xs text-slate-400 font-medium">
            {rightElement}
          </div>
        )}
      </div>

      {/* Body / Chart Area */}
      <div className="w-full h-64">
        {isLoading ? (
          <div className="w-full h-full animate-pulse bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400">
            Loading chart data...
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartCard;
