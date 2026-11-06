import { useState } from "react";
import Modal from "@shared/components/AttendanceModal";
import {
  useImportStudents,
  usePreviewStudentImport,
} from "../hooks/useStudents";
import { downloadStudentTemplate } from "../api/studentsApi";
import { getApiError } from "../utils/studentForm";

const statusClass = {
  valid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  invalid: "bg-rose-50 text-rose-700 border-rose-200",
  duplicate: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function ImportStudentsModal({ isOpen, onClose, onImported }) {
  const previewImport = usePreviewStudentImport();
  const commitImport = useImportStudents();
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const reset = () => {
    setFile(null);
    setSummary(null);
    setError("");
    previewImport.reset();
    commitImport.reset();
  };

  const handleClose = () => {
    if (previewImport.isPending || commitImport.isPending) return;
    reset();
    onClose();
  };

  const handleFile = (event) => {
    const nextFile = event.target.files?.[0] || null;
    setFile(nextFile);
    setSummary(null);
    setError("");
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError("");
      await downloadStudentTemplate();
    } catch (downloadError) {
      setError(getApiError(downloadError));
    } finally {
      setDownloading(false);
    }
  };

  const handlePreview = async () => {
    if (!file) {
      setError("Choose an .xlsx file.");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setError("Save the workbook as .xlsx before uploading.");
      return;
    }
    try {
      setError("");
      const result = await previewImport.mutateAsync(file);
      setSummary(result);
    } catch (previewError) {
      setSummary(null);
      setError(getApiError(previewError));
    }
  };

  const handleConfirm = async () => {
    if (!file || !summary?.validRows) return;
    try {
      setError("");
      const result = await commitImport.mutateAsync(file);
      setSummary(result);
      if (result.imported > 0) onImported(result.message);
    } catch (importError) {
      setError(getApiError(importError));
    }
  };

  const busy = previewImport.isPending || commitImport.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import students"
      subtitle="Valid rows are saved after you confirm. Invalid rows and duplicates are reported and are not saved."
      maxWidth="max-w-4xl"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={busy}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            {summary?.persisted ? "Close" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy || !summary?.validRows || summary?.persisted}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {commitImport.isPending ? "Importing..." : "Confirm import"}
          </button>
        </div>
      }
    >
      <div className="space-y-4 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {downloading ? "Downloading..." : "Download template"}
          </button>
          <p className="text-xs text-slate-500">
            .xlsx only, up to 100 students and 2 MB. Class grade, section, and academic year must already exist.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFile}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700"
          />
          <button
            type="button"
            onClick={handlePreview}
            disabled={busy || !file}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {previewImport.isPending ? "Checking..." : "Preview"}
          </button>
        </div>

        {error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {summary ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-700">{summary.message}</p>
            <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
              <SummaryStat label="Rows" value={summary.totalRows} />
              <SummaryStat label="Valid" value={summary.validRows} />
              <SummaryStat label="Invalid" value={summary.failed} />
              <SummaryStat label="Duplicates" value={summary.skippedDuplicates} />
            </div>
            <div className="max-h-72 overflow-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Row</th>
                    <th className="px-3 py-2">Student</th>
                    <th className="px-3 py-2">Class</th>
                    <th className="px-3 py-2">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {summary.preview.map((row) => (
                    <tr key={row.row}>
                      <td className="px-3 py-2 text-slate-500">{row.row}</td>
                      <td className="px-3 py-2">
                        <p className="font-medium text-slate-800">
                          {row.firstName} {row.lastName}
                        </p>
                        <p className="text-xs text-slate-500">{row.email}</p>
                      </td>
                      <td className="px-3 py-2 text-slate-600">{row.classLabel}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${statusClass[row.status]}`}>
                          {row.status}
                        </span>
                        {row.messages?.length ? (
                          <p className="mt-1 text-xs text-slate-500">{row.messages.join(" ")}</p>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

function SummaryStat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-800">{value}</p>
    </div>
  );
}
