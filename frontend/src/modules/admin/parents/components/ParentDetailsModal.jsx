import { Mail, Phone, Users } from "lucide-react";
import Modal from "../../../../shared/components/AttendanceModal";
import { useParent } from "../hooks/useParents";
import { getApiError } from "../utils/parentForm";

export default function ParentDetailsModal({ parentId, isOpen, onClose }) {
  const parentQuery = useParent(parentId, isOpen);
  const parent = parentQuery.data;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Parent profile"
      subtitle="Parent account and linked student information."
      maxWidth="max-w-2xl"
    >
      {parentQuery.isLoading ? (
        <p className="p-6 text-sm text-slate-500">Loading parent profile...</p>
      ) : parentQuery.isError ? (
        <p role="alert" className="p-6 text-sm text-rose-600">
          {getApiError(parentQuery.error)}
        </p>
      ) : parent ? (
        <div className="space-y-5 p-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {parent.firstName} {parent.lastName}
            </h3>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                parent.isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {parent.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <Mail aria-hidden="true" className="h-4 w-4 text-slate-400" />
              {parent.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone aria-hidden="true" className="h-4 w-4 text-slate-400" />
              {parent.phone || "No phone number"}
            </p>
          </div>
          <section aria-labelledby="parent-children-heading">
            <h4
              id="parent-children-heading"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800"
            >
              <Users aria-hidden="true" className="h-4 w-4" />
              Linked students ({parent.children.length})
            </h4>
            {parent.children.length ? (
              <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                {parent.children.map((child) => (
                  <li
                    key={child.id}
                    className="flex flex-wrap justify-between gap-2 p-3 text-sm"
                  >
                    <span className="font-medium text-slate-700">
                      {child.name}
                    </span>
                    <span className="text-slate-500">
                      {child.grade}
                      {child.academicYear ? ` · ${child.academicYear}` : ""}
                      {` · ${child.relationship}`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                No students are linked to this account.
              </p>
            )}
          </section>
          <p className="text-xs text-slate-400">
            Registered{" "}
            {new Date(parent.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      ) : null}
    </Modal>
  );
}
