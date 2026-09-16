export default function ReportFilterBar({
  pendingFilters,
  onChange,
  onApply,
  onReset,
  filters = [],
}) {
  const handleChange = (name, value) => {
    onChange({
      ...pendingFilters,
      [name]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 mt-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center lg:gap-3 gap-3">
        {/* Filters */}
        {filters.map((filter) => {
          if (filter.type === "select") {
            return (
              <select
                key={filter.name}
                value={pendingFilters[filter.name] ?? ""}
                onChange={(e) => handleChange(filter.name, e.target.value)}
                className="w-full lg:w-auto px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {filter.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
          }
          return null;
        })}

        {/* Actions — pushed to the right on large screens */}
        <div className="flex gap-3 sm:col-span-2 lg:col-span-1 lg:ml-auto">
          <button
            onClick={onApply}
            className="flex-1 lg:flex-none px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
          >
            Apply
          </button>
          <button
            onClick={onReset}
            className="flex-1 lg:flex-none text-sm text-gray-400 hover:text-gray-600"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
