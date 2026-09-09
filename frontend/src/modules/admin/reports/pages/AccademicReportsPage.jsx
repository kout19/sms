import { useState } from "react";
import {Download } from "lucide-react";
import ReportFilterBar from "../components/ReportFilterBar";
import ReportSummaryCards from "../cards/ReportSummaryCards";
import ScoreTrendChart from "../components/ScoreTrendChart";
import PassFailDistributionCard from "../cards/PassFailDistributionCard";
import SubjectPerformanceChart from "../components/SubjectPerformanceChart";
import GradePerformanceChart from "../components/GradePerformanceChart";
import StudentScoreList from "../components/StudentScoreList";
import {
  useTopPerformers,
  useAtRiskStudents,
} from "../hooks/useAcademicReports";
import DetailedRecordsTable from "../components/DetailedRecordsTable";

const DEFAULT_FILTERS = { year: "2026-2027", term: "all", grade: "all" };

export default function AcademicReportsPage() {
  const [pendingFilters, setPendingFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  const handleApply = () => setAppliedFilters(pendingFilters);
  const handleReset = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS); // Reset takes effect immediately, unlike Apply
  };

  const { data: topPerformers = [] } = useTopPerformers(appliedFilters);
  const { data: atRiskStudents = [] } = useAtRiskStudents(appliedFilters);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold ">Accademic Performance Report</h1>
          <p className="text-sm text-slate-500">
            Student grades, subject analysis, and performance trends for each
            term
          </p>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-lg flex items-center gap-2 px-4 py-2  cursor-pointer">
          <Download className="w-5 h-5" />
          <span> Export Report</span>
        </div>
      </div>

      <ReportFilterBar
        pendingFilters={pendingFilters}
        onChange={setPendingFilters}
        onApply={handleApply}
        onReset={handleReset}
      />

      <ReportSummaryCards filters={appliedFilters} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreTrendChart filters={appliedFilters} />
        <PassFailDistributionCard filters={appliedFilters} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectPerformanceChart filters={appliedFilters} />
        <GradePerformanceChart filters={appliedFilters} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudentScoreList
          title="Top Performing Students"
          dotColor="bg-emerald-500"
          badgeText={`${topPerformers.length} students`}
          badgeBg="bg-emerald-50"
          badgeTextColor="text-emerald-700"
          columnLabel="Class"
          rows={topPerformers.map((s) => ({
            id: s.id,
            name: s.name,
            secondaryLabel: s.className,
            score: s.score,
            gradeBadge: s.grade,
          }))}
          scoreColor="text-emerald-600"
          showGradeBadge
        />
        <StudentScoreList
          title="At-Risk Students"
          dotColor="bg-rose-500"
          badgeText={`${atRiskStudents.length} need attention`}
          badgeBg="bg-rose-50"
          badgeTextColor="text-rose-700"
          cardBorderColor="border-rose-100"
          columnLabel="Subject"
          rows={atRiskStudents.map((s) => ({
            id: s.id,
            name: s.name,
            secondaryLabel: s.subject,
            score: s.score,
          }))}
          scoreColor="text-rose-600"
        />
      </div>
      <div>
        <DetailedRecordsTable filters={appliedFilters} />
      </div>
    </div>
  );
}
