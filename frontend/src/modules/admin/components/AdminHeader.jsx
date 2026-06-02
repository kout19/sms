import { useState, useRef, useEffect } from "react";
import { Bell, LogOut, ChevronDown } from "lucide-react";

const notifications = [
  { id: 1, message: "New student registerd", time: "2 mins ago" },
  { id: 2, message: "Exam results submitted", time: "1 hour ago" },
  {
    id: 3,
    message: "Staff Meeting scheduled for Thursday",
    time: "3 hours ago",
  },
];
const AdminHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const notificationRef = useRef(null);
  const userRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      )
        setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(event.target))
        setShowUser(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //  Handl logout
  const handleLogout = () => {
    alert("logging out...");
  };

  return (
    <header className="w-full h-16 bg-white border-b border-indigo-200 px-6 flex items-center justify-between">
      {/* //Title */}
      <div>
        <h1 className="text-base font-semibold text-slate-900">Dashboard</h1>
        <p className="text-xs text-slate-400">Welcome back, Samuel</p>
      </div>
      {/* //Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-indigo-500 hover:bg-indigo-100  hover:text-indigo-800 transition-colors"
          >
            {/* aria-label="Notifications"> */}
            <Bell size={20} className="" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
