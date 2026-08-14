
import { useNavigate } from "react-router-dom";
import {formatNumber} from "../../../shared/utils/numberFormatter";

const SchoolOverviewWidget = ({ schools=[] , isLoading }) => {
  const navigate = useNavigate();
  // Redirect to the dedicated Schools Nav page
  const handleViewAll = () => {
    navigate("/super-admin/schools"); // Matches your sidebar navigation route
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
      {/* Header with View All Link */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            RECENT REGISTERED SCHOOLS
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Quick platform snapshot
          </p>
        </div>

        {/* Navigation Button linked to Sidebar route */}
        <button
          onClick={handleViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
        >
          View All Schools &rarr;
        </button>
      </div>

      {/* Snapshot Content */}
      {isLoading ? (
        <div className="text-xs text-slate-400 py-6 text-center">
          Loading snapshot...
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {schools.slice(0, 3).map((school) => (
            <div
              key={school.id}
              className="py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-slate-100 font-bold text-slate-600 text-xs flex items-center justify-center">
                  {school.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {school.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{school.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-500 font-medium">
                  {formatNumber(school.studentCount)} students
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    school.status === "Active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {school.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolOverviewWidget;
