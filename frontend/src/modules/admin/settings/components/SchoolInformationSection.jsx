import { useRef } from "react";
import { Upload, School as SchoolIcon } from "lucide-react";
import SettingsCard from "../cards/SettingsCard";
import { COUNTRY_OPTIONS } from "../utils/settingsConstant";

export default function SchoolInformationSection({ data, onChange }) {
  const fileInputRef = useRef(null);
  const set = (field, value) => onChange({ ...data, [field]: value });

  return (
    <SettingsCard
      title="School Information"
      subtitle="Basic information about your school."
    >
      <div className="flex items-center gap-4 pb-5 border-b border-gray-100 mb-5">
        <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center overflow-hidden flex-shrink-0">
          {data.logoUrl ? (
            <img
              src={data.logoUrl}
              alt="School logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <SchoolIcon className="w-6 h-6 text-indigo-500" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">School Logo</p>
          <p className="text-xs text-gray-400 mb-2">
            PNG or SVG recommended. Max 2MB.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload
            </button>
            <button
              onClick={() => set("logoUrl", null)}
              className="px-3 py-1.5 rounded-lg text-sm text-rose-600 hover:bg-rose-50"
            >
              Remove
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files[0] &&
                set("logoUrl", URL.createObjectURL(e.target.files[0]))
              }
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <Field
          label="School Name"
          required
          value={data.name}
          onChange={(v) => set("name", v)}
        />
        <Field
          label="School Code"
          value={data.code}
          onChange={(v) => set("code", v)}
        />
        <Field
          label="School Email"
          required
          type="email"
          value={data.email}
          onChange={(v) => set("email", v)}
        />
        <Field
          label="Phone Number"
          value={data.phone}
          onChange={(v) => set("phone", v)}
        />
        <Field
          label="Website"
          value={data.website}
          onChange={(v) => set("website", v)}
        />
        <div>
          <label className="text-sm text-gray-700 block mb-1.5">Country</label>
          <select
            value={data.country}
            onChange={(e) => set("country", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <Field
          label="Address"
          value={data.address}
          onChange={(v) => set("address", v)}
        />
        <Field
          label="City"
          value={data.city}
          onChange={(v) => set("city", v)}
        />
        <Field
          label="Region / State"
          value={data.region}
          onChange={(v) => set("region", v)}
        />
      </div>
    </SettingsCard>
  );
}

function Field({ label, required, type = "text", value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-700 block mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
