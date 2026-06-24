import React from "react";
import { useAuth } from "../../../shared/utils";
import { dateFromatter } from "../../../shared/utils/dateFromatter";
import {AssesmentTracker} from "../studentsCard/StudentsCard"
import {Star, Calendar, BookMarked,TrendingUp} from 'lucide-react'

/**
 * StudentDashboard - Main student dashboard page
 * Displays student-specific information and academic progress
 */

const assesmentData = [
  { icon: Star, iconBgColor:"blue-600", number: 3.9, typesOfInfo: "Current GPA", description: "Top 5% in class" },
  { icon: Calendar,iconBgColor:"red-600", number: 3, typesOfInfo: "Assignment Due", description: "This week" },
  { icon: BookMarked,iconBgColor:"yellow-600", number: 4, typesOfInfo: "Classes Today", description: "Starting at 9:00 AM" },
  {icon:TrendingUp,iconBgColor:"green-600", number:12, typesOfInfo:"Overal Rank",description:"Out of 185 students"}
]

const gradeData = [
  { course: "Mathematics", teacher: "Dr. Sarah Williams", score: 92, grade: "A" },
  { course: "English", teacher: "Mr. James Anderson", score: 88, grade: "A-" },
  { course: "Physics", teacher: "Ms. Maria Garcia", score: 75, grade: "B+" },
  {course:"History", teacher:"Mr. Rebert Tylor", score:94, grade:"A"},
  {course:"Chemistry", teacher:"Dr. Lisa Chen", score:70, grade:"B"},
]
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
          assesmentData.map((ass, index) => (
            <AssesmentTracker
              key = { index }
              icon={ass.icon}
              iconBgColor={ass.iconBgColor}
              number={ass.number}
              typesOfInfo={ass.typesOfInfo}
              description={ass.description}
            />
        ))
          
        ):(
        <p>Assesment data not found</p>
        )}
      </div>
      {/* Grade card */}
      <div className="mt-6 mb-4">
        <div className="border border-slate-200 rounded-3xl p-6 max-w-md ">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-sm font-bold">My Grades</h1>
          <p className="text-green-600 text-xs">Overall: 88.2%</p>
          </div>
          {gradeData && gradeData.length > 0 ? (
            gradeData.map((grade) => {
              const { bg_color, grade_value } = getScore(grade.score)
          return(
              <div className="">
            <div className="flex items-center  justify-between mb-3">
            <div>
                    <h1 className="text-xs font-bold">{grade.course}</h1>
                    <span className="text-xs text-slate-600 ">{grade.teacher}</span>
            </div>
            <div className="flex items-center gap-3">
                    <p className="text-xs text-slate-700">{grade.score}%</p>
            <div className="w-7 h-7 bg-indigo-200 rounded-full flex items-center justify-center">
                      <span className="text-xs text-indigo-600 font-bold">{grade_value}</span>
              </div>
              </div>
            </div>
            
            
            <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden mb-3">
              <div className={`h-full rounded-full transition-all duration-500 ${bg_color}`}
                style={{width: `${grade.score}%`}} 

              />
            </div>
          </div>
            )
            
})
            
          ): (
              <p>Grade data not found at all</p>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
