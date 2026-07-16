import React from "react";
import { useAuth } from "../../../shared/utils";
import { getInitials, getFullName } from "../../../shared/utils/nameFromatter"
import { dateFromatter } from "../../../shared/utils/dateFromatter"
import { ParentMetricsRow } from "../components/ParentMetricsRow"
import { ChildrenOverview } from "../components/ChildrenOverview"
import { UpcomingEvents } from "../components/UpcomingEvents"
import { StudentGrades } from "../components/StudentsGrade"
import { Announcements } from "../components/Announcement"
import {AttendanceTrend} from "../components/AttendanceTrading"
/**
 *
 * ParentDashboard - Main parent dashboard page
 * Displays parent-specific information and child progress
 */
function ParentDashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container p-6 w-full bg-gray-50 ">
      <div className="flex items-center gap-2 ">
        <div className="flex items-center justify-center h-11 w-11 shrink-0 bg-indigo-500 text-white font-medium text-lg rounded-full ">
          {getInitials(user?.firstName, user?.lastName)} 
        </div>
        <div>
          <h1 className="text-xl font-semibold">
          {getFullName(user?.firstName, user?.lastName)}
          </h1>
          <div>
            <h1 className="text-sm text-slate-600 ">Welcome, {getFullName(user?.firstName, user?.lastName)} {dateFromatter(user?.lastLogin) }</h1>
          </div>
         </div>    
      </div>
      <div>
        <ParentMetricsRow />
      </div>
      <div className="flex flex-col md:flex-row md:items-start gap-6 p-4 w-full max-w-6xl">
        <div>
        <ChildrenOverview />
          <StudentGrades />
          <AttendanceTrend />
        </div>
        <div className="flex flex-col gap-6">
          <UpcomingEvents />
          <Announcements />
          </div>
      </div>
      <div>
    
      </div>
      </div>
  );
}

export default ParentDashboard;
