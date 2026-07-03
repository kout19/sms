import React from "react";
import { useAuth } from "../../../shared/utils";
import { dateFromatter } from "../../../shared/utils/dateFromatter";
import {AssesmentTracker, TodaysClasses} from "../studentsCard/StudentsCard"
import { Star, Calendar, BookMarked, TrendingUp, Clock } from 'lucide-react'
import { GpaTrend } from "../components/GpaTrend"
import { PerformanceRadar } from "../components/PerformanceRadar"
import {UpcomingEvents} from "../components/UpcomingEvents"

/**
 * StudentDashboard - Main student dashboard page
 * Displays student-specific information and academic progress
 */

const assesmentData = [
  { icon: Star, iconBgColor:"blue", number: 3.9, typesOfInfo: "Current GPA", description: "Top 5% in class" },
  { icon: Calendar,iconBgColor:"red", number: 3, typesOfInfo: "Assignment Due", description: "This week" },
  { icon: BookMarked,iconBgColor:"yellow", number: 4, typesOfInfo: "Classes Today", description: "Starting at 9:00 AM" },
  {icon:TrendingUp,iconBgColor:"green", number:12, typesOfInfo:"Overal Rank",description:"Out of 185 students"}
]

const gradeData = [
  { course: "Mathematics", teacher: "Dr. Sarah Williams", score: 92, grade: "A" },
  { course: "English", teacher: "Mr. James Anderson", score: 88, grade: "A-" },
  { course: "Physics", teacher: "Ms. Maria Garcia", score: 75, grade: "B+" },
  {course:"History", teacher:"Mr. Rebert Tylor", score:94, grade:"A"},
  {course:"Chemistry", teacher:"Dr. Lisa Chen", score:70, grade:"B"},
]
// classes Data
const classesData = [
  {
    id: 1,
    time: "9:00 AM",
    subject: "Mathematics",
    room: "Room 201",
    teacher: "Dr. Williams",
    // We map semantic keys to tailwind color configurations
    color: "purple", 
    icon:Clock
  },
  {
    id: 2,
    time: "10:30 AM",
    subject: "English Literature",
    room: "Room 105",
    teacher: "Mr. Anderson",
    color: "blue",
  },
  {
    id: 3,
    time: "1:00 PM",
    subject: "Physics Lab",
    room: "Lab 301",
    teacher: "Ms. Garcia",
    color: "amber",
  },
  {
    id: 4,
    time: "2:30 PM",
    subject: "History",
    room: "Room 108",
    teacher: "Mr. Taylor",
    color: "emerald",
  },
];
// Functionl component starts here

function StudentDashboard() {  
  const { user } = useAuth();

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

  const getScore = (score) => {
    let bg_color = "bg-indigo-600"
    let grade_value=""
    if (score >= 90) {
        grade_value = "A+"
       bg_color = "bg-green-600"
    }
    
    else if (score >= 85) {
      grade_value = "A"
      bg_color="bg-blue-500"
      
    }
    else if (score >= 80) {
      grade_value = "A-"
      bg_color="bg-indigo-600"
    }
    else if (score >= 75) {
      grade_value = "B+"
      bg_color="bg-yellow-600"
    }
    else if (score >= 70) {
      grade_value = "B"
      bg_color="bg-red-400"
    }
    else if (score >= 60) {
      grade_value = "C"
      bg_color="bg-red-500"
    }
    else {
      grade_value = "F"
      bg_color="bg-red-800"
    }
   
    return { bg_color, grade_value }
  }

  return (
    <div className="dashboard-container p-6 ">
      <div className="dashboard-header flex items-center gap-2">
      <div className="h-12 w-12 bg-indigo-500 flex items-center justify-center shrink-0 border border-slate-200 rounded-full text-white text-sm font-bold">
              {getInitials(user?.firstName,user?.lastName)}
        </div>
        <div className="">
        <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold"> {user?.firstName} {user?.lastName}</h1>
            <p className="flex items-center justify-center gap-1 bg-yellow-50 h-5 w-23 border border-yellow-200 rounded-2xl text-yellow-700 text-xs font-semibold ">
              <Star size={10} 
              className="text-yellow-700 fill-yellow-600" />
              <span>Top Student</span>
            </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <p>Class: {user?.class}</p>
          <p>Student ID: {user?.rollNumber}</p>
          <p>{dateFromatter(user?.lastLogin)}</p>
        </div>
        </div>
      </div>
      {/* #result related cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-4 mt-6">
        {assesmentData && assesmentData.length > 0 ? (
          assesmentData.map((ass) => (
            <AssesmentTracker
              key = { ass.typesOfInfo }
              icon={ass.icon}
              {...ass}
            />
        ))
          
        ):(
        <p>Assesment data not found</p>
        )}
      </div>
     {/* 1. Parent Wrapper: Flex column on mobile, changes to Row layout at md breakpoint */}
<div className="flex flex-col md:flex-row md:items-start gap-6 p-4 w-full max-w-6xl">
  
  {/* 2. Grade Card Wrapper Element */}
  <div className="flex-1 w-full max-w-md bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-base font-bold text-slate-900">My Grades</h1>
      <p className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-full">
        Overall: 88.2%
      </p>
    </div>

    {gradeData && gradeData.length > 0 ? (
      <div className="space-y-4">
        {gradeData.map((grade) => {
          const { bg_color, grade_value } = getScore(grade.score);

          return (
            <div key={grade.course} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="text-left"> {/* Force clean explicit left alignment */}
                  <h1 className="text-sm font-bold text-slate-800">{grade.course}</h1>
                  <span className="text-xs text-slate-400 font-medium">{grade.teacher}</span>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs font-semibold text-slate-600">{grade.score}%</p>
                  <div className="w-7 h-7 bg-indigo-50 rounded-full flex items-center justify-center">
                    <span className="text-xs text-indigo-600 font-bold">{grade_value}</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${bg_color}`}
                  style={{ width: `${grade.score}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-sm text-slate-400 text-center py-4">Grade data not found at all</p>
    )}
  </div>

  {/* 3. Today's Classes Card Wrapper Element */}
  <div className="flex-1 w-full max-w-md">
    <TodaysClasses classes={classesData} />
  </div>

</div>
      <div className="flex flex-col md:flex-row md:items-start gap-6 p-4 w-full max-w-6xl">
        <GpaTrend />
        <PerformanceRadar />
        <UpcomingEvents />
      </div>
    </div>
  );
}

export default StudentDashboard;
