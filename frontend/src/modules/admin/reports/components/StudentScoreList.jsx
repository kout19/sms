import Avatar from "@shared/components/Avatar";

export default function StudentScoreList({
  title,
  dotColor,
  badgeText,
  badgeBg,
  badgeTextColor,
  cardBorderColor,
  columnLabel,
  rows,
  scoreColor,
  showGradeBadge,
}) {
  return (
    <div
      className={`bg-white rounded-2xl border p-6 ${cardBorderColor || "border-gray-200"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          {title}
        </h3>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeBg} ${badgeTextColor}`}
        >
          {badgeText}
        </span>
      </div>

      <div className="grid grid-cols-[2fr_1.2fr_1fr] gap-3 text-xs font-semibold text-gray-400 uppercase tracking-wide pb-2 border-b border-gray-100">
        <span>Student</span>
        <span>{columnLabel}</span>
        <span>Score</span>
      </div>

      <div>
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[2fr_1.2fr_1fr] gap-3 items-center py-3 border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-2.5">
              <Avatar name={row.name} colorful />
              <span className="text-sm font-medium text-gray-900">
                {row.name}
              </span>
            </div>
            <span className="text-sm text-gray-500">{row.secondaryLabel}</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${scoreColor}`}>
                {row.score}%
              </span>
              {showGradeBadge && row.gradeBadge && (
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                  {row.gradeBadge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
