import { useState } from "react";
import Modal from "@shared/components/AttendanceModal";
import {
  useCreateExam,
  useExamOptions,
  useUpdateExam,
} from "../hooks/useExams";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

const emptyForm = {
  name: "",
  description: "",
  type: "Quiz",
  term: "",
  academicYearId: "",
  classId: "",
  sectionId: "",
  subjectId: "",
  examDate: "",
  startTime: "",
  endTime: "",
  durationMinutes: "",
  totalMarks: "100",
  passingMarks: "50",
  status: "draft",
};
const emptyOptions = { classes: [], academicYears: [] };

const getApiError = (error) => {
  const validationErrors = error?.response?.data?.errors;
  if (Array.isArray(validationErrors) && validationErrors.length) {
    return validationErrors.map((item) => item.message).join(" ");
  }
  return error?.response?.data?.message || error?.message || "The exam could not be saved.";
};

const formatDate = (date) => {
  if (!date) return "";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
};

const toForm = (exam) => ({
  ...emptyForm,
  name: exam?.name || "",
  description: exam?.description || "",
  type: exam?.type || "Quiz",
  term: exam?.term || "",
  academicYearId: exam?.academicYearId || "",
  classId: exam?.section?.class?.id || "",
  sectionId: exam?.sectionId || "",
  subjectId: exam?.subjectId || "",
  examDate: formatDate(exam?.examDate),
  startTime: exam?.startTime || "",
  endTime: exam?.endTime || "",
  durationMinutes: exam?.durationMinutes?.toString() || "",
  totalMarks: exam?.totalMarks?.toString() || "100",
  passingMarks: exam?.passingMarks?.toString() || "50",
  status: exam?.status || "draft",
});

