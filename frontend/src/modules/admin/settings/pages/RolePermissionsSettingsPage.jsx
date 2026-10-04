import { useState } from "react";

import { useRoles, useDeleteRole } from "../hooks/roles-permissions/useRoles";
import RoleCardsGrid from "../components/roles-permissions/RoleCardsGrid";
import PermissionMatrix from "../components/roles-permissions/PermissionMatrix";
import RoleFormModal from "../components/roles-permissions/RoleFormModal";
export default function RolePermissionsSettingsPage() {
  const { data: roles = [], isLoading } = useRoles();
  const deleteRole = useDeleteRole();
  const [activeRoleId, setActiveRoleId] = useState(null);
  const [formModalRole, setFormModalRole] = useState(undefined); // undefined = closed, null = create, role = edit

  const activeRole = roles.find((r) => r.id === activeRoleId) || roles[0];

  const handleDelete = (role) => {
    if (!window.confirm(`Delete the "${role.name}" role?`)) return;
    deleteRole.mutate(role.id, {
      onError: (err) => window.alert(err.message), // surfaces the userCount > 0 guard from the API layer
    });
  };

  if (isLoading)
    return <p className="text-sm text-gray-400">Loading roles...</p>;

  return (
    <div className="space-y-6 bg-gray-50 p-6">
      <RoleCardsGrid
        roles={roles}
        activeRoleId={activeRole?.id}
        onSelectRole={setActiveRoleId}
        onEditRole={(role) => setFormModalRole(role)}
        onDeleteRole={handleDelete}
        onCreateRole={() => setFormModalRole(null)}
      />

      {activeRole && <PermissionMatrix role={activeRole} />}

      <RoleFormModal
        role={formModalRole}
        isOpen={formModalRole !== undefined}
        onClose={() => setFormModalRole(undefined)}
      />
    </div>
  );
}
