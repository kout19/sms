import { useState } from "react";
import SubjectStatCards from "../cards/SubjectStatCards";
import SubjectsTable from "../components/SubjectTable";
import { useSubjects } from "../hooks/useSubjects";
import AddSubjectModal from "../components/AddSubjectModal";
import { Plus } from "lucide-react";

const SubjectsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    department: "All",
    grade: "All",
    status: "All",
  });

  // Data fetching handled entirely via TanStack Query Hook
  const { data, isLoading, error } = useSubjects(filters);

  if (error) {
    return (
      <div className="p-6 text-rose-600 bg-rose-50 rounded-lg">
        Failed to load subjects data.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full p-6 space-y-6">
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Subject Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage academic subjects, departments, and teacher assignments.
          </p>
        </div>
        <div className=" ">
          <button
            className="bg-indigo-600 flex items-center  text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Top Cards powered by server response stats */}
      <SubjectStatCards data={data?.stats} isLoading={isLoading} />

      {/* Interactive Table with mutations */}
      <SubjectsTable
        subjects={data?.items || []}
        totalCount={data?.total || 0}
        isLoading={isLoading}
        filters={filters}
        onFilterChange={setFilters}
      />
      <AddSubjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default SubjectsPage;
