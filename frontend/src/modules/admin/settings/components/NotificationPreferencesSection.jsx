import SettingsCard from "../cards/SettingsCard";
import { NOTIFICATION_CATEGORIES, NOTIFICATION_CHANNELS } from "../utils/settingsConstant";

export default function NotificationPreferencesSection({ data, onChange }) {
  const toggleCell = (category, channelKey) => {
    onChange({
      ...data,
      [category]: { ...data[category], [channelKey]: !data[category][channelKey] },
    });
  };

  return (
    <SettingsCard title="Notification Preferences" subtitle="Configure which channels are used for each notification type.">
      <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
        <span></span>
        {NOTIFICATION_CHANNELS.map((c) => <span key={c.key} className="text-center">{c.label}</span>)}
      </div>
      {NOTIFICATION_CATEGORIES.map((category) => (
        <div key={category} className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 py-3 border-t border-gray-100 items-center">
          <span className="text-sm font-medium text-gray-800">{category}</span>
          {NOTIFICATION_CHANNELS.map((c) => (
            <div key={c.key} className="flex justify-center">
              <input
                type="checkbox"
                checked={data[category][c.key]}
                onChange={() => toggleCell(category, c.key)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      ))}
    </SettingsCard>
  );
}