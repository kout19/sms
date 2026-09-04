import React from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Users,
  UserCheck,
  Loader2,
} from "lucide-react";
import { useExamDetails } from "../../../hooks/useExams";
const TYPE_STYLES = {
  Mock: "bg-amber-50 text-amber-600 border-amber-200/60",
  Quiz: "bg-cyan-50 text-cyan-600 border-cyan-200/60",
  Monthly: "bg-purple-50 text-purple-600 border-purple-200/60",
  Midterm: "bg-amber-50 text-amber-600 border-amber-200/60",
  Final: "bg-rose-50 text-rose-500 border-rose-200/60",
};

const STATUS_STYLES = {
  Completed: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    dot: "bg-purple-500",
  },
  Active: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  Upcoming: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  Draft: { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
};

const ExamDetailsModal = ({ isOpen, onClose, examId, initialData, onEdit }) => {
  // Query backend/mock API via Hook
  const { data: fetchedExam, isLoading, isError } = useExamDetails(examId);

  if (!isOpen) return null;

  // Use fetched API data, or fallback to initially passed row data
  const exam = fetchedExam || initialData;

  const statusStyle = STATUS_STYLES[exam?.status] || STATUS_STYLES.Draft;
  const typeStyle = TYPE_STYLES[exam?.type] || "bg-slate-100 text-slate-600";

  const details = exam
    ? [
        { label: "Start Date", value: exam.date || "N/A", icon: Calendar },
        {
          label: "End Date",
          value: exam.endDate || exam.date || "N/A",
          icon: Calendar,
        },
        { label: "Start Time", value: exam.time || "N/A", icon: Clock },
        { label: "Duration", value: exam.duration || "N/A", icon: Clock },
        { label: "Venue", value: exam.venue || "Hall A, Hall B", icon: MapPin },
        {
          label: "Term",
          value: `${exam.term || "Term 1"} · ${exam.year || "2026–2027"}`,
          icon: FileText,
        },
        { label: "Total Students", value: exam.students ?? 0, icon: Users },
        {
          label: "Invigilator",
          value: exam.invigilator || "Mr. Michael Brown",
          icon: UserCheck,
        },
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-500/20 backdrop-blur-md p-4 sm:p-6 transition-all duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-start justify-between shrink-0">
          <h2 className="text-base font-bold text-slate-900">Exam Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && !exam ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-xs font-medium">
              Fetching examination details...
            </p>
          </div>
        ) : isError && !exam ? (
          <div className="p-8 text-center text-xs text-rose-500 font-medium">
            Failed to load examination details. Please try again.
          </div>
        ) : (
          /* Scrollable Content */
          <div className="overflow-y-auto flex-1 px-6 pb-6 space-y-6">
            {/* Title & Status Badges */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                {exam.name}
              </h1>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${typeStyle}`}
                >
                  {exam.type}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                  />
                  {exam.status}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {details.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100/60 space-y-1"
                  >
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                      <IconComponent className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {item.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Classes / Sections */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-500">
                Classes / Sections
              </h3>
              <div className="flex flex-wrap gap-2">
                {(
                  exam.classes || [
                    "Grade 10A",
                    "Grade 10B",
                    "Grade 11A",
                    "Grade 11B",
                  ]
                ).map((cls, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-50/60 text-indigo-600 border border-indigo-100 rounded-full text-xs font-semibold"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>

            {/* Subjects */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-500">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {(exam.subjects || ["Biology", "Chemistry", "Physics"]).map(
                  (subject, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold"
                    >
                      {subject}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30 shrink-0">
          <button
            onClick={() => {
              onClose();
              if (onEdit) onEdit(exam);
            }}
            disabled={!exam}
            className="w-1/2 max-w-[200px] py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-colors text-center disabled:opacity-50"
          >
            Edit Exam
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailsModal;
