import {
  Menu,
  GraduationCap,
  BookOpen,
  Calendar,
  BarChart3,
  Home,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: Home, path: "/student" },
  { label: "My Classes", icon: BookOpen, path: "/student/classes" },
  { label: "Assignments", icon: BarChart3, path: "/student/assignments" },
  { label: "Schedule", icon: Calendar, path: "/student/schedule" },
  { label: "Grades", icon: GraduationCap, path: "/student/grades" },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <div
      className={`flex flex-col ${
        isOpen ? "w-64" : "w-20"
      } min-h-screen px-4 py-4 bg-gray-100 transition-all duration-300 ease-in-out hidden md:flex`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-indigo-300 pb-4">
        <div
          className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${
            isOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
          }`}
        >
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-200 rounded-xl flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-indigo-600 font-medium whitespace-nowrap">
            EduSystems
          </h1>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center p-1 rounded-md hover:bg-indigo-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6 text-indigo-600 cursor-pointer" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 mt-4">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              to={path}
              key={path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer w-full text-left ${
                isActive
                  ? "bg-indigo-500 text-white"
                  : "text-indigo-600 hover:bg-indigo-100"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span
                className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
                }`}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
