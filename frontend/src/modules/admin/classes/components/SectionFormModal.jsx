import { useState } from "react";
import Modal from "@shared/components/AttendanceModal";
import {
  useCreateSection,
  useSection,
  useUpdateSection,
} from "../hooks/useClasses";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const emptyForm = {
  name: "",
  code: "",
  academicYear: "",
  capacity: "",
  room: "",
};

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "The section could not be saved.";

export default function SectionFormModal({
  classId,
  sectionId,
  isOpen,
  onClose,
}) {
  const isEdit = Boolean(sectionId);
  const sectionQuery = useSection(isEdit ? sectionId : null);
  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState("");
  const isSaving = createSection.isPending || updateSection.isPending;
  const formKey = sectionId || `new:${classId}`;
  const form =
    draft?.key === formKey
      ? draft.values
      : isEdit && sectionQuery.data
        ? {
            name: sectionQuery.data.name || "",
            code: sectionQuery.data.code || "",
            academicYear: sectionQuery.data.academicYear || "",
            capacity: sectionQuery.data.capacity ?? "",
            room: sectionQuery.data.room || "",
          }
        : emptyForm;

  const setField = (field, value) =>
    setDraft((current) => ({
      key: formKey,
      values: { ...(current?.key === formKey ? current.values : form), [field]: value },
    }));

  const close = () => {
    setDraft(null);
    setError("");
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const payload = {
      name: form.name.trim(),
      code: form.code.trim(),
      academicYear: form.academicYear.trim(),
      capacity: form.capacity === "" ? null : Number(form.capacity),
      room: form.room.trim() || null,
    };
    try {
      if (isEdit) {
        await updateSection.mutateAsync({ id: sectionId, payload });
      } else {
        await createSection.mutateAsync({ classId, payload });
      }
      close();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSaving ? () => {} : close}
      title={isEdit ? "Edit section" : "Add section"}
      subtitle="Sections are tracked separately for each academic year."
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={close}
            disabled={isSaving}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="section-form"
            disabled={isSaving || (isEdit && !sectionQuery.data)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : isEdit ? "Save changes" : "Add section"}
          </button>
        </div>
      }
    >
      {isEdit && sectionQuery.isLoading ? (
        <p className="p-6 text-sm text-slate-500">Loading section...</p>
      ) : isEdit && sectionQuery.isError ? (
        <p role="alert" className="p-6 text-sm text-rose-600">
          {getErrorMessage(sectionQuery.error)}
        </p>
      ) : (
        <form id="section-form" onSubmit={handleSubmit} className="space-y-4 p-6">
          {error ? (
            <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Section name
              <input
                className={`${inputClass} mt-1`}
                maxLength={50}
                required
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                placeholder="e.g. Section A"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Section code
              <input
                className={`${inputClass} mt-1`}
                maxLength={30}
                required
                value={form.code}
                onChange={(event) => setField("code", event.target.value)}
                placeholder="e.g. A"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Academic year
              <input
                className={`${inputClass} mt-1`}
                maxLength={30}
                required
                value={form.academicYear}
                onChange={(event) => setField("academicYear", event.target.value)}
                placeholder="e.g. 2026-2027"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Capacity
              <input
                className={`${inputClass} mt-1`}
                type="number"
                min="1"
                step="1"
                value={form.capacity}
                onChange={(event) => setField("capacity", event.target.value)}
              />
            </label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Room
              <input
                className={`${inputClass} mt-1`}
                maxLength={80}
                value={form.room}
                onChange={(event) => setField("room", event.target.value)}
                placeholder="Optional"
              />
            </label>
          </div>
        </form>
      )}
    </Modal>
  );
}
