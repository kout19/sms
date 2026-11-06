import { useEffect, useState } from "react";
import Modal from "@shared/components/AttendanceModal";
import { useCreateTeacher, useTeacher, useUpdateTeacher } from "../hooks/useTeachers";
import {
  emptyTeacherForm,
  getApiError,
  teacherToForm,
  toTeacherPayload,
  validateTeacherForm,
} from "../utils/teacherForm";

const inputClass =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

const Field = ({ label, error, children }) => (
  <label className="block text-sm">
    <span className="font-medium text-slate-700">{label}</span>
    <div className="mt-1">{children}</div>
    {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
  </label>
);

export default function TeacherFormModal({ mode, teacherId, isOpen, onClose, onSaved }) {
  const isEdit = mode === "edit";
  const teacherQuery = useTeacher(isOpen && isEdit ? teacherId : null);
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const [form, setForm] = useState(emptyTeacherForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setHydrated(false);
      return;
    }
    if (isEdit) {
      if (teacherQuery.data) {
        setForm(teacherToForm(teacherQuery.data));
        setErrors({});
        setFormError("");
        setHydrated(true);
      }
      return;
    }
    setForm(emptyTeacherForm);
    setErrors({});
    setFormError("");
    setHydrated(true);
  }, [isOpen, isEdit, teacherQuery.data]);

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const isSaving = createTeacher.isPending || updateTeacher.isPending;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateTeacherForm(form, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const payload = toTeacherPayload(form, mode);
      if (isEdit) {
        await updateTeacher.mutateAsync({ id: teacherId, payload });
        onSaved("Teacher updated.");
      } else {
        await createTeacher.mutateAsync(payload);
        onSaved("Teacher added.");
      }
      onClose();
    } catch (error) {
      setFormError(getApiError(error));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSaving ? () => {} : onClose}
      title={isEdit ? "Edit teacher" : "Add teacher"}
      subtitle="The login account and the teacher profile are saved together. A department cannot be assigned until departments exist."
      maxWidth="max-w-3xl"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="teacher-form"
            disabled={isSaving || (isEdit && !hydrated)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isSaving ? "Saving..." : isEdit ? "Save changes" : "Add teacher"}
          </button>
        </div>
      }
    >
      <form id="teacher-form" onSubmit={handleSubmit} className="grid gap-4 p-6 sm:grid-cols-2">
        {isEdit && teacherQuery.isLoading ? (
          <p className="text-sm text-slate-500 sm:col-span-2">Loading teacher...</p>
        ) : null}
        {isEdit && teacherQuery.isError ? (
          <p className="text-sm text-rose-600 sm:col-span-2">{getApiError(teacherQuery.error)}</p>
        ) : null}
        {formError ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 sm:col-span-2">
            {formError}
          </p>
        ) : null}
        <Field label="First name" error={errors.firstName}>
          <input
            className={inputClass}
            value={form.firstName}
            onChange={(event) => setField("firstName", event.target.value)}
          />
        </Field>
        <Field label="Last name" error={errors.lastName}>
          <input
            className={inputClass}
            value={form.lastName}
            onChange={(event) => setField("lastName", event.target.value)}
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
          />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input
            className={inputClass}
            value={form.phone}
            onChange={(event) => setField("phone", event.target.value)}
          />
        </Field>
        <Field
          label={isEdit ? "New password" : "Password"}
          error={errors.password}
        >
          <input
            type="password"
            className={inputClass}
            value={form.password}
            onChange={(event) => setField("password", event.target.value)}
            placeholder={isEdit ? "Leave blank to keep the current password" : ""}
          />
        </Field>
        <Field label="Employee ID" error={errors.employeeId}>
          <input
            className={inputClass}
            value={form.employeeId}
            onChange={(event) => setField("employeeId", event.target.value)}
          />
        </Field>
        <Field label="Hire date" error={errors.hireDate}>
          <input
            type="date"
            className={inputClass}
            value={form.hireDate}
            onChange={(event) => setField("hireDate", event.target.value)}
          />
        </Field>
        {isEdit ? (
          <Field label="Account status">
            <select
              className={inputClass}
              value={form.isActive ? "true" : "false"}
              onChange={(event) => setField("isActive", event.target.value === "true")}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </Field>
        ) : null}
        <Field label="Qualifications" error={errors.qualifications}>
          <textarea
            rows={3}
            className={`${inputClass} sm:col-span-2`}
            value={form.qualifications}
            onChange={(event) => setField("qualifications", event.target.value)}
          />
        </Field>
      </form>
    </Modal>
  );
}
