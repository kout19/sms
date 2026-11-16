import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Search,
} from "lucide-react";
import Modal from "@shared/components/AttendanceModal";
import { useDebouncedValue } from "@shared/hooks/useDebouncedValue";
import ClassFormModal from "../components/ClassFormModal";
import { useClasses, useUpdateClassStatus } from "../hooks/useClasses";

const ROWS_PER_PAGE = 7;
const visiblePages = (current, total) => {
  const start = Math.max(1, Math.min(current - 2, total - 4));
  return Array.from(
    { length: Math.max(0, Math.min(total, start + 4) - start + 1) },
    (_, index) => start + index,
  );
};

const getApiError = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong.";

const ClassesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const addOpen = location.pathname.endsWith("/classes/add");
  const editMatch = location.pathname.match(/\/classes\/([^/]+)\/edit$/);
  const [searchInput, setSearchInput] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [statusTarget, setStatusTarget] = useState(null);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const search = useDebouncedValue(
    searchInput.trim().replace(/\s+/g, " "),
    400,
  );
  const [lastSearch, setLastSearch] = useState(search);
  if (lastSearch !== search) {
    setLastSearch(search);
    setPage(1);
  }

  const query = useClasses({
    search,
    academicYear,
    status,
    page,
    limit: ROWS_PER_PAGE,
  });
  const updateStatus = useUpdateClassStatus();
  const classes = query.data?.data || [];
  const total = query.data?.meta?.total ?? 0;
  const totalPages = query.data?.meta?.totalPages || 1;
  const pages = useMemo(() => visiblePages(page, totalPages), [page, totalPages]);
  const startIndex = total ? (page - 1) * ROWS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(page * ROWS_PER_PAGE, total);

  const confirmStatus = async () => {
    if (!statusTarget) return;
    try {
      setActionError("");
      await updateStatus.mutateAsync({
        id: statusTarget.id,
        isActive: !statusTarget.isActive,
      });
      setNotice(`${statusTarget.name} was ${statusTarget.isActive ? "deactivated" : "activated"}.`);
      setStatusTarget(null);
    } catch (error) {
      setActionError(getApiError(error));
    }
  };

  if (query.isLoading && !query.data) {
    return (
      <div className="min-h-full bg-slate-50 p-4 md:p-6">
        <h1 className="text-xl font-semibold text-slate-900">Classes</h1>
        <div className="mt-6 animate-pulse rounded-xl border border-slate-200 bg-white p-6">
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={row} className="mb-5 h-10 rounded bg-slate-100 last:mb-0" />
          ))}
        </div>
      </div>
    );
  }

  if (query.isError && !query.data) {
    return (
      <div className="p-6">
        <p role="alert" className="text-sm text-rose-700">
          Failed to load classes: {getApiError(query.error)}
        </p>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-slate-50 p-4 md:p-6">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">Classes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage grade levels, academic sections, and student enrollment.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/classes/add")}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Class</span>
          <span className="sm:hidden">Add</span>
        </button>
      </header>

      {notice ? (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {notice}
        </p>
      ) : null}
      {actionError ? (
        <p role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {actionError}
        </p>
      ) : null}

      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by class name or code"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <input
          aria-label="Filter by academic year"
          value={academicYear}
          onChange={(event) => {
            setAcademicYear(event.target.value);
            setPage(1);
          }}
          placeholder="Academic year"
          maxLength={30}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:w-44"
        />
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:w-44"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <section className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{startIndex}–{endIndex}</span>
            {" "}of <span className="font-semibold text-slate-700">{total}</span> classes
            {query.isFetching ? <span className="ml-2 text-xs text-slate-400">Updating...</span> : null}
          </p>
          <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {["Class", "Code", "Sections", "Students", "Academic years", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.length ? classes.map((classRecord) => (
                <tr key={classRecord.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">{classRecord.name}</p>
                    <p className="text-xs text-slate-400">{classRecord.description || `Grade ${classRecord.grade}`}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{classRecord.code}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{classRecord.sectionCount}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{classRecord.studentCount}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {classRecord.academicYears?.length ? classRecord.academicYears.join(", ") : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      classRecord.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-rose-200 bg-rose-50 text-rose-700"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${classRecord.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {classRecord.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`View ${classRecord.name}`}
                        title="View"
                        onClick={() => navigate(`/admin/classes/${classRecord.id}`)}
                        className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Edit ${classRecord.name}`}
                        title="Edit"
                        onClick={() => navigate(`/admin/classes/${classRecord.id}/edit`)}
                        className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label={`${classRecord.isActive ? "Deactivate" : "Activate"} ${classRecord.name}`}
                        title={classRecord.isActive ? "Deactivate" : "Activate"}
                        onClick={() => {
                          setActionError("");
                          setStatusTarget(classRecord);
                        }}
                        className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                      >
                        {classRecord.isActive ? <PowerOff size={15} /> : <Power size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <p className="text-sm font-medium text-slate-500">No classes match your filters.</p>
                    <p className="mt-1 text-xs text-slate-400">Adjust the filters or add a class.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <footer className="flex items-center justify-between border-t border-slate-100 bg-white px-5 py-3.5">
          <p className="text-xs text-slate-400">{total} total classes</p>
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Previous page" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            {pages.map((item) => (
              <button key={item} type="button" onClick={() => setPage(item)} className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${page === item ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}>
                {item}
              </button>
            ))}
            <button type="button" aria-label="Next page" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
        </footer>
      </section>

      <ClassFormModal
        classId={editMatch?.[1]}
        isOpen={addOpen || Boolean(editMatch)}
        onClose={() => navigate("/admin/classes")}
      />
      <Modal
        isOpen={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        title={`${statusTarget?.isActive ? "Deactivate" : "Activate"} class`}
        subtitle="Deactivating a class keeps its sections, enrollments, and academic history."
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setStatusTarget(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">Cancel</button>
            <button type="button" onClick={confirmStatus} disabled={updateStatus.isPending} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
              {updateStatus.isPending ? "Saving..." : "Confirm"}
            </button>
          </div>
        }
      >
        <p className="p-6 text-sm text-slate-600">
          {statusTarget?.isActive ? "Deactivate" : "Activate"} {statusTarget?.name}?
        </p>
      </Modal>
    </div>
  );
};

export default ClassesPage;
