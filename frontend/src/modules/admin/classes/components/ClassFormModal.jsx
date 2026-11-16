import { useState } from "react";
import Modal from "@shared/components/AttendanceModal";
import { useClass, useCreateClass, useUpdateClass } from "../hooks/useClasses";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

const emptyForm = { name: "", code: "", description: "" };

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "The class could not be saved.";

export default function ClassFormModal({ classId, isOpen, onClose }) {
  const isEdit = Boolean(classId);
  const classQuery = useClass(isEdit ? classId : null);
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState("");
  const isSaving = createClass.isPending || updateClass.isPending;
  const formKey = classId || "new";
  const form =
    draft?.key === formKey
      ? draft.values
      : isEdit && classQuery.data
        ? {
            name: classQuery.data.name || "",
            code: classQuery.data.code || "",
            description: classQuery.data.description || "",
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
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim(),
        description: form.description.trim() || null,
      };
      if (isEdit) {
        await updateClass.mutateAsync({ id: classId, payload });
      } else {
        await createClass.mutateAsync(payload);
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
      title={isEdit ? "Edit class" : "Add class"}
      subtitle="Define the grade or academic level. Add year-specific sections from the class details."
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
            form="class-form"
            disabled={isSaving || (isEdit && !classQuery.data)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : isEdit ? "Save changes" : "Add class"}
          </button>
        </div>
      }
    >
      {isEdit && classQuery.isLoading ? (
        <p className="p-6 text-sm text-slate-500">Loading class...</p>
      ) : isEdit && classQuery.isError ? (
        <p role="alert" className="p-6 text-sm text-rose-600">
          {getErrorMessage(classQuery.error)}
        </p>
      ) : (
        <form id="class-form" onSubmit={handleSubmit} className="space-y-4 p-6">
          {error ? (
            <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}
          <label className="block text-sm font-medium text-slate-700">
            Class name
            <input
              className={`${inputClass} mt-1`}
              maxLength={120}
              required
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              placeholder="e.g. Grade 9"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Class code
            <input
              className={`${inputClass} mt-1`}
              maxLength={30}
              required
              value={form.code}
              onChange={(event) => setField("code", event.target.value)}
              placeholder="e.g. G9"
            />
          </label>
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
