

export const AssesmentTracker = ({icon:Icon,iconBgColor, number, typesOfInfo, description }) => {

    return (
        <div className="p-2">
        <div className="bg-gray-100 border border-slate-200 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out ">
        <div className=" p-4 flex gap-2 ">
          <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mt-2">
                    <Icon size={18}
                        className={`fill-${iconBgColor} text-${iconBgColor} `} />
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

