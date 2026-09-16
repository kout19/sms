
const DashboardHeader=({title, subtitle, icon:Icon, accent="indigo"}) =>{

    const accentStyles = {
        indigo: "bg-indigo-500",
        emerald: "bg-emerald-500",
        violet: "bg-violet-500",
        amber: "bg-amber-500",
        white:"bg-white",
      };

    return (
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold ">{title}</h1>
          <p className="text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className={`${accentStyles[accent] || accentStyles.white} border border-gray-100 shadow-sm hover:shadow-md rounded-lg flex items-center gap-2 px-4 py-2  cursor-pointer`}>
          <Icon className="w-5 h-5" />
          <span> Export Report</span>
        </div>
      </div>
    );

}


export default DashboardHeader;