import { useState } from "react";
import {Download} from "lucide-react";
import DashboardHeader from "../../shared/components/DashboardHeader";
import ReportFilterBar from "../../shared/components/ReportFilterBar";
import AttendanceReportSummaryCard from "../cards/attendance-reports/AttendanceReportSummaryCard";
import AttendanceRateTrendChart from "../components/attendance-reports/AttendanceRateTrendChart";
import MonthlyBreakdownChart from "../components/attendance-reports/MonthlyBreakdownChart";
import AttendanceByGradeCard  from "../cards/attendance-reports/AttendanceByGradeCard";
import ChronicAbsenteesList from "../components/attendance-reports/ChronicAbsenteesList";
import DetailedAttendanceRecordsTable from "../components/attendance-reports/DetailedAttendanceRecordsTable";


const DEFAULT_FILTERS = {year:"2026-2027", term:"term 1", grade:"all"}
const attendanceFilters = [
  {
    name: "period",
    type: "select",
    options: [
      { value: "all", label: "All Time" },
      { value: "week", label: "This Week" },
      { value: "quarter", label: "This Quarter" },
      { value: "semester", label: "This Semester" },
      { value: "year", label: "This Year" },
      { value: "month", label: "This Month" },
    ],
  },
  {
    name: "year",
    type: "select",
    options: [
      { value: "2026-2027", label: "2026-2027" },
      { value: "2025-2026", label: "2025-2026" },
    ],
  },
  {
    name: "grade",
    type: "select",
    options: [
      { value: "all", label: "All Grades" },
      { value: "G10", label: "Grade 10" },
      { value: "G11", label: "Grade 11" },
      { value: "G12", label: "Grade 12" },
    ],
  },
  {
    name: "class",
    type: "select",
    options: [
      { value: "all", label: "All Classes" },
      { value: "10A", label: "Grade 10A" },
      { value: "10B", label: "Grade 10B" },
      { value: "11A", label: "Grade 11A" },
    ],
  },
];
const AttendanceReportsPage =()=>{
    const [pendingFilters, setPendingFilters] = useState({});
    const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
    const handleApply = () => {};


    return (
      <div className="bg-gray-50 min-h-full p-6">
        <DashboardHeader
          title="Attendance Analytics Report"
          subtitle="Historical attendance patterns, trends, and chronic absense analysis"
          icon={Download}
          accent="white"
        />
        <div>
          <ReportFilterBar
            pendingFilters={{}}
            onChange={() => {}}
            onApply={() => {}}
            onReset={() => {}}
            filters={attendanceFilters}
          />
        </div>
        <div>
          <AttendanceReportSummaryCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceRateTrendChart
           filters={appliedFilters} 
           />
           <MonthlyBreakdownChart
           filters={appliedFilters} 
           />
        </div>
        <div>
          <AttendanceByGradeCard filters={appliedFilters} />
        </div>
        <div>
          <ChronicAbsenteesList filters={appliedFilters} />
        </div>
        <div>
          <DetailedAttendanceRecordsTable filters={appliedFilters} />
        </div>

      </div>
    );
}



export default AttendanceReportsPage;