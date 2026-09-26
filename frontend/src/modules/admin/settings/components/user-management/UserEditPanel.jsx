import { useState, useEffect } from "react";
import { User as UserIcon } from "lucide-react";
import SlideOver from "@shared/components/SlideOver";
import { ROLE_BADGE_STYLES } from "@shared/constants/roles";
import {
  ASSIGNABLE_ROLES,
  DEPARTMENT_OPTIONS,
  ACCOUNT_STATUS_STYLES,
} from "../../utils/user-management/userManagementConstants";
import { useUser, useUpdateUser } from "../../hooks/user-management/useUserManagement";

export default function UserEditPanel({ userId, isOpen, onClose }) {
  const { data: user } = useUser(userId);
  const updateUser = useUpdateUser();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (user)
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        username: user.username,
        role: user.role,
        department: user.department,
        status: user.status,
      });
  }, [user]);

  if (!formData) return null;
  const set = (field, value) => setFormData({ ...formData, [field]: value });

  const handleSave = async () => {
    await updateUser.mutateAsync({ id: userId, payload: formData });
    onClose();
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User"
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
            disabled={updateUser.isPending}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50"
          >
            {updateUser.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      }
    >
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          Personal Information
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
            Upload Photo
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field
            label="First Name"
            required
            value={formData.firstName}
            onChange={(v) => set("firstName", v)}
          />
          <Field
            label="Last Name"
            required
            value={formData.lastName}
            onChange={(v) => set("lastName", v)}
          />
        </div>
        <Field
          label="Email"
          required
          type="email"
          value={formData.email}
          onChange={(v) => set("email", v)}
        />
        <div className="mt-4">
          <Field
            label="Phone"
            value={formData.phone}
            onChange={(v) => set("phone", v)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Account</h3>
        <Field
          label="Username"
          required
          value={formData.username}
          onChange={(v) => set("username", v)}
        />
        <div className="mt-4">
          <label className="text-sm text-gray-700 block mb-1.5">
            Role <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.role}
            onChange={(e) => set("role", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
          >
            {ASSIGNABLE_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_BADGE_STYLES[r]?.label || r}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label className="text-sm text-gray-700 block mb-1.5">
            Department
          </label>
          <select
            value={formData.department || ""}
            onChange={(e) => set("department", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
          >
            <option value="">—</option>
            {DEPARTMENT_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label className="text-sm text-gray-700 block mb-1.5">Status</label>
          <select
            value={formData.status}
            onChange={(e) => set("status", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
          >
            {Object.entries(ACCOUNT_STATUS_STYLES).map(([k, s]) => (
              <option key={k} value={k}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </SlideOver>
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
