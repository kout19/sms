
// Severity Style Map (Prevents Tailwind string interpolation bugs)
const SEVERITY_STYLES = {
  critical: {
    container: "bg-red-50/70 border-red-100 text-red-950",
    dot: "bg-red-500 shadow-sm shadow-red-200",
    timeText: "text-red-400",
  },
  warning: {
    container: "bg-amber-50/70 border-amber-100 text-amber-950",
    dot: "bg-amber-500 shadow-sm shadow-amber-200",
    timeText: "text-amber-500",
  },
  info: {
    container: "bg-blue-50/70 border-blue-100 text-blue-950",
    dot: "bg-blue-500 shadow-sm shadow-blue-200",
    timeText: "text-blue-400",
  },
};

const SystemAlertsWidget = ({ alerts = [], isLoading }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          SYSTEM ALERTS
        </h3>
        {alerts.length > 0 && (
          <span className="text-[11px] font-medium text-slate-400">
            {alerts.length} active
          </span>
        )}
      </div>

      {/* Alert List */}
      {isLoading ? (
        <div className="text-xs text-slate-400 py-6 text-center">
          Loading system alerts...
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-xs text-slate-400 py-6 text-center bg-slate-50 rounded-md border border-dashed border-slate-200">
          All systems operational. No active alerts.
        </div>
      ) : (
        <div className="space-y-2.5">
          {alerts.map((alert) => {
            const style =
              SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;

            return (
              <div
                key={alert.id}
                className={`p-3 rounded-md border flex items-center justify-between transition-colors ${style.container}`}
              >
                {/* Left Side: Dot + Message */}
                <div className="flex items-center gap-3 pr-4 min-w-0">
                  <span
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${style.dot}`}
                  />
                  <p className="text-xs font-medium truncate leading-relaxed">
                    {alert.message}
                  </p>
                </div>

                {/* Right Side: Relative Timestamp */}
                <span
                  className={`text-[11px] whitespace-nowrap shrink-0 font-medium ${style.timeText}`}
                >
                  {alert.timeAgo}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SystemAlertsWidget;
