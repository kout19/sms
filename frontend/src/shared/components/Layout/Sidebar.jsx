/**
 * Sidebar Component - Reusable Across All Roles
 * =============================================
 *
 * Features:
 * - Renders menu items based on role
 * - Support for nested menus
 * - Collapsible sections
 * - Active state highlighting
 * - Responsive design
 * - Smooth animations
 *
 * Works for all roles: admin, teacher, student, parent
 */

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getNavigationForRole } from "../../config/navigationConfig";
import { usePermission } from "../../hooks/usePermission";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { can } = usePermission();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});

  const navigation = getNavigationForRole(user?.role);

  /**
   * Toggle expanded state for menu items with children
   */
  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  /**
   * Check if user has permission to view menu item
   */
  const hasAccessToItem = (item) => {
    if (!item.permission) return true;
    return can(item.permission);
  };

  /**
   * Check if menu item is currently active
   */
  const isItemActive = (item) => {
    return location.pathname === item.path;
  };

  /**
   * Check if any child item is active
   */
  const hasActiveChild = (item) => {
    if (!item.children) return false;
    return item.children.some(
      (child) =>
        location.pathname === child.path ||
        (child.children &&
          child.children.some((c) => location.pathname === c.path)),
    );
  };

  /**
   * Render a single menu item
   */
  const renderMenuItem = (item, level = 0) => {
    // Skip items user doesn't have permission for
    if (!hasAccessToItem(item)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isActive = isItemActive(item);
    const isExpanded = expandedItems[item.id];
    const hasActive = hasActiveChild(item);

    const levelMarginClass = level === 1 ? "ml-3" : level === 2 ? "ml-6" : "";

    return (
      <div key={item.id} className={`flex flex-col ${levelMarginClass}`}>
        {hasChildren ? (
          // Item with children - make it a button to toggle
          <button
            className={`flex items-center gap-3 px-4 py-3 text-gray-700 border-none bg-transparent cursor-pointer text-sm font-medium transition-all w-full text-left ${
              isExpanded
                ? "bg-indigo-50 text-indigo-600"
                : "hover:bg-indigo-50/50 hover:text-indigo-600"
            } ${hasActive ? "text-indigo-600 font-semibold" : ""}`}
            onClick={() => toggleExpanded(item.id)}
          >
            <span className="text-lg w-5 flex items-center justify-center flex-shrink-0">
              {item.icon}
            </span>
            <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
              {item.label}
            </span>
            <span
              className={`text-base opacity-50 transition-transform ${isExpanded ? "rotate-90" : ""}`}
            >
              ›
            </span>
          </button>
        ) : (
          // Item without children - make it a link
          <Link
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 text-gray-700 no-underline border-none bg-transparent cursor-pointer text-sm font-medium transition-all text-left ${
              isActive
                ? "bg-indigo-50 text-indigo-600 border-l-3 border-indigo-600 pl-[13px] font-semibold"
                : "hover:bg-indigo-50/50 hover:text-indigo-600"
            }`}
            onClick={onClose}
          >
            <span className="text-lg w-5 flex items-center justify-center flex-shrink-0">
              {item.icon}
            </span>
            <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
              {item.label}
            </span>
          </Link>
        )}

        {/* Render child items */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {item.children.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar Mobile Overlay */}
      {isOpen && (
        <div
          className=" fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`w-72 h-[calc(100vh-70px)] bg-gray-50 border-r border-gray-200 flex flex-col fixed left-0 top-[70px] transition-all z-40 shadow-sm md:w-60 md:hidden md:transform md:transition-transform md:duration-300 ${isOpen ? "md:translate-x-0" : "md:-translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="px-5 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
          <h2 className="m-0 text-base font-bold text-indigo-600 tracking-wide">
            {navigation.label}
          </h2>
          <button
            className=" md:block bg-transparent border-none text-lg text-gray-600 cursor-pointer p-1 transition-colors hover:text-gray-900"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          <div className="flex flex-col gap-0.5">
            {navigation.items.map((item) => renderMenuItem(item))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="px-5 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={
                user?.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
              }
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover border border-gray-200 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="m-0 text-sm font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                {user?.firstName}
              </p>
              <p className="mt-0.5 m-0 text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                {navigation.label}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
