import { useState } from "react";
import { X } from "lucide-react";
import { useCreateSubject, useSubjectOptions } from "../hooks/useSubjects";
import SubjectFormFields from "./SubjectFormFields";

const INITIAL_FORM_DATA = {
  name: "",
  code: "",
  description: "",
  academicYear: "",
  departmentId: "",
  classIds: [],
  teacherProfileIds: [],
  isActive: true,
};

const AddSubjectModal = ({ isOpen, onClose }) => {
  const createSubjectMutation = useCreateSubject();
  const optionsQuery = useSubjectOptions();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  if (!isOpen) return null;

  const handleChange = ({ name, value }) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createSubjectMutation.mutate(
      {
        ...formData,
        departmentId: formData.departmentId || null,
        description: formData.description || null,
        academicYear: formData.academicYear || null,
      },
      {
        onSuccess: () => {
          onClose();
          setFormData(INITIAL_FORM_DATA);
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add New Subject</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Set the subject's academic context and assignments.
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
          {createSubjectMutation.isError && (
            <p className="text-sm text-rose-600" role="alert">
              {createSubjectMutation.error.message}
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
                createSubjectMutation.isPending ||
                optionsQuery.isLoading ||
                optionsQuery.isError
              }
              className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs disabled:opacity-50"
            >
              {createSubjectMutation.isPending ? "Creating..." : "Create Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;
