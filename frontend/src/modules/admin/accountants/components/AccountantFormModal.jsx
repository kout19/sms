import { useState } from "react";
import Modal from "../../../../shared/components/AttendanceModal";
import {
  useAccountant,
  useCreateAccountant,
  useUpdateAccountant,
} from "../hooks/useAccountants";
import {
  accountantToForm,
  emptyAccountantForm,
  getApiError,
  toAccountantPayload,
  validateAccountantForm,
} from "../utils/accountantForm";

const inputClass =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

const Field = ({ label, error, children }) => (
  <label className="block text-sm">
    <span className="font-medium text-slate-700">{label}</span>
    <div className="mt-1">{children}</div>
    {error ? (
      <span className="mt-1 block text-xs text-rose-600">{error}</span>
    ) : null}
  </label>
);

function AccountantForm({
  mode,
  accountant,
  onClose,
  onSaved,
  embedded = false,
}) {
  const isEdit = mode === "edit";
  const createAccountant = useCreateAccountant();
  const updateAccountant = useUpdateAccountant();
  const [form, setForm] = useState(() =>
    isEdit ? accountantToForm(accountant) : emptyAccountantForm,
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const isSaving = createAccountant.isPending || updateAccountant.isPending;

  const setField = (name, value) =>
    setForm((current) => ({ ...current, [name]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateAccountantForm(form, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const payload = toAccountantPayload(form, mode);
      if (isEdit) {
        await updateAccountant.mutateAsync({ id: accountant.id, payload });
        onSaved("Accountant details updated.");
      } else {
        await createAccountant.mutateAsync(payload);
        onSaved("Accountant account created.");
      }
      if (!embedded) onClose();
    } catch (error) {
      setFormError(getApiError(error));
    }
  };

  const actions = (
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
        form="accountant-form"
        disabled={isSaving}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSaving ? "Saving..." : isEdit ? "Save changes" : "Add accountant"}
      </button>
    </div>
  );
  const formContent = (
    <form
        id="accountant-form"
        onSubmit={handleSubmit}
        className="grid gap-4 p-6 sm:grid-cols-2"
      >
        {formError ? (
          <p
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 sm:col-span-2"
          >
            {formError}
          </p>
        ) : null}
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
        <Field
          label={isEdit ? "Reset password (optional)" : "Temporary password"}
          error={errors.password}
        >
          <input
            type="password"
            autoComplete="new-password"
            required={!isEdit}
            minLength={8}
            maxLength={72}
            className={inputClass}
            value={form.password}
            onChange={(event) => setField("password", event.target.value)}
            placeholder={
              isEdit ? "Leave blank to keep the current password" : ""
            }
          />
        </Field>
    </form>
  );

  if (embedded) {
    return (
      <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-6 py-5">
          <h1 className="text-xl font-semibold text-slate-900">Add accountant</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create a school-scoped accountant login. The password is stored as a hash.
          </p>
        </header>
        {formContent}
        <div className="border-t border-slate-100 px-6 py-4">{actions}</div>
      </section>
    );
  }

  return (
    <Modal
      isOpen
      onClose={isSaving ? () => {} : onClose}
      title={isEdit ? "Edit accountant" : "Add accountant"}
      subtitle={
        isEdit
          ? "Update this school accountant's account details."
          : "Create a school-scoped accountant login. The password is stored as a hash."
      }
      maxWidth="max-w-2xl"
      footer={actions}
    >
      {formContent}
    </Modal>
  );
}

export default function AccountantFormModal({
  mode,
  accountantId,
  isOpen,
  onClose,
  onSaved,
  embedded = false,
}) {
  const isEdit = mode === "edit";
  const accountantQuery = useAccountant(accountantId, isOpen && isEdit);

  if (!isOpen) return null;

  if (isEdit && accountantQuery.isPending) {
    return (
      <Modal
        isOpen
        onClose={onClose}
        title="Edit accountant"
        subtitle="Account details for this school"
      >
        <p className="p-6 text-sm text-slate-500">Loading accountant...</p>
      </Modal>
    );
  }

  if (isEdit && accountantQuery.isError) {
    return (
      <Modal
        isOpen
        onClose={onClose}
        title="Edit accountant"
        subtitle="Account details for this school"
      >
        <p role="alert" className="p-6 text-sm text-rose-600">
          {getApiError(accountantQuery.error)}
        </p>
      </Modal>
    );
  }

  if (isEdit && !accountantQuery.data) return null;

  return (
    <AccountantForm
      key={isEdit ? accountantId : "create"}
      mode={mode}
      accountant={accountantQuery.data}
      onClose={onClose}
      onSaved={onSaved}
      embedded={embedded}
    />
  );
}
