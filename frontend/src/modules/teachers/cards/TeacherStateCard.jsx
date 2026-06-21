import {Dot, Users} from 'lucide-react'


export const TeacherStateCard = ({ icon: Icon, number, title, description }) => {
    return(
    <div className=" flex  gap-2  shadow-sm hover:shadow-lg bg-gray-100 border border-slate-200 rounded-xl p-4 transition-all duration-200 ease-in-out">
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center ">
          <Icon size={18} 
          className="text-indigo-600"/>
        </div>
        <div>
          <span className="font-medium text-lg ">{number}</span>
          <p className="text-xs font-medium">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
    )
}

export const TodaysSchedule=({icon:Icon, time, course, grade, room, task})=>{
  return(
    <div className="flex flex-col mt-4 sm:flex-row sm:items-center justify-between bg-gray-100 rounded-3xl border border-y-slate-200 border-r-slate-200 border-l-4 border-l-indigo-500 shadow hover:bg-gray-200 p-6 gap-4 transition-all duration-200 ease-in-out">
  
    {/* 1. Left Side: Time */}
    <div className="flex-shrink-0 flex items-center gap-2 ">
    <Icon size={12}
        className="text-indigo-500"/>
      <span className="font-semibold text-slate-700 text-sm">
      {time}
      </span>
    </div>

    {/* 2. Middle: Class Information */}
    <div className="flex-1">
      <p className="font-semibold text-slate-800 text-lg">{course}</p>
      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
        <span>Class: {grade}</span>
        <span>•</span>
        <span>Room:{room}</span>
      </div>
    </div>

    {/* 3. Right Side: Tag */}
    <div className="sm:text-right"> 
      <span className="inline-block bg-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
        {task}
      </span>
    </div>

  </div>
  )
}

export const MyClasses = ({course, section, period, time, numberOfStudents}) => {
  

  return (
    <div className="bg-gray-100 border border-slate-200 rounded-3xl p-3 hover:bg-gray-200 transition-all duration-200 ease-in-out ">
          <div className="flex items-center gap-1">
          <h2 className="text-xs font-semibold">{course} </h2>
        <span className="text-xs font-semibold"> {section}</span>
          <span><Dot size={32}
          className="font-semibold text-green-500" />
        </span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-xs">
        <span>Period {period}-{time} </span>
          <Users size={11}
          className=""/>
        <span className="font-semibold">{numberOfStudents}</span>
          </div>
        </div>
  )
}

export const SubmissionStatusChecker = ({ task, section, dueDate,submittedTask, totalStudents }) => {
  // const submitted = 25;
  // const total = 32;

  const percentage = totalStudents > 0 ? Math.round((submittedTask / totalStudents) * 100) : 0;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm"> 
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold">{task}</h2>
          <div className="flex gap-2">
            <span className="text-xs text-slate-500">Class 1{section}</span>
            <span>-</span>
            <span className="text-xs text-slate-500">{dueDate}</span>
          </div>
        </div>
        <div>
          <span className="text-xs font-semibold text-indigo-500">{percentage}%</span>
        </div>
      </div>
      
      <div className="mt-2"> 
        <div className="w-full bg-slate-100 h-1 rounded-xl overflow-hidden">
          <div 
            className={`${percentage == 100 ? 'bg-green-600 ' :'bg-indigo-600'} h-full rounded-xl transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="mt-1">
          {/* 6. Replaced hardcoded numbers with variables */}
          <span className="text-xs text-slate-500">{submittedTask} of {totalStudents} submitted</span>
        </div>
      </div>
    </div>
  );
};

export const ClassPerformanceCard = ({ classPerformanceData = [] }) => {
  
  return (
    <div>
      <div className="relative h-64 flex items-end  justify-between pt-4 border-b border-gray-100 mt-3">
        {/* Background Dashed Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-xs text-gray-400">
          <div className="border-b border-dashed border-gray-200 w-full  pb-1">100</div>
          <div className="border-b border-dashed border-gray-200 w-full  pb-1">80</div>
          <div className="border-b border-dashed border-gray-200 w-full pb-1">60</div>
          <div className="w-full"></div> 
        </div>

        {/* Check if data exists before mapping to avoid errors */}
        <div className="ml-1"></div>
        {classPerformanceData.length === 0 ? (
          <div className="w-full text-center text-xs text-gray-400 pb-10 z-10">
            No performance data available.
          </div>
        ) : (
          classPerformanceData.map((item) => {
            const minScale = 60;
            const maxScale = 100;
            const displayHeight = ((item.score - minScale) / (maxScale - minScale)) * 100;

            let barColor = "bg-indigo-500"; 
            if (item.score >= 85) {
              barColor = "bg-emerald-500"; 
            } else if (item.score >= 75) {
              barColor = "bg-indigo-500";  
            } else {
              barColor = "bg-amber-500";   
            }

            return (
              <div 
                key={item.name} 
                className="relative z-10 flex flex-col items-center w-12 justify-end h-full group"
              >
                {/* Tooltip displaying exact score on hover */}
                <div className="absolute -top-12 bg-gray-800 text-white text-xs px-2 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 text-center shadow-md leading-tight">
                  <span className="block font-semibold">Class {item.name}</span>
                  <span>{item.score}%</span>
                </div>

                {/* The Dynamic Bar */}
                <div 
                  className={`w-full max-w-[48px] rounded-t-xl transition-all duration-500 ease-out ${barColor}`}
                  style={{ height: `${Math.max(displayHeight, 10)}%` }}
                />

                <span className="text-xs font-medium text-gray-500 mt-3 whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            );
          })
          )}
      </div>
    </div>
  );
};
