export default function SettingRow({
  label,
  description,
  badge,
  children,
  isLast = false,
}) {
  return (
    <div
      className={`flex items-center justify-between py-4 ${isLast ? "" : "border-b border-gray-100"}`}
    >
      <div className="pr-6">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {badge && (
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}
