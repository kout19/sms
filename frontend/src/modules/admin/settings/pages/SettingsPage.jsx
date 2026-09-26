
import { NavLink, Outlet } from "react-router-dom";
import { SETTINGS_TABS } from "../utils/settingsConstant";

export default function SettingsLayout() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your school's configuration and preferences</p>
      </div>

      <div className="flex items-center gap-1 border-b border-gray-200">
        {SETTINGS_TABS.map((tab) => (
          <NavLink
            key={tab.key}
            to={tab.path}
            className={({ isActive }) =>
              `px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                isActive ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
}