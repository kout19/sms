import {
  Search,
  Plus,
  ChevronDown,
  Mail,
  Phone,
  GraduationCap,
  MoreHorizontal,
  Eye,
  Pencil,
  Users,
  Power,
} from "lucide-react";
import Avatar from "../../../../shared/components/Avatar";
import StatusBadge from "../../../../shared/components/StatusBadge";
import DropdownMenu from "../../../../shared/components/DropdownMenu";
import Pagination from "../../../../shared/components/Pagination";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ParentTable({
  parents,
  total,
  page,
  pageSize,
  onPageChange,
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
          <h2 className="text-lg font-semibold text-gray-900">
            Parent Registry
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {parents.length} of {total} records
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, email..."
              aria-label="Search parents by name or email"
              className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              aria-label="Filter parents by account status"
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            type="button"
            onClick={onCreateClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Parent
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-[1.6fr_1.8fr_0.8fr_2fr_0.9fr_1fr_0.5fr] gap-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
            <span>Parent</span>
            <span>Contact</span>
            <span>Children</span>
            <span>Linked Students</span>
            <span>Status</span>
            <span>Registered</span>
            <span className="text-right">Actions</span>
          </div>

          <div>
            {parents.length ? parents.map((parent) => (
              <div
                key={parent.id}
                className="grid grid-cols-[1.6fr_1.8fr_0.8fr_2fr_0.9fr_1fr_0.5fr] gap-4 px-6 py-4 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={parent.name} colorful />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {parent.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {parent.email}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {parent.phone || "No phone"}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    {parent.children?.length || 0}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">
                    {parent.children?.length === 1 ? "child" : "children"}
                  </span>
                </div>

                <div className="space-y-1">
                  {parent.children?.length ? parent.children.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center gap-1.5 text-sm text-gray-600"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      {child.name} — {child.grade}
                    </div>
                  )) : <span className="text-sm text-gray-400">No linked students</span>}
                </div>

                <StatusBadge isActive={parent.isActive} />

                <span className="text-sm text-gray-500">
                  {formatDate(parent.registeredDate)}
                </span>

                <div className="flex justify-end">
                  <DropdownMenu
                    trigger={
                      <button
                        type="button"
                        aria-label={`Actions for ${parent.name}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    }
                    items={[
                      {
                        label: "View Profile",
                        icon: Eye,
                        onClick: () => onAction("view", parent),
                      },
                      {
                        label: "Edit Details",
                        icon: Pencil,
                        onClick: () => onAction("edit", parent),
                      },
                      {
                        label: "Manage Children",
                        icon: Users,
                        onClick: () => onAction("manageChildren", parent),
                      },
                      {
                        label: parent.isActive ? "Deactivate" : "Activate",
                        icon: Power,
                        variant: parent.isActive ? "danger" : "default",
                        onClick: () => onAction("toggleStatus", parent),
                      },
                    ]}
                  />
                </div>
              </div>
            )) : (
              <p className="px-6 py-10 text-center text-sm text-gray-500">
                No parents match the selected search or filters.
              </p>
            )}
          </div>
        </div>
      </div>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
      />
    </div>
  );
}
