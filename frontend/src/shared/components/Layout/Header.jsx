/**
 * Header Component - Reusable Across All Roles
 * =============================================
 *
 * A professional, responsive header that displays:
 * - Application logo
 * - User name and role
 * - Notifications
 * - User profile dropdown
 * - Responsive menu toggle
 *
 * Works for all roles: admin, teacher, student, parent
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import { getRoleInfo } from "../../utils/rbacUtils";


const Header = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationCount] = useState(3); // Mock notification count

  const roleInfo = getRoleInfo(user?.role);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleProfileOption = (option) => {
    setIsProfileOpen(false);
    // Handle profile options
    switch (option) {
      case "profile":
        navigate(`/${user?.role}/profile`);
        break;
      case "settings":
        navigate(`/${user?.role}/settings`);
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
      <div className="flex justify-between items-center px-5 h-[70px] md:px-4 md:h-15">
        {/* Left Section - Logo and Menu Toggle */}
        <div className="flex items-center gap-4 md:gap-3">
          <button
            className="hidden md:block bg-transparent border-none text-white text-2xl cursor-pointer p-2 rounded hover:bg-white/10 transition-colors"
            onClick={onMenuToggle}
            title="Toggle Menu"
          >
            ☰
          </button>

          <div className="flex items-center gap-2 text-2xl font-bold cursor-pointer">
            <span className="text-3xl">🎓</span>
            <span className="hidden sm:inline tracking-wider">SMS</span>
          </div>
        </div>

        {/* Center Section - Application Title */}
        <div className="hidden sm:block flex-1 text-center">
          <h1 className="text-xl font-semibold tracking-wide md:text-lg">
            School Management System
          </h1>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center gap-5 md:gap-4 justify-end">
          {/* Notifications */}
          <div className="relative">
            <button
              className="bg-transparent border-none text-white text-xl cursor-pointer relative p-2 rounded hover:bg-white/10 transition-colors"
              title="Notifications"
            >
              🔔
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>

          {/* User Profile Section */}
          <div className="relative">
            <button
              className="flex items-center gap-2.5 bg-white/15 border border-white/30 rounded-full px-3 py-1.5 text-white cursor-pointer transition-all hover:bg-white/25 hover:border-white/50"
              onClick={handleProfileClick}
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold">
                  {user?.firstName || "User"}
                </div>
                <div className="text-xs opacity-85">
                  {roleInfo?.displayName || "User"}
                </div>
              </div>
              <img
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                }
                alt={user?.name}
                className="w-8 h-8 rounded-full border-2 border-white/30 object-cover md:w-7 md:h-7"
              />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 bg-white rounded-lg shadow-2xl min-w-60 mt-2 text-gray-800 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-3 p-4">
                  <img
                    src={
                      user?.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                    }
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                </div>

                <div className="h-px bg-gray-200 my-2"></div>

                <div className="flex flex-col">
                  <button
                    className="flex items-center gap-2.5 px-4 py-3 text-gray-800 cursor-pointer text-sm transition-colors hover:bg-gray-100 text-left w-full border-none bg-transparent"
                    onClick={() => handleProfileOption("profile")}
                  >
                    <span className="text-base">👤</span>
                    <span>My Profile</span>
                  </button>

                  <button
                    className="flex items-center gap-2.5 px-4 py-3 text-gray-800 cursor-pointer text-sm transition-colors hover:bg-gray-100 text-left w-full border-none bg-transparent"
                    onClick={() => handleProfileOption("settings")}
                  >
                    <span className="text-base">⚙️</span>
                    <span>Settings</span>
                  </button>
                </div>

                <div className="h-px bg-gray-200 my-2"></div>

                <button
                  className="flex items-center gap-2.5 px-4 py-3 text-red-500 cursor-pointer text-sm transition-colors hover:bg-red-50 text-left w-full border-none bg-transparent"
                  onClick={() => handleProfileOption("logout")}
                >
                  <span className="text-base">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {isProfileOpen && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
