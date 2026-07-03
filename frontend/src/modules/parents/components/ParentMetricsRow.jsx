import {User, Star, Calendar, MessageSquareWarning} from "lucide-react"

const parentMetricsData = [
    {
      id: "children",
      icon: User, // Pass your Lucide React icon component reference
      number: "2",
      typesOfInfo: "Children",
      description: "Enrolled this year",
      variant: "purple"
    },
    {
      id: "gpa",
      icon: Star,
      number: "3.75",
      typesOfInfo: "Average GPA",
      description: "Combined average",
      variant: "emerald"
    },
    {
      id: "events",
      icon: Calendar,
      number: "4",
      typesOfInfo: "Upcoming Events",
      description: "Next 30 days",
      variant: "amber"
    },
    {
      id: "announcements",
      icon: MessageSquareWarning,
      number: "3",
      typesOfInfo: "Announcements",
      description: "Unread messages",
      variant: "rose"
    }
];
  

// Production mapping matching your screenshot's exact translucent tint theme
const metricVariants = {
  purple: {
    container: 'bg-indigo-50/50 border-indigo-100 text-indigo-600',
    icon: 'text-indigo-600'
  },
  emerald: {
    container: 'bg-emerald-50/50 border-emerald-100 text-emerald-600',
    icon: 'text-emerald-600'
  },
  amber: {
    container: 'bg-amber-50/40 border-amber-100 text-amber-600',
    icon: 'text-amber-500'
  },
  rose: {
    container: 'bg-rose-50/40 border-rose-100 text-rose-600',
    icon: 'text-rose-500'
  }
};

export function ParentMetricsRow({ metrics = parentMetricsData }) {
  return (
    // Responsive grid layout: 1 col on mobile, 2 on tablet, 4 side-by-side on desktop
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 w-full">
      {metrics.map((item) => {
        const styles = metricVariants[item.variant] || metricVariants.purple;
        const IconComponent = item.icon;

        return (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all duration-300 hover:shadow-md ${styles.container}`}
          >
            {/* Left Circular White Icon Badge */}
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
              {IconComponent && <IconComponent size={20} className={styles.icon} />}
            </div>

            {/* Metrics Content */}
            <div className="flex-1 min-w-0 text-left">
              <h2 className="text-3xl font-extrabold text-slate-800 leading-none mb-1">
                {item.number}
              </h2>
              <p className="text-sm font-bold text-slate-700 truncate">
                {item.typesOfInfo}
              </p>
              <span className="text-xs font-medium text-slate-400 block mt-0.5 truncate">
                {item.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}