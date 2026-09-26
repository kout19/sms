import { useState } from "react";
import UsersTable from "../components/user-management/UsersTable";
import UserDetailsPanel from "../components/user-management/UserDetailsPanel";
import UserEditPanel from "../components/user-management/UserEditPanel";

export default function UserManagementSettingsPage() {
  const [viewingUserId, setViewingUserId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);

  return (
    <div className="space-y-6">
      <UsersTable
        onView={(id) => setViewingUserId(id)}
        onEdit={(id) => {
          setEditingUserId(id);
          setViewingUserId(null);
        }}
      />

      <UserDetailsPanel
        userId={viewingUserId}
        isOpen={Boolean(viewingUserId)}
        onClose={() => setViewingUserId(null)}
        onEdit={(id) => {
          setEditingUserId(id);
          setViewingUserId(null);
        }}
      />

      <UserEditPanel
        userId={editingUserId}
        isOpen={Boolean(editingUserId)}
        onClose={() => setEditingUserId(null)}
      />
    </div>
  );
}
