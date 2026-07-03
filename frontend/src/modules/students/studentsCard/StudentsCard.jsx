
const bgVariants = {
    blue: 'bg-blue-600 text-white',
    red: 'bg-red-600 text-white',
    yellow: 'bg-amber-500 text-white', // Amber looks better than raw yellow in dashboards
    green: 'bg-emerald-600 text-white',
  };

// Color map to safely use dynamic Tailwind classes
const colorVariants = {
    purple: {
      border: 'border-indigo-600',
      text: 'text-indigo-600',
    },
    blue: {
      border: 'border-sky-500',
      text: 'text-sky-500',
    },
    amber: {
      border: 'border-amber-500',
      text: 'text-amber-500',
    },
    emerald: {
      border: 'border-emerald-500',
      text: 'text-emerald-500',
    },
  };
export const AssesmentTracker = ({icon:Icon,iconBgColor='blue', number, typesOfInfo, description }) => {
const bgColor = bgVariants[iconBgColor] || bgVariants.blue;
    return (
        <div className="p-2">
        <div className="bg-gray-100 border border-slate-200 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out ">
        <div className=" p-4 flex gap-2 ">
          <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mt-2">
                    <Icon size={18}
                        className={`fill-${bgColor} ${bgColor} `} />
          </div>
          <div className="">
                    <h2 className="text-xl font-bold">{number}</h2>
                    <p className="text-sm text-slate-600">{typesOfInfo}</p>
                    <span className="text-xs text-slate-600">{description}</span>
          </div>
        </div>
    </div>
 </div>
    )
    
}


export  function TodaysClasses({ classes = [] }) {
  return (
    <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
        Today's Classes
      </h2>

      <div className="space-y-4 ">
        {classes.map((item) => {
          const variants = colorVariants[item.color] || colorVariants.purple;
            // console.log(variants);
          return (
            <div 
                  key={item.id}
                  className={`flex items-center  gap-2 border border-slate-200  rounded-3xl border-l-4 border-l-indigo-500 p-2 transition-all duration-200 hover:bg-slate-50`}
            >
              {/* Left Capsule/Border Accent with Clock Icon */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white ${variants.border}`}>
                <svg 
                  className="w-5 h-5 text-slate-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>

              {/* Class Information */}
              <div className="flex-1 py-1">
                <span className={`text-sm font-bold block ${variants.text}`}>
                  {item.time}
                </span>
                <h3 className="text-base font-bold text-slate-800 leading-tight">
                  {item.subject}
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  {item.room} <span className="mx-1">•</span> {item.teacher}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

