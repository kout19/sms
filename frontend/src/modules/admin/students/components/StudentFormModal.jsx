import { useEffect, useState } from "react";
import Modal from "@shared/components/AttendanceModal";
import { useDebouncedValue } from "@shared/hooks/useDebouncedValue";
import { useParents } from "../../parents/hooks/useParents";
import ParentFormModal from "../../parents/components/ParentFormModal";
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
  const [parentSearch, setParentSearch] = useState("");
  const [parentCreateOpen, setParentCreateOpen] = useState(false);
  const [parentNotice, setParentNotice] = useState("");
  const parentSearchTerm = useDebouncedValue(
    parentSearch.trim().replace(/\s+/g, " "),
    350,
  );
  const parentsQuery = useParents(
    {
      search: parentSearchTerm,
      status: "active",
      page: 1,
      limit: 10,
    },
    isOpen && parentSearchTerm.length >= 2,
  );
  const parentOptions = parentsQuery.data?.data || [];

  useEffect(() => {
    if (!isOpen) {
      // The modal form is reset when it closes or new detail data arrives.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHydrated(false);
      setParentCreateOpen(false);
      return;
    }
    setParentSearch("");
    setParentNotice("");
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

  const toggleParent = (parent) => {
    setForm((current) => {
      const selected = current.parents.some(
        ({ parentId }) => parentId === parent.id,
      );
      return {
        ...current,
        parents: selected
          ? current.parents.filter(({ parentId }) => parentId !== parent.id)
          : [
              ...current.parents,
              {
                parentId: parent.id,
                name:
                  parent.name ||
                  `${parent.firstName} ${parent.lastName}`.trim(),
                email: parent.email,
                phone: parent.phone,
                relationship: "guardian",
              },
            ],
      };
    });
  };

  const setParentRelationship = (parentId, relationship) => {
    setForm((current) => ({
      ...current,
      parents: current.parents.map((parent) =>
        parent.parentId === parentId ? { ...parent, relationship } : parent,
      ),
    }));
  };

  const selectCreatedParent = (parent) => {
    setForm((current) => ({
      ...current,
      parents: current.parents.some(({ parentId }) => parentId === parent.id)
        ? current.parents
        : [
            ...current.parents,
            {
              parentId: parent.id,
              name: parent.name || `${parent.firstName} ${parent.lastName}`.trim(),
              email: parent.email,
              phone: parent.phone,
              relationship: "guardian",
            },
          ],
    }));
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
    <>
    <Modal
      isOpen={isOpen}
      onClose={isSaving ? () => {} : onClose}
      title={isEdit ? "Edit student" : "Add student"}
      subtitle="Link existing parent accounts or add one without losing this student draft. Legacy guardian details are retained."
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
          </div>

          <section aria-labelledby="student-parents-heading" className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="student-parents-heading" className="text-sm font-semibold text-slate-800">
                  Parents and guardians
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Link existing parent accounts. A parent can be linked to multiple students.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setParentCreateOpen(true)}
                className="shrink-0 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
              >
                Create new parent
              </button>
            </div>

            {parentNotice ? (
              <p role="status" className="text-xs text-emerald-700">{parentNotice}</p>
            ) : null}
            {form.parents.length ? (
              <ul className="space-y-2">
                {form.parents.map((parent) => (
                  <li
                    key={parent.parentId}
                    className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm text-slate-700">
                      {parent.name}
                      {parent.email ? ` · ${parent.email}` : ""}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs text-slate-600">
                        Relationship
                        <select
                          aria-label={`Relationship for ${parent.name}`}
                          className="rounded border border-slate-200 bg-white px-2 py-1"
                          value={parent.relationship}
                          onChange={(event) =>
                            setParentRelationship(parent.parentId, event.target.value)
                          }
                        >
                          <option value="guardian">Guardian</option>
                          <option value="mother">Mother</option>
                          <option value="father">Father</option>
                          <option value="other">Other</option>
                        </select>
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleParent({ id: parent.parentId })}
                        className="text-xs font-medium text-rose-600 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                No parent accounts linked.
              </p>
            )}

            <Field label="Search parent accounts">
              <input
                type="search"
                className={inputClass}
                value={parentSearch}
                onChange={(event) => setParentSearch(event.target.value)}
                placeholder="Search by name, email, or phone"
              />
            </Field>
            {parentSearch.trim().length < 2 ? (
              <p className="text-xs text-slate-500">Enter at least 2 characters to search.</p>
            ) : parentSearch.trim().replace(/\s+/g, " ") !== parentSearchTerm ? (
              <p className="text-sm text-slate-500">Searching parent accounts...</p>
            ) : parentsQuery.isError ? (
              <p role="alert" className="text-sm text-rose-600">{getApiError(parentsQuery.error)}</p>
            ) : parentsQuery.isLoading ? (
              <p className="text-sm text-slate-500">Searching parent accounts...</p>
            ) : parentOptions.length ? (
              <ul className="max-h-40 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-200">
                {parentOptions.map((parent) => (
                  <li key={parent.id} className="p-2">
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.parents.some(({ parentId }) => parentId === parent.id)}
                        onChange={() => toggleParent(parent)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>
                        {parent.name || `${parent.firstName} ${parent.lastName}`}
                        {parent.email ? ` · ${parent.email}` : ""}
                        {parent.phone ? ` · ${parent.phone}` : ""}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No active parent accounts matched this search.</p>
            )}
          </section>

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
    <ParentFormModal
      mode="create"
      isOpen={isOpen && parentCreateOpen}
      onClose={() => setParentCreateOpen(false)}
      onParentCreated={selectCreatedParent}
      onSaved={() => {
        setParentCreateOpen(false);
        setParentNotice("Parent account created and selected.");
      }}
    />
    </>
  );
}
