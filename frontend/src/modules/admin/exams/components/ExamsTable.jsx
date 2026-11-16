import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Edit,
  Eye,
  Search,
  Trash2,
} from "lucide-react";

const PAGE_WINDOW = 5;

const visiblePages = (current, total) => {
  const end = Math.min(total, current + PAGE_WINDOW - 1);
  const start = Math.max(1, end - PAGE_WINDOW + 1);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

const STATUS_STYLES = {
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  ongoing: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-purple-50 text-purple-700 border-purple-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  archived: "bg-amber-50 text-amber-700 border-amber-200",
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
};

const sortableColumns = [
  ["name", "EXAM"],
  ["type", "TYPE"],
  ["examDate", "DATE"],
  ["status", "STATUS"],
];

export default function ExamsTable({
  exams,
  total,
  totalPages,
  isLoading,
  isFetching,
  filters,
  options,
  onFilterChange,
  onSort,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}) {
  const setFilter = (field, value) =>
    onFilterChange({ ...filters, [field]: value, page: 1 });
  const pages = visiblePages(filters.page, totalPages);
  const start = total === 0 ? 0 : (filters.page - 1) * filters.limit + 1;
  const end = Math.min(filters.page * filters.limit, total);
  return (
    <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={filters.search}
            onChange={(event) => setFilter("search", event.target.value)}
            placeholder="Search exams, classes, subjects..."
            aria-label="Search exams"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <select
          value={filters.academicYearId}
          onChange={(event) => setFilter("academicYearId", event.target.value)}
          aria-label="Filter by academic year"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="">All academic years</option>
          {(options?.academicYears || []).map((year) => (
            <option key={year.id} value={year.id}>{year.name}</option>
          ))}
        </select>
        <select
          value={filters.classId}
          onChange={(event) => setFilter("classId", event.target.value)}
          aria-label="Filter by class"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="">All classes</option>
          {(options?.classes || []).map((schoolClass) => (
            <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.name}</option>
          ))}
        </select>
        <select
          value={filters.subjectId}
          onChange={(event) => setFilter("subjectId", event.target.value)}
          aria-label="Filter by subject"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="">All subjects</option>
          {(options?.subjects || []).map((subject) => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
        </select>
        <select
          value={filters.type}
          onChange={(event) => setFilter("type", event.target.value)}
          aria-label="Filter by exam type"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="">All types</option>
          {[...new Set([
            "Quiz",
            "Test",
            "Midterm",
            "Final",
            "Practical",
            "Assignment",
            ...(options?.types || []),
          ])].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(event) => setFilter("status", event.target.value)}
          aria-label="Filter by status"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="">All statuses</option>
          {["draft", "scheduled", "ongoing", "completed", "cancelled", "archived"].map((status) => (
            <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {sortableColumns.map(([key, label]) => {
                const active = filters.sort === key;
                return (
                  <th key={key} className="px-5 py-3 text-xs font-semibold tracking-wider text-slate-500">
                    <button
                      type="button"
                      onClick={() => onSort(key)}
                      className="inline-flex items-center gap-1 uppercase hover:text-slate-800"
                    >
                      {label}
                      {active ? (
                        filters.order === "asc"
                          ? <ChevronUp className="h-3.5 w-3.5" />
                          : <ChevronDown className="h-3.5 w-3.5" />
                      ) : null}
                    </button>
                  </th>
                );
              })}
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500">CLASS / SECTION</th>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500">SUBJECT</th>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500">YEAR · MARKS</th>
              <th className="px-5 py-3 text-right text-xs font-semibold tracking-wider text-slate-500">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-500">Loading exams...</td></tr>
            ) : exams.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-500">No exams match these filters.</td></tr>
            ) : exams.map((exam) => {
              const status = exam.archivedAt ? "archived" : exam.status;
              return (
                <tr key={exam.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{exam.name}</p>
                    {exam.term ? <p className="mt-1 text-xs text-slate-500">{exam.term}</p> : null}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{exam.type}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600">
                    {formatDate(exam.examDate)}
                    {exam.startTime ? <span className="ml-1 text-xs text-slate-400">{exam.startTime}</span> : null}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status] || STATUS_STYLES.draft}`}>
                      {status[0].toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {exam.section?.class?.name} · {exam.section?.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{exam.subject?.name}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600">
                    {exam.academicYear?.name} · {exam.totalMarks}/{exam.passingMarks}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => onView(exam)} title="View exam" aria-label={`View ${exam.name}`} className="rounded-md p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700">
                        <Eye className="h-4 w-4" />
                      </button>
                      {!exam.archivedAt ? (
                        <>
                          <button type="button" onClick={() => onEdit(exam)} title="Edit exam" aria-label={`Edit ${exam.name}`} className="rounded-md p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => onDelete(exam)} title="Delete exam" aria-label={`Delete ${exam.name}`} className="rounded-md p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{start}–{end}</span> of{" "}
          <span className="font-medium text-slate-700">{total}</span> exams
          {isFetching && !isLoading ? <span className="ml-2 text-xs">Updating…</span> : null}
        </p>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onPageChange(filters.page - 1)} disabled={filters.page <= 1} aria-label="Previous page" className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pages.map((page) => (
            <button key={page} type="button" onClick={() => onPageChange(page)} aria-current={page === filters.page ? "page" : undefined} className={`h-8 min-w-8 rounded-lg px-2 text-sm ${page === filters.page ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              {page}
            </button>
          ))}
          <button type="button" onClick={() => onPageChange(filters.page + 1)} disabled={filters.page >= totalPages} aria-label="Next page" className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
