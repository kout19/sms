const SectionCard = ({ title, badge, action, children, className = "" }) => {
  return (
    <div
      className={`border border-slate-200 rounded-3xl p-6 bg-white shadow-sm ${className}`}
    >
      {(title || badge || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="font-semibold text-sm text-slate-800">{title}</h2>
          )}
          <div className="flex items-center gap-2">
            {badge && (
              <span className="text-xs text-slate-500 bg-gray-100 rounded-xl px-2 py-1">
                {badge}
              </span>
            )}
            {action}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default SectionCard;
