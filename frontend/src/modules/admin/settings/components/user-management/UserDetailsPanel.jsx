import { UserCog, KeyRound, Ban, Pencil } from "lucide-react";
import SlideOver from "@shared/components/SlideOver";
import Avatar from "@shared/components/Avatar";
import { formatRelativeTime } from "@shared/utils/formatRelativeTime";
import { ROLE_BADGE_STYLES } from "@shared/constants/roles";
import { ACCOUNT_STATUS_STYLES } from "../../utils/user-management/userManagementConstants";
import {
  useUser,
  useToggleSuspendUser,
  useResetUserPassword,
} from "../../hooks/user-management/useUserManagement";

export default function UserDetailsPanel({ userId, isOpen, onClose, onEdit }) {
  const { data: user } = useUser(userId);
  const toggleSuspend = useToggleSuspendUser();
  const resetPassword = useResetUserPassword();

  if (!user) return null;
  const roleStyle = ROLE_BADGE_STYLES[user.role] || {
    label: user.role,
    bg: "bg-gray-100",
    text: "text-gray-600",
  };
  const statusStyle = ACCOUNT_STATUS_STYLES[user.status];

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      footer={
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSuspend.mutate(user.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100"
            >
              <Ban className="w-3.5 h-3.5" />
              {user.status === "suspended" ? "Reactivate" : "Suspend"}
            </button>
            <button
              onClick={() => resetPassword.mutate(user.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Reset Password
            </button>
          </div>
          <button
            onClick={() => onEdit(user.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>
      }
    >
      <div className="flex items-center gap-3 -mt-1 pb-5 border-b border-gray-100">
        <Avatar name={`${user.firstName} ${user.lastName}`} colorful />
        <div>
          <p className="font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-gray-400">{user.email}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
            >
              {statusStyle.label}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleStyle.bg} ${roleStyle.text}`}
            >
              {roleStyle.label}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">
          Account Information
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <InfoField label="Username" value={user.username} />
          <InfoField label="Department" value={user.department || "—"} />
          <InfoField label="Phone" value={user.phone || "—"} />
          <InfoField
            label="Last Login"
            value={
              user.lastLoginAt ? formatRelativeTime(user.lastLoginAt) : "Never"
            }
          />
          <InfoField
            label="Created Date"
            value={new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          />
          <InfoField label="Account Status" value={statusStyle.label} />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">
          Permissions Summary
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <PermissionPill label="View" count={user.permissionsSummary.view} />
          <PermissionPill
            label="Create"
            count={user.permissionsSummary.create}
          />
          <PermissionPill label="Edit" count={user.permissionsSummary.edit} />
          <PermissionPill
            label="Delete"
            count={user.permissionsSummary.delete}
          />
        </div>
        <button className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 mt-3">
          <UserCog className="w-3.5 h-3.5" />
          View full permissions
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
        {user.recentActivity.length === 0 ? (
          <p className="text-sm text-gray-400">No recent activity.</p>
        ) : (
          <div className="space-y-3">
            {user.recentActivity.map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-700">{a.action}</span>
                <span className="text-gray-400">
                  {formatRelativeTime(a.at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </SlideOver>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-gray-800 mt-0.5">{value}</p>
    </div>
  );
}

function PermissionPill({ label, count }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-indigo-600">{count}</span>
    </div>
  );
}
