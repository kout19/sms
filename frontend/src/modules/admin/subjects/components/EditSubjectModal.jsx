import { useState } from "react";
import { X } from "lucide-react";
import {
  useSubjectOptions,
  useUpdateSubject,
} from "../hooks/useSubjects";
import SubjectFormFields from "./SubjectFormFields";

const subjectToFormData = (subject) => ({
  name: subject?.name || "",
  code: subject?.code || "",
  description: subject?.description || "",
  academicYear: subject?.academicYear || "",
  departmentId: subject?.departmentId || "",
  classIds: (subject?.classes || []).map((classItem) => classItem.id),
  teacherProfileIds: (subject?.teachers || []).map((teacher) => teacher.id),
  isActive: subject?.isActive !== false,
});

const EditSubjectModal = ({ isOpen, onClose, subject }) => {
  const updateSubjectMutation = useUpdateSubject();
  const optionsQuery = useSubjectOptions();
  const [formData, setFormData] = useState(() => subjectToFormData(subject));

  if (!isOpen || !subject) return null;

  const handleChange = ({ name, value }) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateSubjectMutation.mutate(
      {
        id: subject.id,
        ...formData,
        departmentId: formData.departmentId || null,
        description: formData.description || null,
        academicYear: formData.academicYear || null,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-500/20 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit Subject</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Update subject details and academic assignments.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 pb-6 space-y-4 overflow-y-auto max-h-[calc(90vh-88px)]"
        >
          {optionsQuery.isLoading && (
            <p className="text-sm text-slate-500">Loading school options...</p>
          )}
          {optionsQuery.isError && (
            <p className="text-sm text-rose-600" role="alert">
              Could not load departments, classes, and teachers. {optionsQuery.error.message}
            </p>
          )}
          {updateSubjectMutation.isError && (
            <p className="text-sm text-rose-600" role="alert">
              {updateSubjectMutation.error.message}
            </p>
          )}
          <SubjectFormFields
            formData={formData}
            onChange={handleChange}
            options={optionsQuery.data || {
              departments: [],
              classes: [],
              teachers: [],
            }}
          />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                updateSubjectMutation.isPending ||
                optionsQuery.isLoading ||
                optionsQuery.isError
              }
              className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs disabled:opacity-50"
            >
              {updateSubjectMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubjectModal;
