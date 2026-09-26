import SettingsCard from "../cards/SettingsCard";
import { GRADING_SYSTEM_OPTIONS, TERM_COUNT_OPTIONS } from "../utils/settingsConstant";

export default function AcademicConfigurationSection({ data, onChange }) {
  const set = (field, value) => onChange({ ...data, [field]: value });

  return (
    <SettingsCard
      title="Academic Configuration"
      subtitle="Set up the current academic year and grading system."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="text-sm text-gray-700 block mb-1.5">
            Academic Year
          </label>
          <input
            value={data.academicYear}
            onChange={(e) => set("academicYear", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700 block mb-1.5">
            Current Term
          </label>
          <select
            value={data.currentTerm}
            onChange={(e) => set("currentTerm", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
          >
            {Array.from(
              { length: data.numberOfTerms },
              (_, i) => `Term ${i + 1}`,
            ).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-700 block mb-1.5">
            Number of Terms
          </label>
          <select
            value={data.numberOfTerms}
            onChange={(e) => set("numberOfTerms", Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
          >
            {TERM_COUNT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-700 block mb-1.5">
            Grading System
          </label>
          <select
            value={data.gradingSystem}
            onChange={(e) => set("gradingSystem", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
          >
            {GRADING_SYSTEM_OPTIONS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-700 block mb-1.5">
            Passing Score (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={data.passingScore}
            onChange={(e) => set("passingScore", Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            Minimum score required to pass
          </p>
        </div>
        <div />
        <div>
          <label className="text-sm text-gray-700 block mb-1.5">
            School Start Date
          </label>
          <input
            type="date"
            value={data.startDate}
            onChange={(e) => set("startDate", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700 block mb-1.5">
            School End Date
          </label>
          <input
            type="date"
            value={data.endDate}
            onChange={(e) => set("endDate", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
        </div>
      </div>
    </SettingsCard>
  );
}
