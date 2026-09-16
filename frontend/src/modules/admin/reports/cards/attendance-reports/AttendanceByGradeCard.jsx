import { useGradeSummary } from "../../hooks/useAttendanceReport";

const GRADE_BAR_COLORS = ["bg-emerald-500", "bg-sky-500", "bg-violet-500"];

export default function AttendanceByGradeCard({ filters }) {
  const { data = [], isLoading } = useGradeSummary(filters);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <h3 className="font-semibold text-gray-900">Attendance by Grade</h3>
      <p className="text-sm text-gray-500 mb-5">
        Comparison across grade levels
      </p>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {data.map((g, i) => {
            const isPositive = g.trend.startsWith("+");
            return (
              <div key={g.grade}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{g.grade}</span>
                  <span className="text-sm">
                    <span className="font-bold text-gray-900">{g.rate}%</span>{" "}
                    <span
                      className={
                        isPositive ? "text-emerald-600" : "text-rose-500"
                      }
                    >
                      {g.trend}
                    </span>
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${GRADE_BAR_COLORS[i % 3]}`}
                    style={{ width: `${g.rate}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 rounded-lg py-2 text-center">
                    <p className="text-sm font-bold text-emerald-600">
                      {g.present}
                    </p>
                    <p className="text-xs text-gray-400">Present</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg py-2 text-center">
                    <p className="text-sm font-bold text-rose-500">
                      {g.absent}
                    </p>
                    <p className="text-xs text-gray-400">Absent</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg py-2 text-center">
                    <p className="text-sm font-bold text-amber-500">{g.late}</p>
                    <p className="text-xs text-gray-400">Late</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
