// Two visual variants in one component:
// tone="neutral" - white bg, icon in a small colored box, black value text (row 1 in your screenshot)
// tone="colored" - tinted bg matching the theme, plain icon, colored value text (row 2)
export default function StatCard({
  icon: Icon,
  value,
  title,
  subtitle,
  trend,
  tone = "neutral",
  color = "indigo",
}) {
  const iconBoxClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    sky: "bg-sky-50 text-sky-600",
  };

  const coloredCardClasses = {
    emerald: {
      bg: "bg-emerald-50 border-emerald-100",
      text: "text-emerald-700",
      icon: "text-emerald-600",
    },
    sky: {
      bg: "bg-sky-50 border-sky-100",
      text: "text-sky-700",
      icon: "text-sky-600",
    },
    amber: {
      bg: "bg-amber-50 border-amber-100",
      text: "text-amber-700",
      icon: "text-amber-600",
    },
    purple: {
      bg: "bg-purple-50 border-purple-100",
      text: "text-purple-700",
      icon: "text-purple-600",
    },
  };

  if (tone === "colored") {
    const c = coloredCardClasses[color];
    return (
      <div className={`rounded-2xl border p-5 ${c.bg}`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
        <p className={`text-2xl font-bold mt-3 ${c.text}`}>{value}</p>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 relative">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBoxClasses[color]}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <span className="absolute top-5 right-5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          {trend}
        </span>
      )}
      <p className="text-2xl font-bold text-gray-900 mt-3">{value}</p>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}
