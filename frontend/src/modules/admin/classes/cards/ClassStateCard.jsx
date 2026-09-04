import { Clock, Users, Calendar, MapPin } from "lucide-react";

const ClassStateCard = ({
  headerColor,
  course,
  class: cls,
  teacher,
  room,
  time,
  totalStudents,
  ID,
}) => {
  return (
    <div className=" relative border border-slate-300  rounded-xl mt-4 p-4 bg-white overflow-hidden hover:shadow-lg">
      <div
        className={`absolute top-0 letf-0 w-full h-2 right-0 ${headerColor} w-full`}
      >
        {" "}
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h1 className="text-slate-800 text-lg font-semibold ">{course}</h1>
          <div className="bg-slate-200 px-4 py-1 rounded-4xl flex">
            <h1>{cls}</h1>
          </div>
        </div>
        <p className="text-slate-600 text-sm mt-2">{teacher}</p>
        <div className="flex flex-col mr-20 mt-4 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <Clock size={16} className="" />
              <p>{time}</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <MapPin size={16} className="" />
              <p> {room}</p>
            </div>
          </div>
          {/* second row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <Users size={16} className="" />
              <p>{totalStudents} Students</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <Calendar size={16} className="" />
              <p>ID: {ID}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button className="bg-indigo-600 text-white font-semibold px-8 py-2 rounded-lg hover:bg-indigo-700 transition-colors ">
            View Details
          </button>
          <button className="border border-slate-300 bg-white text-black font-semibold  px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
            Edit
          </button>
          <button className="border border-slate-500 bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 hover:boreder transition-colors">
            Roster
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassStateCard;
