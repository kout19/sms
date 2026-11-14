import { useState } from "react";
import SubjectStatCards from "../cards/SubjectStatCards";
import SubjectsTable from "../components/SubjectTable";
import { useSubjectOptions, useSubjects } from "../hooks/useSubjects";
import AddSubjectModal from "../components/AddSubjectModal";
import { Plus } from "lucide-react";

const SubjectsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    departmentId: "All",
    academicYear: "All",
    status: "All",
    page: 1,
    limit: 20,
  });

  // Data fetching handled entirely via TanStack Query Hook
  const { data, isLoading, error } = useSubjects(filters);
  const { data: options, error: optionsError } = useSubjectOptions();

  if (error) {
    return (
      <div className="p-6 text-rose-600 bg-rose-50 rounded-lg">
        Failed to load subjects data. {error.message}
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

      {optionsError && (
        <p className="p-4 text-rose-600 bg-rose-50 rounded-lg" role="alert">
          Failed to load subject filter options. {optionsError.message}
        </p>
      )}

      {/* Top Cards powered by server response stats */}
      <SubjectStatCards data={data?.stats} isLoading={isLoading} />

      {/* Interactive Table with mutations */}
      <SubjectsTable
        subjects={data?.items || []}
        totalCount={data?.total || 0}
        totalPages={data?.totalPages || 1}
        isLoading={isLoading}
        filters={filters}
        departments={options?.departments || []}
        academicYears={[
          ...new Set((options?.classes || []).map((item) => item.academicYear)),
        ]}
        onFilterChange={(nextFilters) =>
          setFilters({ ...nextFilters, page: 1 })
        }
        onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
      />
      <AddSubjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default SubjectsPage;
