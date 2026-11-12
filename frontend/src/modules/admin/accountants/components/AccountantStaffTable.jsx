import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Pencil,
  Power,
} from "lucide-react";
import Avatar from "../../../../shared/components/Avatar";
import StatusBadge from "../../../../shared/components/StatusBadge";
import DropdownMenu from "../../../../shared/components/DropdownMenu";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

export default function AccountantStaffTable({
  accountants,
  total,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onCreateClick,
  onAction,
  isLoading,
  isFetching,
  error,
  onRetry,
  page,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-3 px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Accountants</h2>
          <p className="text-sm text-gray-500 mt-0.5" aria-live="polite">
            {total} accountant{total === 1 ? "" : "s"}
            {isFetching && !isLoading ? " · Updating..." : ""}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <label className="relative">
            <span className="sr-only">Search accountants</span>
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              maxLength={100}
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search accountants..."
              className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Filter by account status</span>
            <select
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </label>
          <button
            type="button"
            onClick={onCreateClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_0.5fr] gap-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
            <span>Accountant</span>
            <span>Phone</span>
            <span>Created</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {error ? (
            <div className="px-6 py-10 text-center" role="alert">
              <p className="text-sm text-rose-600">
                Could not load accountants: {error}
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Try again
              </button>
            </div>
          ) : isLoading ? (
            <p className="px-6 py-10 text-center text-sm text-gray-400">
              Loading accountants...
            </p>
          ) : accountants.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-gray-500">
              No accountants found. Add an accountant or adjust your search.
            </p>
          ) : (
            accountants.map((accountant) => (
              <div
                key={accountant.id}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_0.5fr] gap-4 px-6 py-4 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    name={`${accountant.firstName} ${accountant.lastName}`}
                    colorful
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {accountant.firstName} {accountant.lastName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {accountant.email}
                    </p>
                  </div>
                </div>

                <span className="text-sm text-gray-600 truncate">
                  {accountant.phone || "—"}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(accountant.createdAt)}
                </span>
                <StatusBadge isActive={accountant.isActive} />

                <div className="flex justify-end">
                  <DropdownMenu
                    trigger={
                      <button
                        type="button"
                        aria-label={`Actions for ${accountant.firstName} ${accountant.lastName}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    }
                    items={[
                      {
                        label: "View details",
                        icon: Eye,
                        onClick: () => onAction("view", accountant),
                      },
                      {
                        label: "Edit details",
                        icon: Pencil,
                        onClick: () => onAction("edit", accountant),
                      },
                      {
                        label: accountant.isActive ? "Deactivate" : "Activate",
                        icon: Power,
                        variant: accountant.isActive ? "danger" : "default",
                        onClick: () => onAction("toggleStatus", accountant),
                      },
                    ]}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Next page"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
