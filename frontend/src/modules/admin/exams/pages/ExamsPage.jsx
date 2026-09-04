import { useState } from "react";
import ExamStatCards from "../cards/ExamStatCards";
import ExamsTable from "../components/ExamsTable";
import CreateExamModal from "../components/CreateExamModal";
import {
  useExamStats,
  useExams,
  usePublishExam,
  useArchiveExam,
  useDeleteExam,
  useCreateExam
} from "../hooks/useExams";
import { Plus } from "lucide-react";


const ExamsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    year: "All Years",
    term: "All Terms",
    type: "All Types",
    status: "All Statuss",
    sortField: "name",
    sortOrder: "asc",
  });

  const { data: stats, isLoading: isStatsLoading } = useExamStats();
  const { data: examsData, isLoading: isExamsLoading } = useExams(filters);

  const publishMutation = usePublishExam();
  const archiveMutation = useArchiveExam();
  const deleteMutation = useDeleteExam();

  // Action handlers ready to open modals
  const handleViewDetails = (exam) => {
    setSelectedExam(exam);
    setIsDetailsModalOpen(true);
  };

  const handleEditExam = (exam) => {
    console.log("Edit Exam:", exam);
  };

  const handlePublishExam = (exam) => {
    publishMutation.mutate(exam.id);
  };

  const handleArchiveExam = (exam) => {
    archiveMutation.mutate(exam.id);
  };

  const handleDeleteExam = (exam) => {
    if (confirm(`Are you sure you want to delete ${exam.name}?`)) {
      deleteMutation.mutate(exam.id);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Examinations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Plan, schedule, and manage all examinations across academic terms.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Examination
        </button>
      </div>

      {/* Metrics Cards */}
      <ExamStatCards stats={stats} isLoading={isStatsLoading} />

      <ExamsTable
        exams={examsData?.items || []}
        totalCount={examsData?.total || 0}
        isLoading={isExamsLoading}
        filters={filters}
        onFilterChange={setFilters}
        onViewDetails={handleViewDetails}
        onEditExam={handleEditExam}
        onPublishExam={handlePublishExam}
        onArchiveExam={handleArchiveExam}
        onDeleteExam={handleDeleteExam}
      />
      <CreateExamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default ExamsPage;
