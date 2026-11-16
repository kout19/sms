import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Power,
  PowerOff,
} from "lucide-react";
import Modal from "@shared/components/AttendanceModal";
import SectionFormModal from "../components/SectionFormModal";
import {
  useClass,
  useUpdateClassStatus,
  useUpdateSectionStatus,
} from "../hooks/useClasses";

const getApiError = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong.";

export default function ClassDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const classQuery = useClass(id);
  const updateClassStatus = useUpdateClassStatus();
  const updateSectionStatus = useUpdateSectionStatus();
  const [sectionId, setSectionId] = useState(null);
  const [sectionFormOpen, setSectionFormOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const classRecord = classQuery.data;
  const sections = classRecord?.sections || [];

  const closeSectionForm = () => {
    setSectionFormOpen(false);
    setSectionId(null);
  };

  const confirmStatus = async () => {
    if (!statusTarget) return;
    try {
      setError("");
      if (statusTarget.type === "class") {
        await updateClassStatus.mutateAsync({
          id: statusTarget.record.id,
          isActive: !statusTarget.record.isActive,
        });
        setNotice(`Class ${statusTarget.record.isActive ? "deactivated" : "activated"}.`);
      } else {
        await updateSectionStatus.mutateAsync({
          id: statusTarget.record.id,
          isActive: !statusTarget.record.isActive,
        });
        setNotice(`Section ${statusTarget.record.name} was ${statusTarget.record.isActive ? "deactivated" : "activated"}.`);
      }
      setStatusTarget(null);
    } catch (statusError) {
      setError(getApiError(statusError));
    }
  };

  if (classQuery.isLoading) {
    return <p className="p-6 text-sm text-slate-500">Loading class...</p>;
  }
  if (classQuery.isError || !classRecord) {
    return (
      <div className="p-6">
        <p role="alert" className="text-sm text-rose-700">
          {classQuery.isError ? getApiError(classQuery.error) : "Class not found."}
        </p>
        <button type="button" onClick={() => navigate("/admin/classes")} className="mt-3 text-sm font-medium text-indigo-600">
          Back to classes
        </button>
      </div>
    );
  }

  const statusPending = updateClassStatus.isPending || updateSectionStatus.isPending;

  return (
    <div className="min-h-full bg-slate-50 p-4 md:p-6">
      <button type="button" onClick={() => navigate("/admin/classes")} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600">
        <ArrowLeft size={16} /> Back to classes
      </button>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">{classRecord.name}</h1>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${classRecord.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
              {classRecord.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Class code: {classRecord.code}</p>
          {classRecord.description ? <p className="mt-2 max-w-2xl text-sm text-slate-600">{classRecord.description}</p> : null}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => navigate(`/admin/classes/${id}/edit`)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Pencil size={15} /> Edit class
          </button>
          <button type="button" onClick={() => setStatusTarget({ type: "class", record: classRecord })} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            {classRecord.isActive ? <PowerOff size={15} /> : <Power size={15} />}
            {classRecord.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </header>

      {notice ? <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{notice}</p> : null}
      {error ? <p role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          ["Sections", classRecord.sectionCount],
          ["Active students", classRecord.studentCount],
          ["Academic years", classRecord.academicYears?.join(", ") || "—"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-2 text-lg font-semibold text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-800">Sections</h2>
            <p className="mt-1 text-xs text-slate-500">Sections are specific to an academic year.</p>
          </div>
          <button type="button" onClick={() => setSectionFormOpen(true)} disabled={!classRecord.isActive} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
            <Plus size={15} /> Add section
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[740px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {["Section", "Code", "Academic year", "Students / capacity", "Room", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sections.length ? sections.map((section) => (
                <tr key={section.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4 text-sm font-medium text-slate-800">{section.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{section.code}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{section.academicYear}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{section.studentCount}{section.capacity == null ? "" : ` / ${section.capacity}`}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{section.room || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${section.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                      {section.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button type="button" title="Edit section" aria-label={`Edit ${section.name}`} onClick={() => { setSectionId(section.id); setSectionFormOpen(true); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600">
                        <Pencil size={15} />
                      </button>
                      <button type="button" title={section.isActive ? "Deactivate section" : "Activate section"} aria-label={`${section.isActive ? "Deactivate" : "Activate"} ${section.name}`} onClick={() => setStatusTarget({ type: "section", record: section })} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                        {section.isActive ? <PowerOff size={15} /> : <Power size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="px-6 py-14 text-center text-sm text-slate-500">No sections have been added for this class.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <SectionFormModal
        classId={id}
        sectionId={sectionId}
        isOpen={sectionFormOpen}
        onClose={closeSectionForm}
      />
      <Modal
        isOpen={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        title={`${statusTarget?.record.isActive ? "Deactivate" : "Activate"} ${statusTarget?.type}`}
        subtitle="Academic history and existing enrollments are preserved."
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setStatusTarget(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">Cancel</button>
            <button type="button" onClick={confirmStatus} disabled={statusPending} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
              {statusPending ? "Saving..." : "Confirm"}
            </button>
          </div>
        }
      >
        <p className="p-6 text-sm text-slate-600">
          {statusTarget?.record.isActive ? "Deactivate" : "Activate"} {statusTarget?.record.name}?
        </p>
      </Modal>
    </div>
  );
}
