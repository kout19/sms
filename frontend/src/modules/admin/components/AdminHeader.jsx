import { useState, useRef, useEffect } from "react";
import { Bell, LogOut, ChevronDown } from "lucide-react";

const notifications = [
  {
    id: 1,
    text: "New student John Doe enrolled",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    text: "Exam results uploaded for Grade 10",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: 3,
    text: "Staff meeting scheduled for Friday",
    time: "3 hrs ago",
    unread: false,
  },
];

export default function AdminHeader() {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const notifsRef = useRef(null);
  const userRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifsRef.current && !notifsRef.current.contains(e.target))
        setShowNotifs(false);
      if (userRef.current && !userRef.current.contains(e.target))
        setShowUser(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Replace with your logout logic (e.g. clear token, redirect)
    alert("Logging out…");
  };

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Page Title */}
      <div>
        <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
        <p className="text-xs text-gray-400">Welcome back, Samuel</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative" ref={notifsRef}>
          <button
            onClick={() => {
              setShowNotifs(!showNotifs);
              setShowUser(false);
            }}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 top-11 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-800">
                  Notifications
                </span>
                <span className="text-xs text-blue-600 cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <ul>
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${n.unread ? "bg-blue-50/40" : ""}`}
                  >
                    <span
                      className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.unread ? "bg-blue-500" : "bg-transparent"}`}
                    />
                    <div>
                      <p className="text-[13px] text-gray-700">{n.text}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {n.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2.5 text-center text-xs text-blue-600 cursor-pointer hover:underline">
                View all notifications
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* User Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => {
              setShowUser(!showUser);
              setShowNotifs(false);
            }}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-[11px] font-semibold text-blue-100 shrink-0">
              SA
            </div>
            <div className="text-left leading-tight">
              <p className="text-[13px] font-medium text-gray-900">Samuel A.</p>
              <p className="text-[11px] text-gray-400">Super Admin</p>
            </div>
            <ChevronDown size={14} className="text-gray-400 ml-0.5" />
          </button>

          {/* User Dropdown Menu */}
          {showUser && (
            <div className="absolute right-0 top-11 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">
                  Samuel Admasu
                </p>
                <p className="text-xs text-gray-400">samuel@edunova.edu</p>
              </div>
              <ul className="py-1">
                <li className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                  <span className="text-base">👤</span> My Profile
                </li>
                <li className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                  <span className="text-base">⚙️</span> Settings
                </li>
              </ul>
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
