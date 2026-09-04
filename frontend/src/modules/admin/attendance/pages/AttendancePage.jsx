import { useState } from "react";
import { Download, CheckCircle } from "lucide-react";
import {
  useAttendanceRecords,
  useSetAttendanceStatus,
  useBulkUpdateStatus,
} from "../hooks/useAttendance";
import AttendanceStatsCards from "../cards/AttendanceStatCards";
import AttendanceTrendCard from "../components/AttendanceTrendChart";
import TodayBreakdownCard from "../cards/TodayBreakdownCard";
import AttendanceTable from "../components/AttendanceTable";
import MarkAttendanceModal from "../components/MarkAttendanceModal";

const CLASS_OPTIONS = [
  "Grade 10A",
  "Grade 10B",
  "Grade 11A",
  "Grade 11B",
  "Grade 12A",
  "Grade 12B",
];

export default function AttendancePage() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

  const {
    data: records = [],
    isLoading,
    error,
  } = useAttendanceRecords({ search, date, classFilter, statusFilter });
  const setStatus = useSetAttendanceStatus();
  const bulkUpdateStatus = useBulkUpdateStatus();

  const handleReset = () => {
    setSearch("");
    setDate(new Date().toISOString().slice(0, 10));
    setClassFilter("all");
    setStatusFilter("all");
  };

  const handleAction = (actionType, record) => {
    if (actionType === "viewHistory")
      console.log("view history:", record.studentName); // TODO
    if (actionType === "addRemark")
      console.log("add remark:", record.studentName); // TODO
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track daily attendance, manage records, and monitor trends.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export Report {/* TODO: CSV/PDF export */}
          </button>
          <button
            onClick={() => setIsMarkModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
          >
            <CheckCircle className="w-4 h-4" />
            Mark Attendance
          </button>
        </div>
      </div>

      <AttendanceStatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceTrendCard />
        <TodayBreakdownCard />
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading attendance...</p>
      ) : error ? (
        <p className="text-sm text-red-500">
          Failed to load attendance records.
        </p>
      ) : (
        <AttendanceTable
          records={records}
          search={search}
          onSearchChange={setSearch}
          date={date}
          onDateChange={setDate}
          classFilter={classFilter}
          onClassFilterChange={setClassFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          classOptions={CLASS_OPTIONS}
          onReset={handleReset}
          onSetStatus={(id, status) => setStatus.mutate({ id, status })}
          onAction={handleAction}
          onBulkApply={(ids, status) =>
            bulkUpdateStatus.mutate({ ids, status })
          }
        />
      )}

      <MarkAttendanceModal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        date={date}
      />
    </div>
  );
}
