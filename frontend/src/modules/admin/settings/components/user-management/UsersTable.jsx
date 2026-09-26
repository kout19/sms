import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  UserCog,
  KeyRound,
  Ban,
  Trash2,
} from "lucide-react";
import Avatar from "@shared/components/Avatar";
import DropdownMenu from "@shared/components/DropdownMenu";
import Pagination from "@shared/components/Pagination";
import { formatRelativeTime } from "@shared/utils/formatRelativeTime";
import { ROLE_BADGE_STYLES } from "@shared/constants/roles";
import { ACCOUNT_STATUS_STYLES } from "../../utils/user-management/userManagementConstants";
import {
  useUsers,
  useToggleSuspendUser,
  useResetUserPassword,
  useDeleteUser,
} from "../../hooks/user-management/useUserManagement";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function UsersTable({ onView, onEdit }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data, isLoading } = useUsers({
    search,
    role: roleFilter,
    status: statusFilter,
    page,
    pageSize: PAGE_SIZE,
  });
  const toggleSuspend = useToggleSuspendUser();
  const resetPassword = useResetUserPassword();
  const deleteUser = useDeleteUser();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 flex-wrap px-6 py-4 border-b border-gray-100">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search users..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All</option>
          {Object.entries(ROLE_BADGE_STYLES).map(([k, s]) => (
            <option key={k} value={k}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All</option>
          {Object.entries(ACCOUNT_STATUS_STYLES).map(([k, s]) => (
            <option key={k} value={k}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading || !data ? (
        <p className="px-6 py-8 text-sm text-gray-400">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[1.6fr_1.6fr_1.1fr_1fr_0.9fr_1.1fr_1fr_0.5fr] gap-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <span>User</span>
              <span>Email</span>
              <span>Role</span>
              <span>Department</span>
              <span>Status</span>
              <span>Last Login</span>
              <span>Created</span>
              <span></span>
            </div>
            <div>
              {data.items.map((u) => {
                const roleStyle = ROLE_BADGE_STYLES[u.role] || {
                  label: u.role,
                  bg: "bg-gray-100",
                  text: "text-gray-600",
                };
                const statusStyle = ACCOUNT_STATUS_STYLES[u.status];
                return (
                  <div
                    key={u.id}
                    onClick={() => onView(u.id)}
                    className="grid grid-cols-[1.6fr_1.6fr_1.1fr_1fr_0.9fr_1.1fr_1fr_0.5fr] gap-4 px-6 py-3.5 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar name={`${u.firstName} ${u.lastName}`} colorful />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {u.username}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 truncate">
                      {u.email}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-fit ${roleStyle.bg} ${roleStyle.text}`}
                    >
                      {roleStyle.label}
                    </span>
                    <span className="text-sm text-gray-600">
                      {u.department || "—"}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-fit ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {statusStyle.label}
                    </span>
                    <span className="text-sm text-gray-500">
                      {u.lastLoginAt
                        ? formatRelativeTime(u.lastLoginAt)
                        : "Never"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(u.createdAt)}
                    </span>
                    <div
                      className="flex justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu
                        trigger={
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        }
                        items={[
                          {
                            label: "View",
                            icon: Eye,
                            onClick: () => onView(u.id),
                          },
                          {
                            label: "Edit",
                            icon: Pencil,
                            onClick: () => onEdit(u.id),
                          },
                          {
                            label: "Change Role",
                            icon: UserCog,
                            onClick: () => onEdit(u.id),
                          },
                          {
                            label: "Reset Password",
                            icon: KeyRound,
                            onClick: () => resetPassword.mutate(u.id),
                          },
                          {
                            label:
                              u.status === "suspended"
                                ? "Reactivate"
                                : "Suspend",
                            icon: Ban,
                            variant:
                              u.status === "suspended" ? "default" : "danger",
                            onClick: () => toggleSuspend.mutate(u.id),
                          },
                          {
                            label: "Delete",
                            icon: Trash2,
                            variant: "danger",
                            onClick: () =>
                              window.confirm(
                                `Delete ${u.firstName} ${u.lastName}?`,
                              ) && deleteUser.mutate(u.id),
                          },
                        ]}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={data?.total || 0}
        onPageChange={setPage}
      />
    </div>
  );
}
