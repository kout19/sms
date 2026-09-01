import {
  Search,
  Plus,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Pencil,
  Users,
  Power,
} from "lucide-react";
import Avatar from "../../../shared/components/Avatar";
import TagList from "../../../shared/components/TagList";
import StatusBadge from "../../../shared/components/StatusBadge";
import DropdownMenu from "../../../shared/components/DropdownMenu";

function formatLastActive(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function FinanceStaffTable({
  accountants,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onCreateClick,
  onAction,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-3 px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Finance Staff</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {accountants.length} accountants
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search staff..."
              className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[1.8fr_2fr_1fr_1fr_1.3fr_0.5fr] gap-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
            <span>Accountant</span>
            <span>Responsibilities</span>
            <span>Transactions</span>
            <span>Status</span>
            <span>Last Active</span>
            <span className="text-right">Actions</span>
          </div>

          <div>
            {accountants.map((acc) => (
              <div
                key={acc.id}
                className="grid grid-cols-[1.8fr_2fr_1fr_1fr_1.3fr_0.5fr] gap-4 px-6 py-4 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={acc.name} colorful />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {acc.name}
                    </p>
                    <p className="text-xs text-gray-400">{acc.email}</p>
                  </div>
                </div>

                <TagList items={acc.responsibilities} visibleCount={2} />

                <span className="text-sm font-semibold text-gray-900">
                  {acc.transactionCount.toLocaleString()}
                </span>

                <StatusBadge isActive={acc.isActive} />

                <span className="text-sm text-gray-500">
                  {formatLastActive(acc.lastActiveAt)}
                </span>

                <div className="flex justify-end">
                  <DropdownMenu
                    trigger={
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    }
                    items={[
                      {
                        label: "View Profile",
                        icon: Eye,
                        onClick: () => onAction("view", acc),
                      },
                      {
                        label: "Edit Details",
                        icon: Pencil,
                        onClick: () => onAction("edit", acc),
                      },
                      {
                        label: "Reassign Responsibilities",
                        icon: Users,
                        onClick: () => onAction("reassign", acc),
                      },
                      {
                        label: acc.isActive ? "Deactivate" : "Activate",
                        icon: Power,
                        variant: acc.isActive ? "danger" : "default",
                        onClick: () => onAction("toggleStatus", acc),
                      },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
