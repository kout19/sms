const childrenData = [
    {
      id: "emma",
      name: "Emma Johnson",
      initials: "EJ",
      class: "Class 10-A",
      rank: "#12",
      gpa: "3.9",
      attendance: "96%",
      variant: "emerald" // Controls the bottom bar accent
    },
    {
      id: "jack",
      name: "Jack Johnson",
      initials: "JJ",
      class: "Class 8-B",
      rank: "#28",
      gpa: "3.6",
      attendance: "92%",
      variant: "amber"
    }
];

const childLineVariants = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  purple: 'bg-indigo-600',
  blue: 'bg-sky-500'
};

const avatarVariants = {
  emerald: 'bg-emerald-500 text-white',
  amber: 'bg-amber-500 text-white',
  purple: 'bg-indigo-600 text-white',
  blue: 'bg-sky-500 text-white'
};

export function ChildrenOverview({ childrenList = childrenData }) {
  return (
    <div className="w-full max-w-4xl bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100">
      {/* Widget Title */}
      <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight text-left">
        Children Overview
      </h2>

      {/* Grid Container wrapper for side-by-side children columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {childrenList.map((child) => {
          const lineClass = childLineVariants[child.variant] || childLineVariants.purple;
          
          return (
            <div 
              key={child.id}
              className="bg-slate-50/60 border border-slate-100 rounded-[2rem] p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:bg-slate-50"
            >
              {/* Top Section: Avatar and Information Profile */}
              <div className="flex items-center gap-2 text-left mb-6">
                {/* Custom Styled Profile Avatar Circle */}
                <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-sm">
                  {child.initials}
                </div>
                
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-800 truncate leading-snug">
                    {child.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {child.class} <span className="mx-1 text-slate-300">•</span> Rank {child.rank}
                  </p>
                </div>
              </div>

              {/* Middle Section: The Two Rounded Metric Cards */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* GPA Display Block */}
                <div className="bg-white rounded-2xl p-2 flex flex-col items-center justify-center border border-slate-100/80 shadow-2xs">
                  <span className="text-2xl font-black text-indigo-600 tracking-tight">
                    {child.gpa}
                  </span>
                  <span className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                    GPA
                  </span>
                </div>

                {/* Attendance Display Block */}
                <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-100/80 shadow-2xs">
                  <span className="text-2xl font-black text-emerald-500 tracking-tight">
                    {child.attendance}
                  </span>
                  <span className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                    Attendance
                  </span>
                </div>
              </div>

              {/* Bottom Section: Premium Base Indicator Bar accent */}
              <div className="absolute bottom-0 left-6 right-6 h-1 rounded-t-full overflow-hidden">
                <div className={`h-full w-full ${lineClass}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}