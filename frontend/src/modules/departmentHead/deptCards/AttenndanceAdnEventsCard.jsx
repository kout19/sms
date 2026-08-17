const AttendanceAndEventsCard = ({
  attendance = [
    { label: "Present", percentage: 91, color: "bg-emerald-500" },
    { label: "Absent", percentage: 6, color: "bg-red-400" },
    { label: "Late", percentage: 3, color: "bg-amber-400" },
  ],
  events = [
    { id: 1, month: "Aug", day: "15", title: "Mid-Term Exam — Grade 10 Math" },
    {
      id: 2,
      month: "Aug",
      day: "17",
      title: "Teacher Observation: Mr. Getachew",
    },
    { id: 3, month: "Aug", day: "20", title: "Dept. Staff Meeting" },
  ],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm w-full animate-pulse h-[360px]">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-6" />
        <div className="space-y-4 mb-8">
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-full" />
        </div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-6" />
        <div className="space-y-3">
          <div className="h-3 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm w-full flex flex-col justify-between">
      {/* ATTENDANCE BREAKDOWN */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-4">
          ATTENDANCE BREAKDOWN
        </h3>

        <div className="space-y-4">
          {attendance.map((item, index) => {
            // Cap percentage values between 0 and 100 for safety
            const safePercentage = Math.min(
              Math.max(item.percentage || 0, 0),
              100,
            );

            return (
              <div key={index}>
                <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1.5">
                  <span>{item.label}</span>
                  <span className="font-semibold text-slate-900">
                    {safePercentage}%
                  </span>
                </div>
                {/* Dynamic Progress Bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.color || "bg-blue-500"
                    }`}
                    style={{ width: `${safePercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="my-5 border-slate-100" />

      {/* UPCOMING EVENTS */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-4">
          UPCOMING EVENTS
        </h3>

        {events.length === 0 ? (
          <p className="text-xs text-slate-400">
            No upcoming events scheduled.
          </p>
        ) : (
          <div className="space-y-3.5">
            {events.map((event) => (
              <div key={event.id} className="flex items-center text-xs gap-3">
                {/* Date Badge */}
                <div className="flex items-center gap-1 min-w-[52px] font-medium text-slate-400">
                  <span>{event.month}</span>
                  <span>{event.day}</span>
                </div>

                {/* Event Title */}
                <p className="text-slate-600 font-medium truncate">
                  {event.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceAndEventsCard;
