import { useState } from "react";
import { Download } from "lucide-react";
import ReportFilterBar from "../../shared/components/ReportFilterBar";
import ReportSummaryCards from "../cards/academic-reports/AcademicReportSummaryCards";
import ScoreTrendChart from "../components/ScoreTrendChart";
import PassFailDistributionCard from "../cards/academic-reports/PassFailDistributionCard";
import SubjectPerformanceChart from "../components/SubjectPerformanceChart";
import GradePerformanceChart from "../components/GradePerformanceChart";
import StudentScoreList from "../components/StudentScoreList";
import DashboardHeader from "../../shared/components/DashboardHeader";
import {
  useTopPerformers,
  useAtRiskStudents,
} from "../hooks/useAcademicReports";
import DetailedRecordsTable from "../components/academic-reports/DetailedRecordsTable";

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
    setAppliedFilters(DEFAULT_FILTERS); // Reset takes effect immediately, unlike Apply
  };

  const { data: topPerformers = [] } = useTopPerformers(appliedFilters);
  const { data: atRiskStudents = [] } = useAtRiskStudents(appliedFilters);

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Academic Performance Report"
        subtitle="Student grades, subject analysis, and performance trends for each term"
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
