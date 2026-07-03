const announcementsMockData = [
    {
      id: 1,
      title: "Summer Vacation Notice",
      content: "School closes on June 15th for summer break.",
      date: "May 15"
    },
    {
      id: 2,
      title: "Fee Payment Reminder",
      content: "Next semester fees due by May 30th.",
      date: "May 12"
    },
    {
      id: 3,
      title: "New Safety Protocols",
      content: "Updated pickup and drop-off procedures in effect.",
      date: "May 10"
    }
];

export function Announcements({ announcements = announcementsMockData }) {
  return (
    <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col">
      
      {/* Header Layout with Bell Icon */}
      <div className="flex items-center gap-2 mb-6 text-left">
        {/* Amber Notification Bell emoji or icon variant */}
        <span className="text-xl" role="img" aria-label="bell">🔔</span>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Announcements
        </h2>
      </div>

      {/* Announcements List Container with Automatic Underline Dividers */}
      <div className="divide-y divide-slate-100/80">
        {announcements.map((item) => (
          <div 
            key={item.id} 
            className="py-4 first:pt-0 last:pb-0 text-left transition-all duration-200 hover:bg-slate-50/50 rounded-xl px-2 -mx-2"
          >
            {/* Top Row: Title & Date Stamp */}
            <div className="flex items-start justify-between gap-4 mb-1.5">
              <h3 className="text-sm font-bold text-slate-800 leading-snug">
                {item.title}
              </h3>
              <span className="text-xs font-semibold text-slate-400 shrink-0 mt-0.5">
                {item.date}
              </span>
            </div>

            {/* Bottom Row: Detail Context */}
            <p className="text-sm font-medium text-slate-500 leading-normal">
              {item.content}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}