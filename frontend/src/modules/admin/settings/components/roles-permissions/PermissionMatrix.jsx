import { useState, useEffect } from "react";
import { Search, Save, ChevronDown } from "lucide-react";
import { ACTION_COLUMNS, PERMISSION_CATEGORIES } from "../../utils/roles-permissions/rolePermissionsConstant";
import { useUpdateRolePermissions } from "../../hooks/roles-permissions/useRoles";

function countEnabled(permissions) {
  return PERMISSION_CATEGORIES.reduce(
    (sum, cat) =>
      sum + ACTION_COLUMNS.filter((a) => permissions[cat.key][a.key]).length,
    0,
  );
}

export default function PermissionMatrix({ role }) {
  const [draft, setDraft] = useState(role.permissions);
  const [search, setSearch] = useState("");
  const updatePermissions = useUpdateRolePermissions();

  // Re-sync local draft whenever the selected role changes (switching cards)
  useEffect(() => setDraft(role.permissions), [role.id]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(role.permissions);

  const toggleCell = (categoryKey, actionKey) => {
    setDraft((prev) => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        [actionKey]: !prev[categoryKey][actionKey],
      },
    }));
  };

  const toggleRow = (categoryKey) => {
    const allOn = ACTION_COLUMNS.every((a) => draft[categoryKey][a.key]);
    const updatedRow = {};
    for (const a of ACTION_COLUMNS) updatedRow[a.key] = !allOn;
    setDraft((prev) => ({ ...prev, [categoryKey]: updatedRow }));
  };

  const toggleColumn = (actionKey) => {
    const allOn = PERMISSION_CATEGORIES.every(
      (cat) => draft[cat.key][actionKey],
    );
    setDraft((prev) => {
      const next = { ...prev };
      for (const cat of PERMISSION_CATEGORIES)
        next[cat.key] = { ...next[cat.key], [actionKey]: !allOn };
      return next;
    });
  };

  const handleSave = () =>
    updatePermissions.mutate({ roleId: role.id, permissions: draft });

  const visibleCategories = PERMISSION_CATEGORIES.filter((cat) =>
    cat.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{role.name}</span>
            {role.isSystem && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                System Role
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-0.5">
            {role.userCount.toLocaleString()} users · {countEnabled(draft)}{" "}
            permissions enabled · Last updated{" "}
            {new Date(role.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!isDirty || updatePermissions.isPending}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-40"
        >
          <Save className="w-3.5 h-3.5" />
          {updatePermissions.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="px-6 py-3 border-b border-gray-100">
        <div className="relative max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search permissions..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1400px]">
          <div
            className="grid gap-2 px-6 py-3 border-b border-gray-100"
            style={{
              gridTemplateColumns: `220px repeat(${ACTION_COLUMNS.length}, 90px)`,
            }}
          >
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Category
            </span>
            {ACTION_COLUMNS.map((a) => (
              <div key={a.key} className="flex flex-col items-center gap-1.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">
                  {a.label}
                </span>
                <input
                  type="checkbox"
                  checked={PERMISSION_CATEGORIES.every(
                    (cat) => draft[cat.key][a.key],
                  )}
                  onChange={() => toggleColumn(a.key)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>

          <div className="max-h-[520px] overflow-y-auto">
            {visibleCategories.map((cat) => {
              const rowAllOn = ACTION_COLUMNS.every(
                (a) => draft[cat.key][a.key],
              );
              const rowSomeOn = ACTION_COLUMNS.some(
                (a) => draft[cat.key][a.key],
              );
              return (
                <div
                  key={cat.key}
                  className="grid gap-2 px-6 py-2.5 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/60"
                  style={{
                    gridTemplateColumns: `220px repeat(${ACTION_COLUMNS.length}, 90px)`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rowAllOn}
                      ref={(el) =>
                        el && (el.indeterminate = !rowAllOn && rowSomeOn)
                      }
                      onChange={() => toggleRow(cat.key)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
                    <span className="text-sm font-medium text-gray-800">
                      {cat.label}
                    </span>
                  </div>
                  {ACTION_COLUMNS.map((a) => (
                    <div key={a.key} className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={draft[cat.key][a.key]}
                        onChange={() => toggleCell(cat.key, a.key)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
