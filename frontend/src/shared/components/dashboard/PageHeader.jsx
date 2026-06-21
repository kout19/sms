const PageHeader = ({ icon: Icon, title, subtitle, accent = "indigo" }) => {
  const accentStyles = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    violet: "bg-violet-500",
    amber: "bg-amber-500",
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className={`flex items-center justify-center h-11 w-11 shrink-0 ${accentStyles[accent] || accentStyles.indigo} text-white rounded-xl`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h1 className="font-semibold text-lg text-slate-800">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
};

export default PageHeader;
