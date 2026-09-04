import { useState, useEffect } from "react";
import { X, UserCheck } from "lucide-react";
import { useUpdateSubject } from "../../subjects/hooks/useSubjects";

const TEACHER_OPTIONS = [
  { id: "1", name: "Mr. Michael Brown", department: "Sciences" },
  { id: "2", name: "Ms. Rachel Green", department: "Arts" },
  { id: "3", name: "Mr. James Wilson", department: "Technology" },
  { id: "4", name: "Mrs. Sarah Jenkins", department: "Humanities" },
  { id: "5", name: "Dr. Alan Turing", department: "Sciences" },
];

const AssignTeacherModal = ({ isOpen, onClose, subject }) => {
  const updateSubjectMutation = useUpdateSubject();
  const [selectedTeacher, setSelectedTeacher] = useState("");

  useEffect(() => {
    if (subject?.teacher?.name) {
      setSelectedTeacher(subject.teacher.name);
    }
  }, [subject]);

  if (!isOpen || !subject) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameParts = selectedTeacher.trim().split(" ");
    const initials =
      nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : nameParts[0]
          ? nameParts[0][0].toUpperCase()
          : "NA";

    const payload = {
      id: subject.id,
      teacher: {
        name: selectedTeacher,
        initials,
      },
    };

    updateSubjectMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-500/20 backdrop-blur-md p-4 transition-all duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Assign Teacher
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update instructor for{" "}
                <span className="font-semibold text-slate-700">
                  {subject.name}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700">
              Select Instructor <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
            >
              <option value="" disabled>
                Select a teacher...
              </option>
              {TEACHER_OPTIONS.map((teacher) => (
                <option key={teacher.id} value={teacher.name}>
                  {teacher.name} ({teacher.department})
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
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
              disabled={updateSubjectMutation.isPending || !selectedTeacher}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs disabled:opacity-50"
            >
              {updateSubjectMutation.isPending
                ? "Assigning..."
                : "Assign Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTeacherModal;
