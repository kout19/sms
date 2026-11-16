import { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "@shared/components/AttendanceModal";
import { useDebouncedValue } from "@shared/hooks/useDebouncedValue";
import ExamStatCards from "../cards/ExamStatCards";
import ExamsTable from "../components/ExamsTable";
import CreateExamModal from "../components/CreateExamModal";
import EditExamModal from "../components/EditExamModal";
import ExamDetailsModal from "../components/ExamDeatilsModal";
import {
  useDeleteExam,
  useExamOptions,
  useExamStats,
  useExams,
} from "../hooks/useExams";

const initialFilters = {
  search: "",
  academicYearId: "",
  classId: "",
  subjectId: "",
  type: "",
  status: "",
  sort: "examDate",
  order: "asc",
  page: 1,
  limit: 10,
};

const getApiError = (error) => {
  const validationErrors = error?.response?.data?.errors;
  if (Array.isArray(validationErrors) && validationErrors.length) {
    return validationErrors.map((item) => item.message).join(" ");
  }
  return error?.response?.data?.message || error?.message || "The request failed.";
};

export default function ExamsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [viewingExam, setViewingExam] = useState(null);
  const [deletingExam, setDeletingExam] = useState(null);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");

  const search = useDebouncedValue(
    filters.search.trim().replace(/\s+/g, " "),
    350,
  );
  const queryFilters = { ...filters, search };
  const examsQuery = useExams(queryFilters);
  const optionsQuery = useExamOptions();
  const statsQuery = useExamStats(
    filters.academicYearId ? { academicYearId: filters.academicYearId } : {},
  );
  const deleteExam = useDeleteExam();

  const exams = examsQuery.data?.data || [];
  const meta = examsQuery.data?.meta || {};

  const closeEditor = () => {
    setIsCreateOpen(false);
    setEditingExam(null);
  };

  const handleSort = (sort) => {
    setFilters((current) => ({
      ...current,
      sort,
      order: current.sort === sort && current.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleArchive = async () => {
    if (!deletingExam) return;
    setActionError("");
    try {
      await deleteExam.mutateAsync(deletingExam.id);
      setNotice(`${deletingExam.name} was deleted from active exams; its historical record was retained.`);
      setDeletingExam(null);
    } catch (error) {
      setActionError(getApiError(error));
    }
  };

  if (examsQuery.isLoading && !examsQuery.data) {
    return <div className="p-6 text-sm text-slate-500">Loading exams...</div>;
  }

  if (examsQuery.isError && !examsQuery.data) {
    return (
      <div className="p-6">
        <p role="alert" className="text-sm text-rose-700">
          Failed to load exams: {getApiError(examsQuery.error)}
        </p>
        <button
          type="button"
          onClick={() => examsQuery.refetch()}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col gap-5 bg-slate-50 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">Exams</h1>
          <p className="mt-1 text-sm text-slate-500">Create and manage school examinations.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setNotice("");
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add exam
        </button>
      </div>

      {notice ? (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{notice}</p>
      ) : null}
      {actionError ? (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{actionError}</p>
      ) : null}
      {examsQuery.isError ? (
        <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          The latest list request failed. Showing previously loaded exams.
        </p>
      ) : null}
      {optionsQuery.isError ? (
        <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Exam filter options could not be loaded: {getApiError(optionsQuery.error)}
          <button type="button" onClick={() => optionsQuery.refetch()} className="ml-2 font-semibold underline">Retry</button>
        </p>
      ) : null}
      {statsQuery.isError ? (
        <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Exam summary statistics could not be loaded: {getApiError(statsQuery.error)}
        </p>
      ) : null}

      <ExamStatCards stats={statsQuery.data} isLoading={statsQuery.isLoading} />

      <ExamsTable
        exams={exams}
        total={meta.total ?? exams.length}
        totalPages={meta.totalPages ?? 1}
        isLoading={examsQuery.isLoading}
        isFetching={examsQuery.isFetching}
        filters={filters}
        options={optionsQuery.data}
        onFilterChange={setFilters}
        onSort={handleSort}
        onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
        onView={(exam) => setViewingExam(exam)}
        onEdit={(exam) => {
          setNotice("");
          setEditingExam(exam);
        }}
        onDelete={(exam) => {
          setActionError("");
          setDeletingExam(exam);
        }}
      />

      <CreateExamModal
        isOpen={isCreateOpen}
        onClose={closeEditor}
        onSaved={setNotice}
      />
      <EditExamModal
        isOpen={Boolean(editingExam)}
        exam={editingExam}
        onClose={closeEditor}
        onSaved={setNotice}
      />
      <ExamDetailsModal
        isOpen={Boolean(viewingExam)}
        examId={viewingExam?.id}
        initialData={viewingExam}
        onClose={() => setViewingExam(null)}
        onEdit={(exam) => {
          setViewingExam(null);
          setEditingExam(exam);
        }}
      />
      <Modal
        isOpen={Boolean(deletingExam)}
        onClose={() => (deleteExam.isPending ? null : setDeletingExam(null))}
        title="Delete exam"
        subtitle="The exam will be removed from active lists and archived so its record is retained."
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeletingExam(null)}
              disabled={deleteExam.isPending}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleArchive}
              disabled={deleteExam.isPending}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {deleteExam.isPending ? "Deleting..." : "Delete exam"}
            </button>
          </div>
        }
      >
        <div className="space-y-3 px-6 py-5">
          {actionError ? (
            <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {actionError}
            </p>
          ) : null}
          <p className="text-sm text-slate-600">
            Delete <span className="font-semibold">{deletingExam?.name}</span> from active exams?
          </p>
        </div>
      </Modal>
    </div>
  );
}
