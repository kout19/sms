import { Plus } from "lucide-react";
import ClassStateCard from "../components/cards/ClassStateCard";

const classesData = [
  {
    id: 1,
    headerColor: "bg-indigo-600",
    course: "Mathematics",
    class: "Grade 11",
    room: "Room 301",
    teacher: "Dr. James Smith",
    removeEventListeneroom: "Room 301",
    time: "Mon, Wed, Fri -9:00 AM",
    totalStudents: 30,
    ID: "1234",
  },
  {
    id: 1,
    headerColor: "bg-green-600",
    course: "Physics",
    class: "Grade 10",
    teacher: "Dr. John Doe",
    room: "Room 102",
    time: "Tue, Thu, Fri - 10:30 AM",
    totalStudents: 50,
    ID: "1234",
  },
  {
    id: 1,
    headerColor: "bg-pink-600",
    course: "English",
    class: "Grade 12",
    teacher: "Prof. Jane",
    room: "Room 301",
    time: "Mon, Wed, Fri -9:00 AM",
    totalStudents: 30,
    ID: "1234",
  },
  {
    id: 1,
    headerColor: "bg-yellow-600",
    course: "Mathematics",
    class: "Grade 9",
    teacher: "Dr. James Smith",
    room: "Room 301",
    time: "Mon, Wed, Fri -9:00 AM",
    totalStudents: 30,
    ID: "1234",
  },
  {
    id: 1,
    headerColor: "bg-blue-600",
    course: "Mathematics",
    class: "Grade 11",
    teacher: "Dr. James Smith",
    room: "Room 301",
    time: "Mon, Wed, Fri -9:00 AM",
    totalStudents: 30,
    ID: "1234",
  },
  {
    id: 1,
    headerColor: "bg-purple-600",
    course: "Mathematics",
    class: "Grade 10",
    teacher: "Dr. James Smith",
    room: "Room 301",
    time: "Mon, Wed, Fri -9:00 AM",
    totalStudents: 30,
    ID: "1234",
  },
];
const Classes = () => {
  return (
    <div className="w-full py-6 px-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-slate-800 text-2xl font-semibold">Classes</h1>
          <p className="text-slate-600 ">View and manage all classes here.</p>
        </div>
        <div className="">
          <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full gap-1">
            <Plus size={18} className="" />
            <span>Add Class</span>
          </button>
        </div>
      </div>
      {/* Card  */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 ">
        {classesData.map((cls, index) => (
          <ClassStateCard
            key={index}
            headerColor={cls.headerColor}
            course={cls.course}
            class={cls.class}
            teacher={cls.teacher}
            room={cls.room}
            time={cls.time}
            totalStudents={cls.totalStudents}
            ID={cls.ID}
          />
        ))}
      </div>
    </div>
  );
};

export default Classes;
