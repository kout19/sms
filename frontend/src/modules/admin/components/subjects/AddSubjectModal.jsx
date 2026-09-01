import { useState } from "react";
import { X } from "lucide-react";
import { useCreateSubject } from "../../hooks/useSubjects";

const AddSubjectModal = ({ isOpen, onClose }) => {
  const createSubjectMutation = useCreateSubject();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    hoursPerWeek: "3",
    department: "Sciences",
    grade: "Grade 10",
    teacherName: "",
    status: "Active",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate initials for teacher avatar
    const nameParts = formData.teacherName.trim().split(" ");
    const initials =
      nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : nameParts[0]
        ? nameParts[0][0].toUpperCase()
        : "NA";

    const payload = {
      name: formData.name,
      code: formData.code,
      department: formData.department,
      grade: formData.grade,
      hoursPerWeek: formData.hoursPerWeek,
      status: formData.status,
      teacher: {
        name: formData.teacherName || "Unassigned",
        initials,
      },
    };

    createSubjectMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
        setFormData({
          name: "",
          code: "",
          hoursPerWeek: "3",
          department: "Sciences",
          grade: "Grade 10",
          teacherName: "",
          status: "Active",
        });
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add New Subject</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Fill in the details to create a new subject.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Subject Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Subject Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Advanced Mathematics"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Subject Code & Hours/Week */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Subject Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                required
                placeholder="e.g. MATH301"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Hours / Week
              </label>
              <input
                type="number"
                name="hoursPerWeek"
                value={formData.hoursPerWeek}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          {/* Department & Grade / Class */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
              >
                <option value="Sciences">Sciences</option>
                <option value="Technology">Technology</option>
                <option value="Humanities">Humanities</option>
                <option value="Languages">Languages</option>
                <option value="Arts">Arts</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Grade / Class
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
              >
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
          </div>

          {/* Assigned Teacher */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Assigned Teacher <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="teacherName"
              required
              placeholder="e.g. Mr. James Wilson"
              value={formData.teacherName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Status Radio Options */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Status
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === "Active"}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                Active
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={formData.status === "Inactive"}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                Inactive
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSubjectMutation.isPending}
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