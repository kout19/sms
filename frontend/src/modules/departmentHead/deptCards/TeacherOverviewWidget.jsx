
import { useNavigate } from "react-router-dom";

const TeacherOverviewWidget = ({ teachers = [], isLoading = false }) => {
  const navigate = useNavigate();

  // Redirect to the dedicated Department Teachers management route
  const handleViewAll = () => {
    navigate("/department/teacher");
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
      {/* Header with View All Link */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            TEACHER PERFORMANCE
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Department staff snapshot
          </p>
        </div>

        {/* Navigation Button */}
        <button
          onClick={handleViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
        >
          Manage Teachers &rarr;
        </button>
      </div>

      {/* Snapshot Content */}
      {isLoading ? (
        <div className="text-xs text-slate-400 py-6 text-center">
          Loading teacher snapshot...
        </div>
      ) : teachers.length === 0 ? (
        <div className="text-xs text-slate-400 py-6 text-center">
          No teachers assigned to this department yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {teachers.slice(0, 5).map((teacher) => (
            <div
              key={teacher.id}
              className="py-3 flex items-center justify-between gap-4"
            >
              {/* Left Column: Avatar & Details */}
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-blue-50 font-bold text-blue-600 text-xs flex items-center justify-center border border-blue-100">
                  {teacher.name ? teacher.name.substring(0, 2).toUpperCase() : "TC"}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {teacher.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{teacher.subject}</p>
                </div>
              </div>

              {/* Right Column: Attendance, Assignments & Score Bar */}
              <div className="flex items-center gap-4 text-xs">
                {/* Attendance & Assignments */}
                <div className="hidden sm:flex items-center gap-3 text-[11px]">
                  <span className="text-slate-500 font-medium">
                    Att: <strong className="text-slate-700">{teacher.attendance}%</strong>
                  </span>
                  <span className="text-slate-500 font-medium">
                    Assign: <strong className="text-slate-700">{teacher.assignments}%</strong>
                  </span>
                </div>

                {/* Avg Score Indicator */}
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${teacher.avgScore}%` }}
                    />
                  </div>
                  <span className="font-semibold text-slate-700 text-[11px]">
                    {teacher.avgScore}%
                  </span>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    teacher.status === "Active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {teacher.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherOverviewWidget;