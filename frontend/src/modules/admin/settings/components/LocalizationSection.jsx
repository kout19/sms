import SettingsCard from "../cards/SettingsCard";
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS, CURRENCY_OPTIONS, DATE_FORMAT_OPTIONS, TIME_FORMAT_OPTIONS } from "../utils/settingsConstant";

export default function LocalizationSection({ data, onChange }) {
  const set = (field, value) => onChange({ ...data, [field]: value });
  const Select = ({ label, field, options }) => (
    <div>
      <label className="text-sm text-gray-700 block mb-1.5">{label}</label>
      <select value={data[field]} onChange={(e) => set(field, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <SettingsCard title="Localization" subtitle="Language, timezone, and regional preferences.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <Select label="Language" field="language" options={LANGUAGE_OPTIONS} />
        <Select label="Time Zone" field="timeZone" options={TIMEZONE_OPTIONS} />
        <Select label="Currency" field="currency" options={CURRENCY_OPTIONS} />
        <Select label="Date Format" field="dateFormat" options={DATE_FORMAT_OPTIONS} />
        <Select label="Time Format" field="timeFormat" options={TIME_FORMAT_OPTIONS} />
      </div>
    </SettingsCard>
  );
}