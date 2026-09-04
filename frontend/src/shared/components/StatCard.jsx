

const StatCard = ({
  icon: Icon,
  value,
  title,
  subtitle,
  color = "indigo",
  isLoading,
}) => {;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
      {/* Header Row: Title & Top Right Icon Badge */}
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl ${color} ${color}-100 text-${color}-500`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Value & Subtitle */}
      <div>
        {isLoading ? (
          <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md" />
        ) : (
          <div className="text-2xl font-bold text-slate-900 leading-tight">
            {value}
          </div>
        )}
        {subtitle && (
          <div className="text-xs text-slate-400 font-medium mt-1">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
