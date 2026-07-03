const eventsMockData = [
    {
      id: 1,
      title: "Parent-Teacher Conference",
      student: "Emma",
      date: "May 25",
      type: "Meeting" // Options: Meeting | Event | Exam
    },
    {
      id: 2,
      title: "Science Fair",
      student: "Jack",
      date: "May 28",
      type: "Event"
    },
    {
      id: 3,
      title: "Math Midterm Exam",
      student: "Emma",
      date: "May 22",
      type: "Exam"
    },
    {
      id: 4,
      title: "Sports Day",
      student: "Both",
      date: "Jun 1",
      type: "Event"
    }
];
  

// Color map for event category pills
const typeVariants = {
  'Meeting': 'bg-indigo-50 text-indigo-600',
  'Event': 'bg-emerald-50 text-emerald-600',
  'Exam': 'bg-rose-50 text-rose-600',
};

export function UpcomingEvents({ events = eventsMockData }) {
  const totalEvents = events.length;

  return (
    <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col">
      
      {/* Header Layout with Counter Badge */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Upcoming Events
        </h2>
        {totalEvents > 0 && (
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {totalEvents} {totalEvents === 1 ? 'event' : 'events'}
          </span>
        )}
      </div>

      {/* Events List Stack */}
      <div className="space-y-4">
        {events.map((event) => {
          const badgeClass = typeVariants[event.type] || typeVariants['Event'];

          return (
            <div
              key={event.id}
              className="flex items-center justify-between bg-slate-50/60 rounded-[1.5rem] p-5 border border-slate-100/50 transition-all duration-200 hover:bg-slate-50"
            >
              {/* Left Content Column */}
              <div className="flex-1 min-w-0 text-left">
                <h3 className="text-sm font-bold text-slate-800 truncate leading-snug">
                  {event.title}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  {event.student}
                </p>
              </div>

              {/* Right Content Column (Pill Badge stacked vertically over Date) */}
              <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                <div className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeClass}`}>
                  {event.type}
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {event.date}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}