import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import {
  useGeneralSettings,
  useUpdateGeneralSettings,
} from "../hooks/useSettings";
import SchoolInformationSection from "../components/SchoolInformationSection";
import AcademicConfigurationSection from "../components/AcademicConfigurationSection";
import LocalizationSection from "../components/LocalizationSection";
import AttendanceSettingsSection from "../components/AttendanceSettingsSection";
import NotificationPreferencesSection from "../components/NotificationPreferencesSection";
import SecuritySettingsSection from "../components/SecuritySettingsSection";
import DashboardHeader from "../../shared/components/DashboardHeader";

export default function GeneralSettingsPage() {
  const { data, isLoading } = useGeneralSettings();
  const updateSettings = useUpdateGeneralSettings();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  if (isLoading || !formData)
    return <p className="text-sm text-gray-400">Loading settings...</p>;

  const handleReset = () => setFormData(data);
  const handleSave = () => updateSettings.mutate(formData);

  return (
    <div className="bg-gray-50 space-y-6 min-h-screen p-6 ">
      <DashboardHeader
        title="General Settings"
        subtitle="Manage your school configuration and access control."
        icon={Settings}
    
      />
      <SchoolInformationSection
        data={formData.school}
        onChange={(school) => setFormData({ ...formData, school })}
      />
      <AcademicConfigurationSection
        data={formData.academic}
        onChange={(academic) => setFormData({ ...formData, academic })}
      />
      <LocalizationSection
        data={formData.localization}
        onChange={(localization) => setFormData({ ...formData, localization })}
      />
      <AttendanceSettingsSection
        data={formData.attendance}
        onChange={(attendance) => setFormData({ ...formData, attendance })}
      />
      <NotificationPreferencesSection
        data={formData.notifications}
        onChange={(notifications) =>
          setFormData({ ...formData, notifications })
        }
      />
      <SecuritySettingsSection
        data={formData.security}
        onChange={(security) => setFormData({ ...formData, security })}
      />

      <div className="flex items-center justify-end gap-3 bg-white rounded-2xl border border-gray-200 px-6 py-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50"
        >
          {updateSettings.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
