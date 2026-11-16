import Modal from "@shared/components/AttendanceModal";
import { useExamDetails } from "../hooks/useExams";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(date);
};

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "The exam details could not be loaded.";

export default function ExamDetailsModal({
  isOpen,
  onClose,
  examId,
  initialData,
  onEdit,
}) {
  const query = useExamDetails(isOpen ? examId : null);
  const exam = query.data || initialData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Exam details"
      subtitle="Academic information and schedule"
      footer={
        <div className="flex justify-end gap-2">
          {exam && !exam.archivedAt ? (
            <button
              type="button"
              onClick={() => onEdit(exam)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Edit exam
            </button>
          ) : null}
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">
            Close
          </button>
        </div>
      }
    >
      {query.isLoading && !exam ? (
        <p className="p-6 text-sm text-slate-500">Loading exam details...</p>
      ) : query.isError && !exam ? (
        <div className="p-6">
          <p role="alert" className="text-sm text-rose-700">{getErrorMessage(query.error)}</p>
          <button type="button" onClick={() => query.refetch()} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">
            Try again
          </button>
        </div>
      ) : exam ? (
        <div className="space-y-5 p-6">
          {query.isError ? (
            <p role="alert" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Showing the list data because the latest details request failed.
            </p>
          ) : null}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{exam.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{exam.type}{exam.term ? ` · ${exam.term}` : ""}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
              {exam.archivedAt ? "Archived" : exam.status}
            </span>
          </div>
          {exam.description ? <p className="text-sm leading-6 text-slate-600">{exam.description}</p> : null}
          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              ["Academic year", exam.academicYear?.name],
              ["Class", exam.section?.class?.name],
              ["Section", exam.section?.name],
              ["Subject", exam.subject?.name],
              ["Exam date", formatDate(exam.examDate)],
              ["Time", exam.startTime ? `${exam.startTime}${exam.endTime ? `–${exam.endTime}` : ""}` : "—"],
              ["Duration", exam.durationMinutes ? `${exam.durationMinutes} minutes` : "—"],
              ["Total marks", exam.totalMarks],
              ["Passing marks", exam.passingMarks],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">{value ?? "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <p className="p-6 text-sm text-slate-500">Exam details are unavailable.</p>
      )}
    </Modal>
  );
}
