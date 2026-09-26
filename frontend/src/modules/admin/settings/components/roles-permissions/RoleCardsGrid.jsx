import { Plus } from "lucide-react";
import RoleCard from "../../cards/roles-permission/RoleCard";

export default function RoleCardsGrid({
  roles,
  activeRoleId,
  onSelectRole,
  onEditRole,
  onDeleteRole,
  onCreateRole,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Roles & Permissions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Control what each role can access and manage within the school.
          </p>
        </div>
        <button
          onClick={onCreateRole}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            isActive={role.id === activeRoleId}
            onSelect={() => onSelectRole(role.id)}
            onEdit={onEditRole}
            onDelete={onDeleteRole}
          />
        ))}
      </div>
    </div>
  );
}
