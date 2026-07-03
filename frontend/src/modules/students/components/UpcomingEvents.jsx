const assignmentsData = [
    {
      id: 1,
      title: "Math Midterm Exam",
      subject: "Mathematics",
      dueDate: "Due May 22",
      status: "Pending", // Options: Pending | In Progress | Completed
    },
    {
      id: 2,
      title: "Essay: Shakespeare Analysis",
      subject: "English",
      dueDate: "Due May 20",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Physics Lab Report",
      subject: "Physics",
      dueDate: "Due May 25",
      status: "Pending",
    },
    {
      id: 4,
      title: "History Presentation",
      subject: "History",
      dueDate: "Due May 23",
      status: "Completed",
    }
];

// Status badge variant mappings to support tailwind compilation
const statusVariants = {
  'Pending': 'bg-slate-100 text-slate-600',
  'In Progress': 'bg-amber-50 text-amber-600',
  'Completed': 'bg-emerald-50 text-emerald-600',
};

export function UpcomingEvents({ assignments = assignmentsData }) {
  return (
    <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
      {/* Widget Header */}
      <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
        Upcoming Assignments
      </h2>

      {/* Main List Layout */}
      <div className="space-y-4">
        {assignments.map((item) => {
          // Resolve correct status style fallback to Pending if undefined
          const badgeStyle = statusVariants[item.status] || statusVariants['Pending'];

          return (
            <div 
              key={item.id}
              className="flex items-start justify-between bg-slate-50/60 rounded-[1.5rem] p-5 border border-slate-100 transition-all duration-200 hover:bg-slate-50"
            >
              {/* Assignment Title & Meta Information */}
              <div className="flex-1 min-w-0 text-left">
                <h3 className="text-sm font-bold text-slate-800 truncate leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  {item.subject}
                </p>
                <p className="text-xs font-bold text-rose-500 mt-2 tracking-wide">
                  {item.dueDate}
                </p>
              </div>

              {/* Status Pill Badge */}
              <div className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ml-4 ${badgeStyle}`}>
                {item.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}