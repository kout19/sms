import { TrendingUp, TrendingDown } from "lucide-react";
import Avatar from "@shared/components/Avatar";
import {
  STATUS_STYLES,
  getScoreBarColor,
} from "../../utils/academicGradingConstant";
import { useDetailedRecords } from "../../hooks/useAcademicReports";

function TrendIcon({ trend }) {
  if (trend === "up")
    return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (trend === "down")
    return <TrendingDown className="w-4 h-4 text-rose-500" />;
  return <span className="text-gray-300">—</span>;
}

export default function DetailedRecordsTable({ filters }) {
  const { data: records = [], isLoading } = useDetailedRecords(filters);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Detailed Academic Records
        </h2>
        <span className="text-sm text-gray-400">{records.length} records</span>
      </div>

      {isLoading ? (
        <p className="px-6 py-8 text-sm text-gray-400">Loading records...</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[1.8fr_1.1fr_1.4fr_1.6fr_0.7fr_1fr_0.6fr] gap-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <span>Student</span>
              <span>Class</span>
              <span>Subject</span>
              <span>Score</span>
              <span>Grade</span>
              <span>Status</span>
              <span>Trend</span>
            </div>

            <div>
              {records.map((r) => {
                const style = STATUS_STYLES[r.status];
                return (
                  <div
                    key={r.id}
                    className="grid grid-cols-[1.8fr_1.1fr_1.4fr_1.6fr_0.7fr_1fr_0.6fr] gap-4 px-6 py-3.5 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
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
                    <span className="text-sm text-gray-600">{r.subject}</span>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                        <div
                          className={`h-full rounded-full ${getScoreBarColor(r.score)}`}
                          style={{ width: `${r.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-7">
                        {r.score}
                      </span>
                    </div>

                    <span className="inline-flex items-center justify-center w-8 h-6 rounded bg-gray-100 text-xs font-semibold text-gray-700">
                      {r.grade}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${style.bg} ${style.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                      />
                      {style.label}
                    </span>

                    <TrendIcon trend={r.trend} />
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
