
const SchoolHealthCard = ({ data, isLoading }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-slate-900">
          School Health Overview
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Combined metrics across all modules — Academic Year{" "}
          {data?.academicYear || "----"}, {data?.term || "--"}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-300 gap-y-6 sm:gap-y-0">
        {/* Metric 1 */}
        <div className="flex flex-col justify-between pr-4 lg:px-4 lg:first:pl-0">
          <span className="text-xs font-semibold text-slate-400">
            Total Students
          </span>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md mb-1" />
            ) : (
              <div className="text-2xl font-bold text-slate-900 leading-none">
                {data?.totalStudents}
              </div>
            )}
            <span className="text-xs text-slate-400 font-medium block mt-1">
              Across {data?.classesCount} classes
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex flex-col justify-between pt-4 sm:pt-0 pr-4 lg:px-6">
          <span className="text-xs font-semibold text-slate-400">
            Academic Avg
          </span>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md mb-1" />
            ) : (
              <div className="text-2xl font-bold text-indigo-600 leading-none">
                {data?.academicAvg}
              </div>
            )}
            <span className="text-xs text-slate-400 font-medium block mt-1">
              {data?.academicAvgTrend}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="flex flex-col justify-between pt-4 sm:pt-0 pr-4 lg:px-6">
          <span className="text-xs font-semibold text-slate-400">
            Attendance Rate
          </span>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md mb-1" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600 leading-none">
                {data?.attendanceRate}
              </div>
            )}
            <span className="text-xs text-slate-400 font-medium block mt-1">
              {data?.attendanceTrend}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="flex flex-col justify-between pt-4 sm:pt-0 lg:pl-6">
          <span className="text-xs font-semibold text-slate-400">
            Fee Collection
          </span>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md mb-1" />
            ) : (
              <div className="text-2xl font-bold text-indigo-600 leading-none">
                {data?.feeCollection}
              </div>
            )}
            <span className="text-xs text-slate-400 font-medium block mt-1">
              {data?.outstandingFees}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolHealthCard;
