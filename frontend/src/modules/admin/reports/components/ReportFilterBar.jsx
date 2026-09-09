export default function ReportFilterBar({
  pendingFilters,
  onChange,
  onApply,
  onReset,
}) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 px-4 py-3">
      <select
        value={pendingFilters.year}
        onChange={(e) => onChange({ ...pendingFilters, year: e.target.value })}
        className="px-3 py-2 rounded-lg border-2 border-indigo-500 text-sm font-medium text-indigo-700 bg-white focus:outline-none"
      >
        <option value="2026-2027">2026-2027</option>
        <option value="2025-2026">2025-2026</option>
      </select>
      <select
        value={pendingFilters.term}
        onChange={(e) => onChange({ ...pendingFilters, term: e.target.value })}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">All Terms</option>
        <option value="term1">Term 1</option>
        <option value="term2">Term 2</option>
      </select>
      <select
        value={pendingFilters.grade}
        onChange={(e) => onChange({ ...pendingFilters, grade: e.target.value })}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">All Grades</option>
        <option value="G10">Grade 10</option>
        <option value="G11">Grade 11</option>
        <option value="G12">Grade 12</option>
      </select>
      <button
        onClick={onApply}
        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
      >
        Apply
      </button>
      <button
        onClick={onReset}
        className="text-sm text-gray-400 hover:text-gray-600"
      >
        Reset
      </button>
    </div>
  );
}
