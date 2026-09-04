// components/RecentActivitiesCard.jsx
// import {Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react'

const activities = [
  {
    title: "New student enrolled",
    desc: "John Doe - Grade 4",
    time: "2 mins ago",
    type: "enroll",


  },
  {
    title: "Attendance marked",
    desc: "Grade 6 - Morning session",
    time: "15 mins ago",
    type: "attendance",
  },
  {
    title: "New teacher added",
    desc: "Ms. Sara - Math Dept",
    time: "1 hr ago",
    type: "teacher",
  },
  {
    title: "Class schedule updated",
    desc: "Grade 3 - Room 12",
    time: "3 hrs ago",
    type: "schedule",
  },
];

const typeColors = {
  enroll: "bg-blue-100 text-blue-600",
  attendance: "bg-green-100 text-green-600",
  teacher: "bg-purple-100 text-purple-600",
  schedule: "bg-orange-100 text-orange-600",
};

const RecentActivitiesCard = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm ">
      <h2 className="text-slate-600 font-medium mb-4">Recent Activities</h2>
      <div className="flex flex-col gap-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[activity.type]}`}
            >
              {activity.type}
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-slate-700 text-sm font-medium">
                {activity.title}
              </p>
              <p className="text-slate-400 text-xs">{activity.desc}</p>
            </div>
            <span className="ml-auto text-slate-400 text-xs whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivitiesCard;
