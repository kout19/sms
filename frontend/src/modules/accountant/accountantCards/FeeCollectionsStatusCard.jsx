
const FeeCollectionStatusCard = ({
  title = "FEE COLLECTION STATUS — AUGUST 2026",
  expectedTotal = "ETB 4,200,000",
  metrics = [
    {
      label: "Expected",
      amount: "4.20M ETB",
      percentage: 100,
      color: "bg-slate-300",
    },
    {
      label: "Collected",
      amount: "3.11M ETB",
      percentage: 74,
      color: "bg-emerald-500",
    },
    {
      label: "Outstanding",
      amount: "1.09M ETB",
      percentage: 26,
      color: "bg-red-400",
    },
  ],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="space-y-3">
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          {title}
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          Expected: {expectedTotal}
        </span>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {metrics.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
              <span>{item.label}</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <span>{item.amount}</span>
                <span className="text-slate-400 font-normal text-[11px]">
                  {item.percentage}%
                </span>
              </div>
            </div>
            {/* Horizontal Track */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                style={{
                  width: `${Math.min(Math.max(item.percentage, 0), 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeeCollectionStatusCard;
