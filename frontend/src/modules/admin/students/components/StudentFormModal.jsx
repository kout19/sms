import { useEffect, useState } from "react";
import Modal from "@shared/components/AttendanceModal";
import {
  useCreateStudent,
  useStudent,
  useUpdateStudent,
} from "../hooks/useStudents";
import {
  emptyStudentForm,
  getApiError,
  studentToForm,
  toStudentPayload,
  validateStudentForm,
  classOptionLabel,
} from "../utils/studentForm";

const inputClass =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

const Field = ({ label, error, children }) => (
  <label className="block text-sm">
    <span className="font-medium text-slate-700">{label}</span>
    <div className="mt-1">{children}</div>
    {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
  </label>
);

export default function StudentFormModal({
  mode,
  studentId,
  classes,
  isOpen,
  onClose,
  onSaved,
}) {
  const isEdit = mode === "edit";
  const studentQuery = useStudent(isOpen && isEdit ? studentId : null);
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const [form, setForm] = useState(emptyStudentForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setHydrated(false);
      return;
    }
    if (isEdit) {
      if (studentQuery.data) {
        setForm(studentToForm(studentQuery.data));
        setErrors({});
        setFormError("");
        setHydrated(true);
      }
      return;
    }
    setForm(emptyStudentForm);
    setErrors({});
    setFormError("");
    setHydrated(true);
  }, [isOpen, isEdit, studentQuery.data]);

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const isSaving = createStudent.isPending || updateStudent.isPending;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateStudentForm(form, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const payload = toStudentPayload(form, mode);
      if (isEdit) {
        await updateStudent.mutateAsync({ id: studentId, payload });
        onSaved("Student updated.");
      } else {
        await createStudent.mutateAsync(payload);
        onSaved("Student added.");
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
      title={isEdit ? "Edit student" : "Add student"}
      subtitle="Guardian details stay on the student record. This does not create a parent account."
      maxWidth="max-w-3xl"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="student-form"
            disabled={isSaving || !hydrated}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : isEdit ? "Save changes" : "Add student"}
          </button>
        </div>
      }
    >
      {isEdit && !hydrated && !studentQuery.isError ? (
        <p className="p-6 text-sm text-slate-500">Loading student...</p>
      ) : isEdit && studentQuery.isError ? (
        <p className="p-6 text-sm text-rose-600">{getApiError(studentQuery.error)}</p>
      ) : (
        <form id="student-form" onSubmit={handleSubmit} className="space-y-5 p-6">
          {formError ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {formError}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="First name" error={errors.firstName}>
              <input className={inputClass} value={form.firstName} onChange={(event) => setField("firstName", event.target.value)} />
            </Field>
            <Field label="Last name" error={errors.lastName}>
              <input className={inputClass} value={form.lastName} onChange={(event) => setField("lastName", event.target.value)} />
            </Field>
            <Field label="Email" error={errors.email}>
              <input type="email" className={inputClass} value={form.email} onChange={(event) => setField("email", event.target.value)} />
            </Field>
            <Field label={isEdit ? "New password" : "Password"} error={errors.password}>
              <input
                type="password"
                autoComplete="new-password"
                className={inputClass}
                value={form.password}
                placeholder={isEdit ? "Leave blank to keep the current password" : ""}
                onChange={(event) => setField("password", event.target.value)}
              />
            </Field>
            <Field label="Phone">
              <input className={inputClass} value={form.phone} onChange={(event) => setField("phone", event.target.value)} />
            </Field>
            <Field label="Admission number">
              <input className={inputClass} value={form.admissionNo} onChange={(event) => setField("admissionNo", event.target.value)} />
            </Field>
            <Field label="Date of birth" error={errors.dateOfBirth}>
              <input type="date" className={inputClass} value={form.dateOfBirth} onChange={(event) => setField("dateOfBirth", event.target.value)} />
            </Field>
            <Field label="Gender">
              <select className={inputClass} value={form.gender} onChange={(event) => setField("gender", event.target.value)}>
                <option value="">Not specified</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Enrollment date">
              <input type="date" className={inputClass} value={form.enrollmentDate} onChange={(event) => setField("enrollmentDate", event.target.value)} />
            </Field>
            <Field label="Class">
              <select className={inputClass} value={form.classId} onChange={(event) => setField("classId", event.target.value)}>
                <option value="">Unassigned</option>
                {classes.map((schoolClass) => (
                  <option key={schoolClass.id} value={schoolClass.id}>
                    {classOptionLabel(schoolClass)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Previous school">
              <input className={inputClass} value={form.previousSchool} onChange={(event) => setField("previousSchool", event.target.value)} />
            </Field>
            <Field label="Address">
              <input className={inputClass} value={form.address} onChange={(event) => setField("address", event.target.value)} />
            </Field>
            <Field label="Guardian name">
              <input className={inputClass} value={form.guardianName} onChange={(event) => setField("guardianName", event.target.value)} />
            </Field>
            <Field label="Guardian phone">
              <input className={inputClass} value={form.guardianPhone} onChange={(event) => setField("guardianPhone", event.target.value)} />
            </Field>
            <Field label="Guardian email" error={errors.guardianEmail}>
              <input type="email" className={inputClass} value={form.guardianEmail} onChange={(event) => setField("guardianEmail", event.target.value)} />
            </Field>
          </div>

          <Field label="Medical notes">
            <textarea
              rows={3}
              className={inputClass}
              value={form.medicalNotes}
              onChange={(event) => setField("medicalNotes", event.target.value)}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setField("isActive", event.target.checked)}
            />
            Active account
          </label>
        </form>
      )}
    </Modal>
  );
}
