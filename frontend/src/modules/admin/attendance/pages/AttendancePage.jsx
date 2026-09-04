import { useState } from "react";
import { useAttendanceRecords, useSetAttendanceStatus } from "../hooks/useAttendance";
import AttendanceTrendCard from "../components/AttendanceTrendChart"
import TodayBreakdownCard from "../cards/TodayBreakdownCard";
import AttendanceTable from "../components/AttendanceTable";

const CLASS_OPTIONS = ["Grade 10A", "Grade 10B", "Grade 11A", "Grade 11B", "Grade 12A", "Grade 12B"];

export default function AttendancePage() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: records = [], isLoading, error } = useAttendanceRecords({
    search, date, classFilter, statusFilter,
  });
  const setStatus = useSetAttendanceStatus();

  const handleReset = () => {
    setSearch("");
    setDate(new Date().toISOString().slice(0, 10));
    setClassFilter("all");
    setStatusFilter("all");
  };

  const handleAction = (actionType, record) => {
    switch (actionType) {
      case "viewHistory":
        console.log("view history:", record.studentName); // TODO
        break;
      case "addRemark":
        console.log("add remark:", record.studentName); // TODO: open remark modal
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceTrendCard />
        <TodayBreakdownCard />
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading attendance...</p>
      ) : error ? (
        <p className="text-sm text-red-500">Failed to load attendance records.</p>
      ) : (
        <AttendanceTable
          records={records}
          search={search} onSearchChange={setSearch}
          date={date} onDateChange={setDate}
          classFilter={classFilter} onClassFilterChange={setClassFilter}
          statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
          classOptions={CLASS_OPTIONS}
          onReset={handleReset}
          onSetStatus={(id, status) => setStatus.mutate({ id, status })}
          onAction={handleAction}
        />
      )}
    </div>
  );
}