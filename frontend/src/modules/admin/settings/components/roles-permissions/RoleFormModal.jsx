import { useState, useEffect } from "react";
import Modal from "@shared/components/AttendanceModal";
import { useCreateRole, useUpdateRoleDetails } from "../../hooks/roles-permissions/useRoles";

export default function RoleFormModal({ role, isOpen, onClose }) {
  const isEditMode = Boolean(role);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createRole = useCreateRole();
  const updateRoleDetails = useUpdateRoleDetails();

  useEffect(() => {
    if (isOpen) {
      setName(role?.name || "");
      setDescription(role?.description || "");
    }
  }, [isOpen, role]);

  const isSaving = createRole.isPending || updateRoleDetails.isPending;

  const handleSave = async () => {
    if (isEditMode) {
      await updateRoleDetails.mutateAsync({
        roleId: role.id,
        name,
        description,
      });
    } else {
      await createRole.mutateAsync({ name, description });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Role" : "Create Role"}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Role"}
          </button>
        </div>
      }
    >
      <div className="px-6 py-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Role Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </Modal>
  );
}
