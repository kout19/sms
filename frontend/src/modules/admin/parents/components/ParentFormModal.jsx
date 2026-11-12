import { useState } from "react";
import Modal from "../../../../shared/components/AttendanceModal";
import { useDebouncedValue } from "../../../../shared/hooks/useDebouncedValue";
import {
  useCreateParent,
  useParent,
  useParentStudentOptions,
  useUpdateParent,
  useUpdateParentStudents,
} from "../hooks/useParents";
import {
  emptyParentForm,
  getApiError,
  parentToForm,
  toParentPayload,
  validateParentForm,
} from "../utils/parentForm";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

const Field = ({ label, error, children }) => (
  <label className="block text-sm">
    <span className="font-medium text-slate-700">{label}</span>
    <div className="mt-1">{children}</div>
    {error ? (
      <span className="mt-1 block text-xs text-rose-600">{error}</span>
    ) : null}
  </label>
);

function getSelectedStudents(parent) {
  return Object.fromEntries(
    (parent?.children || []).map((child) => [
      child.id,
      {
        studentId: child.id,
        name: child.name,
        grade: child.grade,
        relationship: child.relationship || "guardian",
      },
    ]),
  );
}

export default function ParentFormModal({
  mode,
  parentId,
  isOpen,
  onClose,
  onSaved,
  onParentCreated,
}) {
  const isCreate = mode === "create";
  const parentQuery = useParent(parentId, isOpen && !isCreate);

  if (!isOpen) return null;

  if (!isCreate && parentQuery.isError) {
    return (
      <Modal
        isOpen
        onClose={onClose}
        title="Parent"
        subtitle="Parent information could not be loaded."
      >
        <p role="alert" className="p-6 text-sm text-rose-600">
          {getApiError(parentQuery.error)}
        </p>
      </Modal>
    );
  }

  if (!isCreate && !parentQuery.data) {
    return (
      <Modal
        isOpen
        onClose={onClose}
        title={mode === "manageChildren" ? "Manage linked students" : "Edit parent"}
      >
        <p className="p-6 text-sm text-slate-500">Loading parent...</p>
      </Modal>
    );
  }

  return (
    <ParentFormContent
      key={`${mode}-${parentId || "new"}`}
      mode={mode}
      parentId={parentId}
      parent={parentQuery.data}
      onClose={onClose}
      onSaved={onSaved}
      onParentCreated={onParentCreated}
    />
  );
}