export default function CreateExamModal({ isOpen, onClose, onSaved, exam = null }) {
  const isEdit = Boolean(exam);
  const optionsQuery = useExamOptions();
  const createExam = useCreateExam();
  const updateExam = useUpdateExam();
  const mutation = isEdit ? updateExam : createExam;
  const [draft, setDraft] = useState(null);
  const formKey = exam?.id || "new";
  const options = optionsQuery.data || emptyOptions;
  const classes = options.classes;
  const academicYears = options.academicYears;
  const defaultYear =
    academicYears.find((year) => year.isCurrent) || academicYears[0];
  const examForm = toForm(exam);
  const initialForm =
    !isEdit && !examForm.academicYearId && defaultYear
      ? { ...examForm, academicYearId: defaultYear.id }
      : examForm;
  const form =
    draft?.key === formKey ? draft.values : initialForm;
  const formError =
    optionsQuery.isError
      ? getApiError(optionsQuery.error)
      : draft?.key === formKey
        ? draft.error
        : "";
  const sections = (classes.find((item) => item.id === form.classId)?.sections || [])
    .filter((section) => section.academicYearId === form.academicYearId);
  const selectedSection = sections.find((section) => section.id === form.sectionId);
  const availableSubjects = selectedSection?.subjects || [];

  const updateForm = (updater) =>
    setDraft((current) => {
      const currentValues =
        current?.key === formKey ? current.values : initialForm;
      return {
        key: formKey,
        values: typeof updater === "function" ? updater(currentValues) : updater,
        error: "",
      };
    });
  const setField = (field, value) =>
    updateForm((current) => ({ ...current, [field]: value }));

  const close = () => {
    if (mutation.isPending) return;
    setDraft(null);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (Number(form.passingMarks) > Number(form.totalMarks)) {
      setDraft({ key: formKey, values: form, error: "Passing marks cannot exceed total marks." });
      return;
    }
    if (
      Boolean(form.startTime) !== Boolean(form.endTime) ||
      (form.startTime && form.endTime && form.startTime >= form.endTime)
    ) {
      setDraft({
        key: formKey,
        values: form,
        error: "Provide both times and make sure the end time is later.",
      });
      return;
    }

    const payload = {
      name: form.name,
      description: form.description.trim() || null,
      type: form.type,
      term: form.term.trim() || null,
      academicYearId: form.academicYearId,
      sectionId: form.sectionId,
      subjectId: form.subjectId,
      examDate: form.examDate,
      startTime: form.startTime || null,
      endTime: form.endTime || null,
      durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
      totalMarks: Number(form.totalMarks),
      passingMarks: Number(form.passingMarks),
      status: form.status,
    };

    try {
      if (isEdit) {
        await updateExam.mutateAsync({ id: exam.id, payload });
      } else {
        await createExam.mutateAsync(payload);
      }
      onSaved?.(isEdit ? "Exam updated." : "Exam created.");
      onClose();
    } catch (saveError) {
      setDraft({ key: formKey, values: form, error: getApiError(saveError) });
    }
  };

  const loadingOptions = optionsQuery.isLoading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title={isEdit ? "Edit exam" : "Add exam"}
      subtitle="Schedule an assessment for a class section and subject."
      maxWidth="max-w-3xl"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={close}
            disabled={mutation.isPending}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="exam-form"
            disabled={mutation.isPending || loadingOptions || optionsQuery.isError}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : isEdit ? "Save changes" : "Create exam"}
          </button>
        </div>
      }
    >
      {loadingOptions ? (
        <p className="p-6 text-sm text-slate-500">Loading exam options...</p>
      ) : optionsQuery.isError ? (
        <div className="p-6">
          <p role="alert" className="text-sm text-rose-700">{getApiError(optionsQuery.error)}</p>
          <button
            type="button"
            onClick={() => optionsQuery.refetch()}
            className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white"
          >
            Try again
          </button>
        </div>
      ) : (
        <form id="exam-form" onSubmit={handleSubmit} className="space-y-4 p-6">
          {formError ? (
            <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {formError}
            </p>
          ) : null}
          <label className="block text-sm font-medium text-slate-700">
            Exam name
            <input
              className={`${inputClass} mt-1`}
              maxLength={120}
              required
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              placeholder="e.g. Mathematics Midterm"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Exam type
              <input
                className={`${inputClass} mt-1`}
                list="exam-type-options"
                maxLength={50}
                required
                value={form.type}
                onChange={(event) => setField("type", event.target.value)}
              />
              <datalist id="exam-type-options">
                {["Quiz", "Test", "Midterm", "Final", "Practical", "Assignment"].map((type) => (
                  <option key={type} value={type} />
                ))}
              </datalist>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Academic year
              <select
                className={`${inputClass} mt-1`}
                required
                value={form.academicYearId}
                onChange={(event) => {
                  updateForm((current) => ({
                    ...current,
                    academicYearId: event.target.value,
                    classId: "",
                    sectionId: "",
                    subjectId: "",
                  }));
                }}
              >
                <option value="">Select academic year</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>{year.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Class
              <select
                className={`${inputClass} mt-1`}
                required
                value={form.classId}
                onChange={(event) => {
                  updateForm((current) => ({
                    ...current,
                    classId: event.target.value,
                    sectionId: "",
                    subjectId: "",
                  }));
                }}
              >
                <option value="">Select class</option>
                {classes.filter((schoolClass) =>
                  schoolClass.sections.some(
                    (section) => section.academicYearId === form.academicYearId,
                  ),
                ).map((schoolClass) => (
                  <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Section
              <select
                className={`${inputClass} mt-1`}
                required
                value={form.sectionId}
                onChange={(event) => {
                  updateForm((current) => ({
                    ...current,
                    sectionId: event.target.value,
                    subjectId: "",
                  }));
                }}
              >
                <option value="">Select section</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>{section.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Subject
              <select
                className={`${inputClass} mt-1`}
                required
                value={form.subjectId}
                onChange={(event) => setField("subjectId", event.target.value)}
              >
                <option value="">Select subject</option>
                {availableSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.name} ({subject.code})</option>
                ))}
              </select>
              {selectedSection && availableSubjects.length === 0 ? (
                <span className="mt-1 block text-xs text-rose-600">
                  No active subjects are assigned to this section for the selected year.
                </span>
              ) : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Term / semester
              <input
                className={`${inputClass} mt-1`}
                maxLength={50}
                value={form.term}
                onChange={(event) => setField("term", event.target.value)}
                placeholder="Optional"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Exam date
              <input
                className={`${inputClass} mt-1`}
                type="date"
                required
                value={form.examDate}
                onChange={(event) => setField("examDate", event.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Status
              <select
                className={`${inputClass} mt-1`}
                value={form.status}
                onChange={(event) => setField("status", event.target.value)}
              >
                {["draft", "scheduled", "ongoing", "completed", "cancelled"].map((status) => (
                  <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Start time
              <input
                className={`${inputClass} mt-1`}
                type="time"
                value={form.startTime}
                onChange={(event) => setField("startTime", event.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              End time
              <input
                className={`${inputClass} mt-1`}
                type="time"
                value={form.endTime}
                onChange={(event) => setField("endTime", event.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Duration (minutes)
              <input
                className={`${inputClass} mt-1`}
                type="number"
                min="1"
                max="1440"
                value={form.durationMinutes}
                onChange={(event) => setField("durationMinutes", event.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Total marks
              <input
                className={`${inputClass} mt-1`}
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.totalMarks}
                onChange={(event) => setField("totalMarks", event.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Passing marks
              <input
                className={`${inputClass} mt-1`}
                type="number"
                min="0"
                step="0.01"
                required
                value={form.passingMarks}
                onChange={(event) => setField("passingMarks", event.target.value)}
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              className={`${inputClass} mt-1`}
              maxLength={1000}
              rows={3}
              value={form.description}
              onChange={(event) => setField("description", event.target.value)}
            />
          </label>
        </form>
      )}
    </Modal>
  );
}
