import { useState } from "react";
import { useParents, useToggleParentStatus } from "../hooks/useParents";
import ParentTable from "../components/ParentsTable";
import ParentStatsCards from "../components/cards/ParentsStateCards";

const PAGE_SIZE = 8;

export default function ParentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useParents({
    search,
    status: statusFilter,
    page,
    pageSize: PAGE_SIZE,
  });
  const toggleStatus = useToggleParentStatus();

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1); // reset to page 1 whenever the filter changes - otherwise you can land on an empty page 3 of a 1-page result
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleAction = (actionType, parent) => {
    switch (actionType) {
      case "toggleStatus":
        toggleStatus.mutate(parent.id);
        break;
      case "view":
        // TODO: navigate(`/admin/parents/${parent.id}`)
        console.log("view profile:", parent.name);
        break;
      case "edit":
        // TODO: open EditParentModal
        console.log("edit:", parent.name);
        break;
      case "manageChildren":
        // TODO: open a student-linking modal
        console.log("manage children:", parent.name);
        break;
      default:
        break;
    }
  };

  if (isLoading)
    return <div className="p-6 text-sm text-gray-400">Loading parents...</div>;
  if (error)
    return (
      <div className="p-6 text-sm text-red-500">Failed to load parents.</div>
    );

  return (
    <div className="bg-gray-50 space-y-6 p-6">
        <div>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font`-semibold text-gray-900">Parents Management</h1>
                <p className="text-sm text-slate-500">Manage perent registerations, linked students, and comminucations. </p>
            </div>
        </div>
        <ParentStatsCards />
      <ParentTable
        parents={data.items}
        total={data.total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onCreateClick={() => {
          // TODO: open create-parent modal
        }}
        onAction={handleAction}
      />
    </div>
  );
}
