import Avatar from "@shared/components/Avatar";
import { ATTENDANCE_STATUS_STYLES, getAttendanceBarColor } from "../../utils/attendanceStatusConstants";
import { useDetailedAttendanceRecords } from "../../hooks/useAttendanceReport";

export default function DetailedAttendanceRecordsTable({ filters }) {
  const { data: records = [], isLoading } =
    useDetailedAttendanceRecords(filters);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Detailed Attendance Records
        </h2>
        <span className="text-sm text-gray-400">
          {records.length} students · Term 1 (43 school days)
        </span>
      </div>

      {isLoading ? (
        <p className="px-6 py-8 text-sm text-gray-400">Loading records...</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[1.8fr_1.1fr_0.8fr_0.8fr_0.8fr_1.4fr_1fr] gap-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <span>Student</span>
              <span>Class</span>
              <span>Present</span>
              <span>Absent</span>
              <span>Late</span>
              <span>Rate</span>
              <span>Status</span>
            </div>

            <div>
              {records.map((r) => {
                const style = ATTENDANCE_STATUS_STYLES[r.status];
                return (
                  <div
                    key={r.id}
                    className="grid grid-cols-[1.8fr_1.1fr_0.8fr_0.8fr_0.8fr_1.4fr_1fr] gap-4 px-6 py-3.5 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={r.studentName} colorful />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {r.studentName}
                        </p>
                        <p className="text-xs text-gray-400">{r.studentCode}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">{r.className}</span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {r.present}
                    </span>
                    <span className="text-sm font-semibold text-rose-500">
                      {r.absent}
                    </span>
                    <span className="text-sm font-semibold text-amber-500">
                      {r.late}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                        <div
                          className={`h-full rounded-full ${getAttendanceBarColor(r.rate)}`}
                          style={{ width: `${r.rate}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-9">
                        {r.rate}%
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${style.bg} ${style.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                      />
                      {style.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-400">
        <span>
          Showing{" "}
          <span className="font-medium text-gray-600">{records.length}</span>{" "}
          students
        </span>
        <span>
          Academic Year {filters.year} ·{" "}
          {filters.term === "all"
            ? "All Terms"
            : filters.term === "term1"
              ? "Term 1"
              : "Term 2"}
        </span>
      </div>
    </div>
  );
}
