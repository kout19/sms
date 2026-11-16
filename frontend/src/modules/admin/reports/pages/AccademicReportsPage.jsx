import { useState } from "react";
import { AlertTriangle, Download } from "lucide-react";
import ReportFilterBar from "../../shared/components/ReportFilterBar";
import DashboardHeader from "../../shared/components/DashboardHeader";
import { useAcademicOverview } from "../hooks/useAcademicReports";

const DEFAULT_FILTERS = { year: "2026-2027", term: "all", grade: "all" };
const academicFilters = [
  {
    name: "year",
    type: "select",
    options: [
      { value: "2026-2027", label: "2026-2027" },
      { value: "2025-2026", label: "2025-2026" },
    ],
  },
  {
    name: "term",
    type: "select",
    options: [
      { value: "all", label: "All Terms" },
      { value: "term1", label: "Term 1" },
      { value: "term2", label: "Term 2" },
    ],
  },
  {
    name: "grade",
    type: "select",
    options: [
      { value: "all", label: "All Grades" },
      { value: "G10", label: "Grade 10" },
      { value: "G11", label: "Grade 11" },
      { value: "G12", label: "Grade 12" },
    ],
  },
];

export default function AcademicReportsPage() {
  const [pendingFilters, setPendingFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  const handleApply = () => setAppliedFilters(pendingFilters);
  const handleReset = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const { data: overview = {} } = useAcademicOverview(appliedFilters);
  const unavailable = overview.supported === false || overview.missingData;

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Academic Performance Report"
        subtitle="Academic-year, section, subject, and exam report data integrity checks"
        icon={Download}
        accent="white"
      />

      <ReportFilterBar
        pendingFilters={pendingFilters}
        onChange={setPendingFilters}
        onApply={handleApply}
        onReset={handleReset}
        filters={academicFilters}
      />

      {unavailable ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-6 w-6 text-amber-600" />
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold">Academic reporting is not yet available for this school</h2>
                <p className="mt-1 text-sm text-amber-800">
                  {overview.reason || "The current schema has exam metadata but no student result table, assessment records, or grading scale to calculate academic statistics."}
                </p>
              </div>

              <div className="text-sm text-amber-800">
                <p className="font-medium">Available data currently in scope:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>{overview.summary?.totalAcademicYears ?? 0} active academic year(s)</li>
                  <li>{overview.summary?.totalSections ?? 0} active section(s)</li>
                  <li>{overview.summary?.totalSubjects ?? 0} active subject(s)</li>
                  <li>{overview.summary?.totalExams ?? 0} exam record(s)</li>
                  <li>{overview.summary?.totalStudents ?? 0} student profile(s)</li>
                </ul>
              </div>

              {Array.isArray(overview.requiredModels) && overview.requiredModels.length > 0 ? (
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Missing academic data dependency:</p>
                  <p className="mt-1">
                    {overview.requiredModels.join(", ")}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
          Academic data is available. The report modules will render once the underlying academic result tables are added.
        </div>
      )}
    </div>
  );
}
