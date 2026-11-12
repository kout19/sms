import { useEffect, useMemo, useState } from "react";
import Modal from "@shared/components/AttendanceModal";
import {
  useCreateDepartment,
  useDepartment,
  useDepartmentHeads,
  useUpdateDepartment,
} from "../hooks/useDepartments";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500";

const ICON_OPTIONS = [
  "book-open",
  "ruler",
  "microscope",
  "globe",
  "monitor",
  "dumbbell",
  "palette",
  "languages",
  "briefcase",
  "graduation-cap",
];

const initialForm = {
  name: "",
  code: "",
  description: "",
  icon: "book-open",
  headTeacherId: "",
  isActive: true,
};

const titleCase = (value) =>
  String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function DepartmentFormModal({
  mode,
  departmentId,
  isOpen,
  onClose,
  onSaved,
  embedded = false,
}) {
  const isEdit = mode === "edit";
  const departmentQuery = useDepartment(isOpen && isEdit ? departmentId : null);
  const headOptionsQuery = useDepartmentHeads();
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && departmentQuery.data) {
      // The form is initialized from the detail query when editing starts.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: departmentQuery.data.name || "",
        code: departmentQuery.data.code || "",
        description: departmentQuery.data.description || "",
        icon: departmentQuery.data.icon || "book-open",
        headTeacherId: departmentQuery.data.headTeacherId || "",
        isActive: departmentQuery.data.isActive !== false,
      });
      setFormError("");
      return;
    }

    setForm(initialForm);
    setFormError("");
  }, [departmentQuery.data, isEdit, isOpen]);

  const headOptions = useMemo(
    () => headOptionsQuery.data || [],
    [headOptionsQuery.data],
  );

  const isSaving = createDepartment.isPending || updateDepartment.isPending;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const code = form.code.trim();

    if (!name || !code) {
      setFormError("Department name and code are required.");
      return;
    }

    const payload = {
      name,
      code,
      description: form.description.trim(),
      icon: form.icon || "book-open",
      headTeacherId: form.headTeacherId || null,
      isActive: form.isActive,
    };

    try {
      if (isEdit) {
        await updateDepartment.mutateAsync({ id: departmentId, payload });
        onSaved("Department updated.");
      } else {
        await createDepartment.mutateAsync(payload);
        onSaved("Department created.");
      }
      if (!embedded) onClose();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to save the department.";
      setFormError(message);
    }
  };

  const actions = (
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
        form="department-form"
        disabled={isSaving || (isEdit && departmentQuery.isLoading)}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSaving
          ? "Saving..."
          : isEdit
            ? "Save changes"
            : "Add department"}
      </button>
    </div>
  );
  const formContent = (
    <form
        id="department-form"
        onSubmit={handleSubmit}
        className="grid gap-4 p-6 sm:grid-cols-2"
      >
        {departmentQuery.isLoading && isEdit ? (
          <p className="text-sm text-slate-500 sm:col-span-2">
            Loading department details...
          </p>
        ) : null}

        {formError ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 sm:col-span-2">
            {formError}
          </div>
        ) : null}

        <label className="block sm:col-span-1">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Department name
          </span>
          <input
            className={inputClass}
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Mathematics"
          />
        </label>

        <label className="block sm:col-span-1">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Department code
          </span>
          <input
            className={inputClass}
            value={form.code}
            onChange={(event) => updateField("code", event.target.value)}
            placeholder="MATH"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </span>
          <textarea
            rows={3}
            className={inputClass}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Academic discipline, focus areas, and description"
          />
        </label>

        <label className="block sm:col-span-1">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Icon
          </span>
          <select
            className={inputClass}
            value={form.icon}
            onChange={(event) => updateField("icon", event.target.value)}
          >
            {ICON_OPTIONS.map((icon) => (
              <option key={icon} value={icon}>
                {titleCase(icon)}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-1">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </span>
          <select
            className={inputClass}
            value={form.isActive ? "active" : "inactive"}
            onChange={(event) =>
              updateField("isActive", event.target.value === "active")
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Head of department
          </span>
          <select
            className={inputClass}
            value={form.headTeacherId}
            onChange={(event) =>
              updateField("headTeacherId", event.target.value)
            }
          >
            <option value="">No head assigned</option>
            {headOptions.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName} ({teacher.email})
              </option>
            ))}
          </select>
        </label>
    </form>
  );

  if (embedded) {
    return (
      <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-6 py-5">
          <h1 className="text-xl font-semibold text-slate-900">Add department</h1>
          <p className="mt-1 text-sm text-slate-500">
            Keep the department code short and stable so reporting stays consistent.
          </p>
        </header>
        {formContent}
        <div className="border-t border-slate-100 px-6 py-4">{actions}</div>
      </section>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSaving ? () => {} : onClose}
      title={isEdit ? "Edit department" : "Create department"}
      subtitle="Keep the department code short and stable so reporting stays consistent."
      maxWidth="max-w-2xl"
      footer={actions}
    >
      {formContent}
    </Modal>
  );
}
