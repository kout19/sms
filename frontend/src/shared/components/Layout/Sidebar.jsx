import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, GraduationCap, ChevronDown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { usePermission } from "../../hooks/usePermission";
import { getNavigationForRole } from "../../config/navigationConfig";
import { getIcon } from "../../config/iconMap";

const filterNavItems = (items, can) => {
  return items
    .map((item) => {
      if (item.permission && !can(item.permission)) return null;

      if (item.children) {
        const filteredChildren = filterNavItems(item.children, can);
        if (filteredChildren.length === 0) return null;
        return { ...item, children: filteredChildren };
      }

      return item;
    })
    .filter(Boolean);
};

const Sidebar = () => {
  const { user } = useAuth();
  const { can } = usePermission();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  const navigation = getNavigationForRole(user?.role);
  const navItems = filterNavItems(navigation.items, can);

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const isPathActive = (path) => location.pathname === path;

  const hasActiveChild = (item) => {
    if (!item.children) return false;
    return item.children.some(
      (child) =>
        isPathActive(child.path) ||
        (child.children && hasActiveChild(child)),
    );
  };

  const linkClassName = (isActive) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer w-full text-left ${
      isActive
        ? "bg-indigo-500 text-white"
        : "text-indigo-600 hover:bg-indigo-100"
    }`;

  const renderMenuItem = (item, level = 0) => {
    const Icon = getIcon(item.icon);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = isPathActive(item.path);
    const isExpanded = expandedItems[item.id];
    const childActive = hasActiveChild(item);

    if (hasChildren && isOpen) {
      return (
        <div key={item.id} className={level > 0 ? "ml-3" : ""}>
          <button
            type="button"
            onClick={() => toggleExpanded(item.id)}
            className={`${linkClassName(isActive || childActive)} ${
              level > 0 ? "text-sm" : ""
            }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm whitespace-nowrap overflow-hidden flex-1 text-left">
              {item.label}
            </span>
            <ChevronDown
              className={`w-4 h-4 flex-shrink-0 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
          {isExpanded && (
            <div className="mt-1 flex flex-col gap-1">
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.id}
        to={item.path}
        className={({ isActive: navActive }) =>
          `${linkClassName(navActive || isActive)} ${level > 0 ? "text-sm" : ""}`
        }
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span
          className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
            isOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
          }`}
        >
          {item.label}
        </span>
      </NavLink>
    );
  };

  return (
    <div
      className={`flex flex-col ${isOpen ? "w-64" : "w-20"} min-h-screen px-4 py-4 bg-gray-100 transition-all duration-300 ease-in-out flex-shrink-0`}
    >
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

      {isOpen && (
        <p className="mt-3 mb-1 px-3 text-xs font-semibold text-indigo-400 uppercase tracking-wide">
          {navigation.label}
        </p>
      )}

      <nav className="flex flex-col gap-1 mt-2 overflow-y-auto">
        {navItems.map((item) => renderMenuItem(item))}
      </nav>
    </div>
  );
};

export default Sidebar;
