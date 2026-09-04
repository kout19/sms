import React, { useState } from "react";
import { X } from "lucide-react";
import { useCreateExam } from "../hooks/useExams";

const CLASS_OPTIONS = [
  "Grade 10A",
  "Grade 10B",
  "Grade 11A",
  "Grade 11B",
  "Grade 12A",
  "Grade 12B",
];

const CreateExamModal = ({ isOpen, onClose }) => {
  const createExamMutation = useCreateExam();
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "Midterm",
    year: "2026-2027",
    term: "Term 1",
    time: "",
    date: "",
    endDate: "",
    duration: "",
    venue: "",
    invigilator: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleClass = (className) => {
    setSelectedClasses((prev) =>
      prev.includes(className)
        ? prev.filter((c) => c !== className)
        : [...prev, className],
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createExamMutation.mutate(
      {
        ...formData,
        classes: selectedClasses,
        extraClassesCount:
          selectedClasses.length > 2 ? selectedClasses.length - 2 : 0,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-500/20 backdrop-blur-md p-4 sm:p-6 transition-all duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header (Sticky) */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Create New Examination
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Schedule a new examination for the academic year.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto flex-1 p-6 space-y-5"
        >
          {/* Exam Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Examination Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Midterm Mathematics Examination"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Grid: Type & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Exam Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
              >
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
                <option value="Quiz">Quiz</option>
                <option value="Mock">Mock</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Academic Year
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
              >
                <option value="2026-2027">2026–2027</option>
                <option value="2025-2026">2025–2026</option>
              </select>
            </div>
          </div>

          {/* Grid: Term & Start Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Term
              </label>
              <select
                name="term"
                value={formData.term}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
              >
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          {/* Grid: Start Date & End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="w-full sm:w-[calc(50%-10px)]">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 2h 30m"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Venue */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Venue <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="venue"
              required
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g. Hall A, Room 204"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Invigilator */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Invigilator
            </label>
            <input
              type="text"
              name="invigilator"
              value={formData.invigilator}
              onChange={handleChange}
              placeholder="e.g. Ms. Sarah Johnson"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Classes / Sections */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Classes / Sections <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CLASS_OPTIONS.map((cls) => {
                const isSelected = selectedClasses.includes(cls);
                return (
                  <button
                    type="button"
                    key={cls}
                    onClick={() => toggleClass(cls)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cls}
                  </button>
                );
              })}
            </div>
            {selectedClasses.length === 0 && (
              <p className="text-[10px] text-rose-500 mt-1.5">
                Please select at least one class.
              </p>
            )}
          </div>
        </form>

        {/* Footer (Sticky) */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              createExamMutation.isPending ||
              !formData.name ||
              !formData.date ||
              selectedClasses.length === 0
            }
            className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs disabled:opacity-50"
          >
            {createExamMutation.isPending
              ? "Creating..."
              : "Create Examination"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateExamModal;
