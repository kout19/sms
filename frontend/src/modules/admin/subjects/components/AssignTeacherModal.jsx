import { useState } from "react";
import { X, UserCheck } from "lucide-react";
import {
  useSubjectOptions,
  useUpdateSubject,
} from "../../subjects/hooks/useSubjects";

const AssignTeacherModal = ({ isOpen, onClose, subject }) => {
  const updateSubjectMutation = useUpdateSubject();
  const optionsQuery = useSubjectOptions();
  const [teacherProfileIds, setTeacherProfileIds] = useState(() =>
    (subject?.teachers || []).map((teacher) => teacher.id),
  );

  if (!isOpen || !subject) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    updateSubjectMutation.mutate(
      { id: subject.id, teacherProfileIds },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-500/20 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Assign Teachers
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Assign teachers to {subject.name}.
              </p>
            </div>
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

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {optionsQuery.isLoading && (
            <p className="text-sm text-slate-500">Loading teachers...</p>
          )}
          {optionsQuery.isError && (
            <p className="text-sm text-rose-600" role="alert">
              Could not load school teachers. {optionsQuery.error.message}
            </p>
          )}
          {updateSubjectMutation.isError && (
            <p className="text-sm text-rose-600" role="alert">
              {updateSubjectMutation.error.message}
            </p>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Teachers
            </label>
            <select
              className="w-full min-h-28 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
              multiple
              value={teacherProfileIds}
              onChange={(event) =>
                setTeacherProfileIds(
                  Array.from(event.target.selectedOptions, (option) => option.value),
                )
              }
            >
              {(optionsQuery.data?.teachers || []).map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.fullName}
                  {teacher.isActive ? "" : " (Inactive)"}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              Use Ctrl or Command to select multiple teachers.
            </p>
          </div>
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
              {updateSubjectMutation.isPending ? "Assigning..." : "Save Teachers"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTeacherModal;
