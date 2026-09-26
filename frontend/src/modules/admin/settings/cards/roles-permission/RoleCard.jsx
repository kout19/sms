import { Shield, Pencil, Trash2 } from "lucide-react";
import { CARD_SUMMARY_ACTIONS, PERMISSION_CATEGORIES } from "../../utils/roles-permissions/rolePermissionsConstant";

// Counts derived live from `permissions` - never a separately stored number.
function countAction(permissions, action) {
  return PERMISSION_CATEGORIES.filter((cat) => permissions[cat.key][action]).length;
}

export default function RoleCard({ role, isActive, onSelect, onEdit, onDelete }) {
  return (
    <button
      onClick={onSelect}
      className={`text-left bg-white rounded-2xl border p-5 transition-colors ${
        isActive ? "border-indigo-400 ring-1 ring-indigo-200" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
          <Shield className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onEdit(role)} className="p-1 rounded hover:bg-gray-100 text-gray-400">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          {!role.isSystem && (
            <button onClick={() => onDelete(role)} className="p-1 rounded hover:bg-rose-50 text-gray-400 hover:text-rose-500">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-0.5">
        <span className="font-semibold text-gray-900">{role.name}</span>
        {role.isSystem && <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">System</span>}
      </div>
      <p className="text-xs text-gray-400 mb-2.5">{role.userCount.toLocaleString()} users</p>
      <p className="text-sm text-gray-600 mb-4">{role.description}</p>

      <div className="grid grid-cols-4 gap-2">
        {CARD_SUMMARY_ACTIONS.map((action) => (
          <div key={action} className="bg-gray-50 rounded-lg py-2 text-center">
            <p className="text-sm font-bold text-gray-900">{countAction(role.permissions, action)}</p>
            <p className="text-[11px] text-gray-400 capitalize">{action}</p>
          </div>
        ))}
      </div>
    </button>
  );
}