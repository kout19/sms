

const StateCard = ({title, value, change, isPosetive, icon:Icon, iconBgColor}) => {
    return (

      <div className="flex items-center justify-between p-6 px-10 border border-slate-200 rounded-xl mt-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-600 ">{title}</h1>
          <span className="text-slate-900 text-lg font-bold">{value}</span>
          <p className={`text-sm ${isPosetive ? "text-green-600":"text-red-600"}`}>
            {change}
          </p>

        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center `}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    );

}

export default StateCard;