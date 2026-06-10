

const AttendanceCard =({status, count, Icon, iconColor}) =>{

    return (
      <div className="bg-white flex items-center justify-between p-6 border border-slate-200 rounded-xl shadow-sm mt-8">
        <div className=" px-4 py-2 gap-2 flex flex-col ">
          <h1 className="text-slate-600 text-lg">{status}</h1>
          <span className="text-slate-900 text-xl font-semibold">{count}</span>
        </div>
        <div className="">
          <Icon size={32} className={`${iconColor}`}/>
        </div>
      </div>
    );
}

export default AttendanceCard