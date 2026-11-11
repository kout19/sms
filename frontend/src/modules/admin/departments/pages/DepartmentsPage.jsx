import { useMemo, useState } from "react";
import { Building2, CheckSquare, Users } from "lucide-react";
import Modal from "@shared/components/AttendanceModal";
import { useDebouncedValue } from "@shared/hooks/useDebouncedValue";
import DepartmentCard from "../cards/DepartmentCards";
import DepartmentFormModal from "../components/DepartmentFormModal";
import DepartmentTable from "../components/DepartmentTable";
import {
  useDepartment,
  useDepartments,
  useToggleDepartmentStatus,
} from "../hooks/useDepartments";

const ROWS_PER_PAGE = 7;

const visiblePages = (current, total) => {
  const windowSize = 5;
  let start = Math.max(1, current - 2);
  const end = Math.min(total, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

export default function DepartmentsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [banner, setBanner] = useState("");
  const [actionError, setActionError] = useState("");

  const searchTerm = useDebouncedValue(
    searchInput.trim().replace(/\s+/g, " "),
    350,
  );
  const [trackedSearch, setTrackedSearch] = useState(searchTerm);

  if (trackedSearch !== searchTerm) {
    setTrackedSearch(searchTerm);
    setCurrentPage(1);
  }

  const departmentsQuery = useDepartments({
    search: searchTerm,
    status: statusFilter,
    page: currentPage,
    limit: ROWS_PER_PAGE,
  });
  const departments = departmentsQuery.data?.data || [];
  const totalDepartments =
    departmentsQuery.data?.meta?.total || departments.length;
  const totalPages = departmentsQuery.data?.meta?.totalPages || 1;
  const pages = useMemo(
    () => visiblePages(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const viewingDepartment = useDepartment(isViewOpen ? viewingId : null);
  const toggleStatus = useToggleDepartmentStatus();

  const deptCards = [
    {
      icon: Building2,
      value: String(totalDepartments),
      title: "Total Departments",
      descriptions: "All academic areas",
      icongBgColor: "bg-gray-200",
      iconColor: "text-blue-500",
      iconSize: 24,
    },
    {
      icon: CheckSquare,
      value: String(
        departments.filter((department) => department.isActive).length,
      ),
      title: "Active",
      descriptions: "Currently running",
      change: "+0 this term",
      isPosetive: true,
      icongBgColor: "bg-gray-200",
      iconColor: "text-green-500",
      iconSize: 24,
    },
    {
      icon: Users,
      value: String(
        departments.reduce(
          (sum, department) => sum + (department.teacherCount || 0),
          0,
        ),
      ),
      title: "Total Staff",
      descriptions: "Teaching capacity",
      icongBgColor: "bg-gray-200",
      iconColor: "text-blue-500",
      iconSize: 24,
    },
    {
      icon: Users,
      value: String(
        departments.filter((department) => !department.head).length,
      ),
      title: "Vacant Heads",
      descriptions: "Need assignment",
      icongBgColor: "bg-gray-200",
      iconColor: "text-amber-500",
      iconSize: 24,
    },
  ];

  const handleAction = async (actionType, department) => {
    setActionError("");

    switch (actionType) {
      case "toggleStatus": {
        try {
          await toggleStatus.mutateAsync(department.id);
          setBanner(
            `${department.name} was ${department.isActive ? "deactivated" : "activated"}.`,
          );
        } catch (error) {
          setActionError(
            error?.response?.data?.message ||
              "Unable to update department status.",
          );
        }
        return;
      }
      case "edit":
        setEditingId(department.id);
        setIsFormOpen(true);
        return;
      case "view":
        setViewingId(department.id);
        setIsViewOpen(true);
        return;
      case "assignHead":
        setEditingId(department.id);
        setIsFormOpen(true);
        return;
      case "manageStaff":
        setBanner(
          `Staff management for ${department.name} is not yet exposed in this module.`,
        );
        return;
      default:
        return;
    }
  };

  if (departmentsQuery.isLoading) {
    return (
      <div className="p-6 text-sm text-slate-500">Loading departments...</div>
    );
  }

  if (departmentsQuery.isError) {
    return (
      <div className="p-6">
        <p className="text-sm text-rose-600">
          Failed to load departments:{" "}
          {departmentsQuery.error?.response?.data?.message ||
            departmentsQuery.error?.message}
        </p>
        <button
          onClick={() => departmentsQuery.refetch()}
          className="mt-3 rounded bg-indigo-600 px-4 py-2 text-sm text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  const selectedDepartment =
    viewingDepartment.data ||
    departments.find((department) => department.id === viewingId) ||
    null;

  return (
    <div className="min-h-full bg-slate-50 p-6">
      <header className="mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Department Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Oversee academic departments, heads, staff, and reporting
            structures.
          </p>
        </div>
      </header>

      {banner ? (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {banner}
        </p>
      ) : null}
      {actionError ? (
        <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {actionError}
        </p>
      ) : null}

      <main>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {deptCards.map((card) => (
            <DepartmentCard key={card.title} {...card} />
          ))}
        </div>

        <div className="mt-6">
          <DepartmentTable
            departments={departments}
            totalCount={totalDepartments}
            search={searchInput}
            onSearchChange={setSearchInput}
            statusFilter={statusFilter}
            onStatusFilterChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
            onCreateClick={() => {
              setEditingId(null);
              setIsFormOpen(true);
            }}
            onAction={handleAction}
          />

          {totalPages > 1 ? (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
              <button
                type="button"
                className="rounded border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {pages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`h-8 w-8 rounded text-sm ${
                      page === currentPage
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="rounded border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </main>

      <DepartmentFormModal
        mode={editingId ? "edit" : "create"}
        isOpen={isFormOpen}
        departmentId={editingId}
        onClose={() => {
          setIsFormOpen(false);
          setEditingId(null);
        }}
        onSaved={(message) => {
          setBanner(message);
          setActionError("");
        }}
      />

      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={selectedDepartment?.name || "Department details"}
        subtitle={selectedDepartment?.code || "Department information"}
        maxWidth="max-w-xl"
      >
        {viewingDepartment.isLoading ? (
          <p className="p-6 text-sm text-slate-500">
            Loading department details...
          </p>
        ) : selectedDepartment ? (
          <div className="space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Status
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {selectedDepartment.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Head
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {selectedDepartment.head || "Vacant"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Teachers
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {selectedDepartment.teacherCount || 0} staff
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Students
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {selectedDepartment.studentCount || 0} enrolled
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Description
              </p>
              <p className="mt-2 text-sm text-slate-700">
                {selectedDepartment.description ||
                  "No description provided for this department."}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Subjects
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(selectedDepartment.subjects || []).length ? (
                  (selectedDepartment.subjects || []).map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">
                    No subjects assigned yet.
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