function ParentFormContent({
  mode,
  parentId,
  parent,
  onClose,
  onSaved,
  onParentCreated,
}) {
  const isCreate = mode === "create";
  const isManage = mode === "manageChildren";
  const [studentSearch, setStudentSearch] = useState("");
  const studentSearchTerm = useDebouncedValue(
    studentSearch.trim().replace(/\s+/g, " "),
    350,
  );
  const studentsQuery = useParentStudentOptions(studentSearchTerm);
  const createParent = useCreateParent();
  const updateParent = useUpdateParent();
  const updateStudents = useUpdateParentStudents();
  const [form, setForm] = useState(() =>
    isCreate ? emptyParentForm : parentToForm(parent),
  );
  const [selectedStudents, setSelectedStudents] = useState(() =>
    getSelectedStudents(parent),
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const isSaving =
    createParent.isPending || updateParent.isPending || updateStudents.isPending;
  const setField = (name, value) =>
    setForm((current) => ({ ...current, [name]: value }));

  const toggleStudent = (student) => {
    setSelectedStudents((current) => {
      if (current[student.id]) {
        const next = { ...current };
        delete next[student.id];
        return next;
      }
      return {
        ...current,
        [student.id]: {
          studentId: student.id,
          name: student.name,
          grade: student.grade,
          relationship: "guardian",
        },
      };
    });
  };

  const setRelationship = (studentId, relationship) => {
    setSelectedStudents((current) => ({
      ...current,
      [studentId]: { ...current[studentId], relationship },
    }));
  };

  const unlinkStudent = (studentId) => {
    setSelectedStudents((current) => {
      const next = { ...current };
      delete next[studentId];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!isManage) {
      const nextErrors = validateParentForm(form, mode);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;
    }

    const students = Object.values(selectedStudents).map(
      ({ studentId, relationship }) => ({ studentId, relationship }),
    );

    try {
      if (isCreate) {
        const createdParent = await createParent.mutateAsync(
          toParentPayload(form, "create", students),
        );
        onParentCreated?.(createdParent);
        onSaved("Parent account created.");
      } else if (isManage) {
        await updateStudents.mutateAsync({ id: parentId, students });
        onSaved("Student relationships updated.");
      } else {
        await updateParent.mutateAsync({
          id: parentId,
          payload: toParentPayload(form, "edit", students),
        });
        onSaved("Parent details updated.");
      }
    } catch (error) {
      setFormError(getApiError(error));
    }
  };

  const title = isCreate
    ? "Add parent"
    : isManage
      ? "Manage linked students"
      : "Edit parent";
  const subtitle = isCreate
    ? "Create a school-scoped parent account. The password is stored as a hash."
    : isManage
      ? "Link or unlink students from this parent account."
      : "Update the parent account and its student relationships.";

  return (
    <Modal
      isOpen
      onClose={isSaving ? () => {} : onClose}
      title={title}
      subtitle={subtitle}
      maxWidth="max-w-3xl"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="parent-form"
            disabled={isSaving}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isSaving
              ? "Saving..."
              : isCreate
                ? "Add parent"
                : isManage
                  ? "Save relationships"
                  : "Save changes"}
          </button>
        </div>
      }
    >
      <form
        id="parent-form"
        onSubmit={handleSubmit}
        className="space-y-5 p-6"
      >
        {formError ? (
          <p
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          >
            {formError}
          </p>
        ) : null}

        {!isManage ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" error={errors.firstName}>
              <input
                autoComplete="given-name"
                required
                className={inputClass}
                value={form.firstName}
                onChange={(event) => setField("firstName", event.target.value)}
              />
            </Field>
            <Field label="Last name" error={errors.lastName}>
              <input
                autoComplete="family-name"
                required
                className={inputClass}
                value={form.lastName}
                onChange={(event) => setField("lastName", event.target.value)}
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                autoComplete="email"
                required
                className={inputClass}
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
              />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input
                type="tel"
                autoComplete="tel"
                className={inputClass}
                value={form.phone}
                onChange={(event) => setField("phone", event.target.value)}
              />
            </Field>
            {isCreate ? (
              <Field label="Initial password" error={errors.password}>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={72}
                  className={inputClass}
                  value={form.password}
                  onChange={(event) => setField("password", event.target.value)}
                />
              </Field>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            {parent.firstName} {parent.lastName} · {parent.email}
          </p>
        )}

        <section aria-labelledby="student-links-heading" className="space-y-3">
          <div>
            <h3
              id="student-links-heading"
              className="text-sm font-semibold text-slate-800"
            >
              Linked students
            </h3>
            <p className="text-xs text-slate-500">
              Search active students in this school and select the students
              linked to this parent.
            </p>
          </div>

          {Object.values(selectedStudents).length ? (
            <ul className="space-y-2">
              {Object.values(selectedStudents).map((student) => (
                <li
                  key={student.studentId}
                  className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-sm text-slate-700">
                    {student.name}
                    {student.grade ? ` · ${student.grade}` : ""}
                  </span>
                  <label className="flex items-center gap-2 text-xs text-slate-600">
                    Relationship
                    <select
                      aria-label={`Relationship to ${student.name}`}
                      className="rounded border border-slate-200 bg-white px-2 py-1"
                      value={student.relationship}
                      onChange={(event) =>
                        setRelationship(student.studentId, event.target.value)
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
                    onClick={() => unlinkStudent(student.studentId)}
                    className="self-start text-xs font-medium text-rose-600 hover:text-rose-700 sm:self-auto"
                  >
                    Unlink
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
              No students linked. You can create a parent account without
              linking a student.
            </p>
          )}

          <label className="block text-sm">
            <span className="font-medium text-slate-700">Search students</span>
            <input
              type="search"
              className={`${inputClass} mt-1`}
              value={studentSearch}
              onChange={(event) => setStudentSearch(event.target.value)}
              placeholder="Enter at least 2 characters"
            />
          </label>
          {studentsQuery.isError ? (
            <p role="alert" className="text-sm text-rose-600">
              {getApiError(studentsQuery.error)}
            </p>
          ) : studentSearch.trim().length < 2 ? (
            <p className="text-xs text-slate-500">
              Enter at least 2 characters to search.
            </p>
          ) : studentSearch.trim().replace(/\s+/g, " ") !== studentSearchTerm ? (
            <p className="text-sm text-slate-500">Searching students...</p>
          ) : studentsQuery.isLoading ? (
            <p className="text-sm text-slate-500">Searching students...</p>
          ) : studentsQuery.data?.data?.length ? (
            <ul className="max-h-48 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-200">
              {studentsQuery.data.data.map((student) => (
                <li key={student.id} className="p-2">
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedStudents[student.id])}
                      onChange={() => toggleStudent(student)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>
                      {student.name}
                      {student.grade ? ` · ${student.grade}` : ""}
                      {student.academicYear
                        ? ` · ${student.academicYear}`
                        : ""}
                      {student.admissionNo
                        ? ` · Admission ${student.admissionNo}`
                        : ""}
                      {student.email ? ` · ${student.email}` : ""}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              No active students matched this search.
            </p>
          )}
        </section>
      </form>
    </Modal>
  );
}
