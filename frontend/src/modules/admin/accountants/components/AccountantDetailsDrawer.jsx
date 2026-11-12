import SlideOver from "../../../../shared/components/SlideOver";
import StatusBadge from "../../../../shared/components/StatusBadge";
import { useAccountant } from "../hooks/useAccountants";
import { getApiError } from "../utils/accountantForm";

const Row = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-sm text-slate-800">{value || "—"}</p>
  </div>
);

const formatDate = (value) => {
  if (!value) return "Never";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
};

export default function AccountantDetailsDrawer({
  accountantId,
  isOpen,
  onClose,
}) {
  const accountantQuery = useAccountant(accountantId, isOpen);
  const accountant = accountantQuery.data;

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Accountant details"
      subtitle="Account details for this school"
      width="max-w-md"
    >
      {accountantQuery.isLoading ? (
        <p className="text-sm text-slate-500">Loading accountant...</p>
      ) : null}
      {accountantQuery.isError ? (
        <p role="alert" className="text-sm text-rose-600">
          {getApiError(accountantQuery.error)}
        </p>
      ) : null}
      {accountant ? (
        <div className="space-y-4">
          <Row
            label="Name"
            value={`${accountant.firstName} ${accountant.lastName}`}
          />
          <Row label="Email" value={accountant.email} />
          <Row label="Phone" value={accountant.phone} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Status
            </p>
            <div className="mt-1">
              <StatusBadge isActive={accountant.isActive} />
            </div>
          </div>
          <Row label="Last active" value={formatDate(accountant.lastLogin)} />
          <Row label="Created" value={formatDate(accountant.createdAt)} />
        </div>
      ) : null}
    </SlideOver>
  );
}
