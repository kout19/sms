import { useState, useRef, useEffect } from "react";
import {
  Bell,
  LogOut,
  ChevronDown,
  X,
  CheckCheck,
  GraduationCap,
  Users,
  Settings,
  User,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../modules/auth/hooks/useAuth";
import { getRoleInfo } from "../../utils/rbacUtils";
// import {Link} from "react-router-dom";
const initialNotifications = [
  {
    id: 1,
    title: "New Student Enrolled",
    text: "New student John Doe has been enrolled in Grade 9.",
    time: "2 min ago",
    unread: true,
    icon: GraduationCap,
  },
  {
    id: 2,
    title: "Exam Results Uploaded",
    text: "Exam results for Grade 10 have been uploaded by Mr. Tesfaye.",
    time: "1 hr ago",
    unread: true,
    icon: Users,
  },
  {
    id: 3,
    title: "Staff Meeting Scheduled",
    text: "A staff meeting has been scheduled for this Friday at 2:00 PM in the main hall.",
    time: "3 hrs ago",
    unread: false,
    icon: Calendar,
  },
];

export default function AppHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  console.log(user?.role);
  const roleInfo = getRoleInfo(user?.role);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const notifsRef = useRef(null);
  const userRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

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

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleMarkOneRead = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  const handleNotifClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n)),
    );
    setSelectedNotif(notif);
    setShowNotifs(false);
  };

  const handleViewAll = () => {
    setShowNotifs(false);
    navigate(`/${user?.role}/notifications`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400">
            Welcome back, {user?.firstName || "User"}
            {user?.role ? ` · ${user?.role}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
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

            {showNotifs && (
              <div
                className="
                  fixed right-6 top-16 left-3
                  sm:absolute sm:right-0 sm:top-11 sm:fixed-auto
                  w-[calc(100vw-2rem)] sm:w-60
                  bg-white border border-gray-200 rounded-xl shadow-xl
                  z-[9999]
                "
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-800">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-600 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      <CheckCheck size={13} />
                      Mark all read
                    </button>
                  )}
                </div>

                <ul className="max-h-72 overflow-y-auto ">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <li
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        className={`flex gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                          n.unread ? "bg-blue-50/40" : ""
                        }`}
                      >
                        <span className="text-lg shrink-0 mt-0.5">
                          {<Icon size={16} />}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-gray-800 truncate">
                            {n.title}
                          </p>
                          <p className="text-[12px] text-gray-500 truncate">
                            {n.text}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {n.time}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {n.unread && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 mt-1" />
                          )}
                          {n.unread && (
                            <button
                              onClick={(e) => handleMarkOneRead(n.id, e)}
                              className="text-[10px] text-gray-400 hover:text-blue-500 transition-colors"
                              title="Mark as read"
                            >
                              ✓
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <button
                  onClick={handleViewAll}
                  className="w-full px-4 py-2.5 text-center text-xs text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  View all notifications →
                </button>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <div className="relative" ref={userRef}>
            <button
              onClick={() => {
                setShowUser(!showUser);
                setShowNotifs(false);
              }}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-[11px] font-semibold text-blue-100 shrink-0">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-[13px] font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-gray-400 capitalize">
                  {roleInfo?.displayName || user?.role}
                </p>
              </div>
              <ChevronDown size={14} className="text-gray-400 ml-0.5" />
            </button>

            {showUser && (
              <div className="absolute right-0 top-11 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                  <p className="text-xs text-gray-400 capitalize mt-1">
                    Role: {user?.role || "Department Head"}
                  </p>
                </div>
                <ul className="py-1">
                  <li className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                    <button
                      onClick={() => navigate("") }
                      className="flex items-center gap-1 "
                    >
                      <User size={15} />
                      <span className="text-xs">My Profile </span>
                    </button>
                  </li>

                  <li className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                    <button onClick={()=>navigate("/settings")}
                      className="flex items-center gap-1 ">
                      <Settings size={15} />
                      <span className="">Settings</span>
                    </button>
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

      {selectedNotif && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
          onClick={() => setSelectedNotif(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedNotif(null)}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={16} />
            </button>
            {(() => {
              const NotifIcon = selectedNotif.icon;
              return (
                <div className="mb-3 text-indigo-600">
                  <NotifIcon size={32} />
                </div>
              );
            })()}
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              {selectedNotif.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {selectedNotif.text}
            </p>
            <p className="text-xs text-gray-400">{selectedNotif.time}</p>
          </div>
        </div>
      )}
    </>
  );
}
