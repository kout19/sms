import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDebouncedValue } from "../../../../shared/hooks/useDebouncedValue";
import {
  useParents,
  useToggleParentStatus,
} from "../hooks/useParents";
import ParentTable from "../components/ParentsTable";
import ParentStatsCards from "../cards/ParentsStateCards";
import ParentFormModal from "../components/ParentFormModal";
import ParentDetailsModal from "../components/ParentDetailsModal";
import { getApiError } from "../utils/parentForm";

const PAGE_SIZE = 8;

export default function ParentsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [formState, setFormState] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const searchTerm = useDebouncedValue(search.trim().replace(/\s+/g, " "), 350);
  const addRoute = location.pathname.endsWith("/parents/add");

  useEffect(() => {
    const previousTitle = document.title;
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const previousRobots = robotsMeta?.content;
    const meta = robotsMeta || document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    if (!robotsMeta) document.head.appendChild(meta);
    document.title = "Parents | School Management";

    return () => {
      document.title = previousTitle;
      if (robotsMeta) {
        if (previousRobots === undefined) {
          robotsMeta.removeAttribute("content");
        } else {
          robotsMeta.content = previousRobots;
        }
      } else {
        meta.remove();
      }
    };
  }, []);

  const parentsQuery = useParents({
    search: searchTerm,
    status: statusFilter,
    page,
    limit: PAGE_SIZE,
  });
  const toggleStatus = useToggleParentStatus();
  const parents = parentsQuery.data?.data || [];
  const total = parentsQuery.data?.meta?.total || 0;
  const summary = parentsQuery.data?.summary;

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleAction = async (actionType, parent) => {
    setActionError("");
    setNotice("");
    switch (actionType) {
      case "toggleStatus":
        if (
          !window.confirm(
            `Are you sure you want to ${parent.isActive ? "deactivate" : "activate"} ${parent.name}?`,
          )
        ) {
          return;
        }
        try {
          await toggleStatus.mutateAsync({
            id: parent.id,
            isActive: !parent.isActive,
          });
          setPage(1);
          setNotice(
            parent.isActive
              ? "Parent deactivated. The account and linked history were retained."
              : "Parent activated.",
          );
        } catch (error) {
          setActionError(getApiError(error));
        }
        break;
      case "view":
        setViewingId(parent.id);
        break;
      case "edit":
        setFormState({ mode: "edit", id: parent.id });
        break;
      case "manageChildren":
        setFormState({ mode: "manageChildren", id: parent.id });
        break;
      default:
        break;
    }
  };

  if (parentsQuery.isLoading && !parentsQuery.data)
    return <div className="p-6 text-sm text-gray-400">Loading parents...</div>;
  if (parentsQuery.isError && !parentsQuery.data)
    return (
      <div className="space-y-3 p-6 text-sm text-red-600">
        <p>Failed to load parents: {getApiError(parentsQuery.error)}</p>
        <button
          type="button"
          onClick={() => parentsQuery.refetch()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    );

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          Parents Management
        </h1>
        <p className="text-sm text-slate-500">
          Manage parent accounts and linked students.
        </p>
      </div>
      {notice ? (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {notice}
        </p>
      ) : null}
      {actionError ? (
        <p
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {actionError}
        </p>
      ) : null}
      {parentsQuery.isError && parentsQuery.data ? (
        <p role="alert" className="text-sm text-rose-600">
          Refresh failed: {getApiError(parentsQuery.error)}
        </p>
      ) : null}
      <ParentStatsCards
        summary={summary}
        isLoading={parentsQuery.isLoading}
      />
      <ParentTable
        parents={parents}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onCreateClick={() => navigate("/admin/parents/add")}
        onAction={handleAction}
      />
      <ParentFormModal
        mode={formState?.mode || "create"}
        parentId={formState?.id || null}
        isOpen={Boolean(formState) || addRoute}
        onClose={() => {
          setFormState(null);
          if (addRoute) navigate("/admin/parents");
        }}
        onSaved={(message) => {
          setNotice(message);
          setActionError("");
          setFormState(null);
          if (addRoute) navigate("/admin/parents");
        }}
      />
      <ParentDetailsModal
        parentId={viewingId}
        isOpen={Boolean(viewingId)}
        onClose={() => setViewingId(null)}
      />
    </div>
  );
}
