import React from "react";
import {BookMarked,Users, Calendar, Clock,TrendingUp } from "lucide-react"
import { useAuth } from "../../../shared/utils";
import {dateFromatter} from "../../../shared/utils/dateFromatter"
import {TeacherStateCard, TodaysSchedule, MyClasses,SubmissionStatusChecker, ClassPerformanceCard} from "../cards/TeacherStateCard";

const cardsData=[
  {title:"My Classes", number:3, description:"Active this semister", icon:BookMarked},
  {title:"Total Student", number:85, description:"Active all Classes",icon:Users },
  {title:"Pending Grading", number:12, description:"Submission to review", icon:Calendar },
  {title:"Today's class",number:3, description:"Scheduled for today", icon:Clock}
]
const schedule=[
  {time:"9:00 AM", course:"Mathematics", grade:"10-A", room:"201", task:"Lecture", icon:Clock},
  {time:"11:00 AM", course:"Mathematics", grade:"10-B", room:"202", task:"Lecture", icon:Clock},
  {time:"11:00 AM", course:"Mathematics", grade:"10-C", room:"203", task:"Lecture", icon:Clock},
  {time:"11:00 AM", course:"Mathematics", grade:"10-D", room:"202", task:"Lecture", icon:Clock},
  {time:"11:00 AM", course:"Mathematics", grade:"10-D", room:"206", task:"Lecture", icon:Clock},
  
]
const myClasses = [
  { course: "Mathematics", section: "10-A", period: "1", time: "9:00", numberOfStudents: "32" },
  { course: "Mathematics", section: "10-B", period: "3", time: "11:00 AM", numberOfStudents: "37" },
  {course:"Mathematics", section:"10-C", period:"5", time:"2:00 AM", numberOfStudents:"30"}
]
const submistionData = [
  { task: "Midterm Exam", section: "10-A", dueDate: "May 20",submittedTask:28, totalStudents:32 },
  { task: "Assingment", section: "10-B", dueDate: "Jun 21",submittedTask:25, totalStudents:32 },
  { task: "Project", section: "10-A", dueDate: "Jul 20", submittedTask: 20, totalStudents: 35 },
  { task: "Project", section: "10-A", dueDate: "Jul 20", submittedTask: 35, totalStudents: 35 }
]
const classPerformanceData = [
  { name: "10-A", score: 85, color: "bg-indigo-600" },
  {name:"10-B", score:75, color: "bg-indigo-600"},
  {name:"10-C", score:90, color: "bg-indigo-600"}
]

function TeacherDashboard() {
  const { user } = useAuth();
  const getFullName=(firstName, lastName)=>{
    return `${firstName} ${lastName}`
  }

  const getInitials = (firstName, lastName) => {
    const name=`${firstName} ${lastName}`;
    if (!name) return "";
  
    // List of titles to ignore
    const titles = ["dr.", "mr.", "mrs.", "ms.", "prof.", "doc."];
  
    const cleanWords = name
      .trim()
      .split(/\s+/)
      .filter((word) => !titles.includes(word.toLowerCase())); // Removes titles
  
    // Takes the first letter of the first and last remaining words
    const firstInitial = cleanWords[0]?.[0] || "";
    const lastInitial =
      cleanWords.length > 1 ? cleanWords[cleanWords.length - 1][0] : "";
  
    return (firstInitial + lastInitial).toUpperCase();
  };
  return (
    <div className="dashboard-container p-6 w-full bg-gray-50 ">
      <div className="flex items-center gap-2 ">
        <div className="flex items-center justify-center h-11 w-11 shrink-0 bg-indigo-500 text-white font-medium text-lg rounded-full ">
          {getInitials(user?.firstName, user?.lastName)}
        </div>

      <div className="dashboard-header">
        <h1 className="font-medium text-sm md:text-lg">Welcome,{getFullName(user?.firstName, user?.lastName)} </h1>
        <div className="flex items-center md:gap-2">
        <p className="text-sm text-gray-500">{user?.department} Department</p>
        <p className="hidden sm:inline text-sm text-gray-500">{dateFromatter(user?.lastLogin)}</p>
        </div>
      </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsData.map((card, index)=>(
          <TeacherStateCard
          key={index}
          icon={card.icon}
          number={card.number}
          title={card.title}
          description={card.description}
          />
        )) }
      </div>
      {/* todays schedule card */}
      <div className="mt-6 border border-slate-200 rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-md">Today's Schedule</h1>
          <div className=" bg-gray-100 flex items-center justify-center rounded-xl px-2">
          <span className="text-xs text-slate-500">4 events</span>
          </div>
        
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedule.map((sc, index)=>(
            <TodaysSchedule
            key={index}
            icon={sc.icon}
            time={sc.time}
            course={sc.course}
            grade={sc.grade}
            room={sc.room}
            task={sc.task}
            />
          ))}
        </div>
      </div>
      {/* Todsay's clsass */}
      <div className="mt-6 p-6 bg-white border rounded-3xl border-slate-300 shadow-sm">
        <h1 className="text-medium font-semibold mb-4">My Classes</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {myClasses && myClasses.length > 0 ? (
            myClasses.map((cls, index) => (
              <MyClasses
                key={index}
                course={cls.course}
                section={cls.section}
                period={cls.period}
                time={cls.time}
                numberOfStudents={cls.numberOfStudents}
              />
            ))
          ) : (
            <p>Student data not found</p>
          )}
        </div>
      </div>
      {/* Assesment submision status checker */}
      <div className="p-6 mt-6 border border-slate-200 rounded-3xl shadow-sm">
        <h1 className="text-sm font-semibold mb-3">Submission Status</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {submistionData && submistionData.length > 0 ? (
            submistionData.map((status, index) => (
              <SubmissionStatusChecker
                key={index}
                task={status.task}
                section={status.section}
                dueDate={status.dueDate}
                submittedTask={status.submittedTask}
                totalStudents={status.totalStudents}
              />
            ))
          ) : (
            <p>No task found at all </p>
          )}
        </div>
      </div>
      {/* Class prefomrmance using chart */}
      <div className="p-6 mt-4 border border-slate-200 rounded-3xl max-w-3xl ">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold">Class Performance</h1>
          <p className="text-green-600 flex items-center gap-1">
            <TrendingUp size={10}
              className="" />
            <span className="text-xs font-semibold ">+3.2% avg</span>
          </p>
        </div>
        <div>
        <p className="text-xs text-slate-600">Average score by class</p>
        </div>
        {/* chart part , bar chart to show the classes performance */}

          <ClassPerformanceCard classPerformanceData={classPerformanceData}/>
        </div>
       </div>
  );
}

export default TeacherDashboard;
