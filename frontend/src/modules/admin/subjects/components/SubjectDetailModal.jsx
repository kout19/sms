import { X, BookOpen } from "lucide-react";

const SubjectDetailsModal = ({ isOpen, onClose, subject, onEdit }) => {
  if (!isOpen || !subject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all  duration-200">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl ring-1 ring-slate-200 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100/60">
          <h2 className="text-xl font-bold text-slate-900">Subject Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Main Title Banner */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{subject.name}</h3>
                <span className="inline-block px-2 py-0.5 mt-0.5 bg-slate-100 text-slate-500 font-mono font-medium text-[11px] rounded-md uppercase">
                  {subject.code}
                </span>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                subject.status === "Active"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  subject.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              {subject.status}
            </span>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-1">
              <p className="text-xs text-slate-400 font-medium">Department</p>
              <p className="text-sm font-bold text-slate-800">{subject.department}</p>
            </div>

            <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-1">
              <p className="text-xs text-slate-400 font-medium">Grades</p>
              <p className="text-sm font-bold text-slate-800">{subject.grade}</p>
            </div>

            <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-1">
              <p className="text-xs text-slate-400 font-medium">Academic Year</p>
              <p className="text-sm font-bold text-slate-800">
                {subject.academicYear || "Not specified"}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-1">
              <p className="text-xs text-slate-400 font-medium">Classes Offered</p>
              <p className="text-sm font-bold text-slate-800">{subject.classCount ?? 0}</p>
            </div>

            <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-1 col-span-2">
              <p className="text-xs text-slate-400 font-medium">Created</p>
              <p className="text-sm font-bold text-slate-800">
                {subject.createdAt
                  ? new Date(subject.createdAt).toLocaleDateString()
                  : "Unavailable"}
              </p>
            </div>
          </div>

          {/* Teacher Card */}
          <div className="p-4 border border-slate-200/80 rounded-xl space-y-2">
            <p className="text-xs text-slate-400 font-medium">Assigned Teachers</p>
            {subject.teachers?.length ? (
              subject.teachers.map((teacher) => (
                <p key={teacher.id} className="text-sm font-bold text-slate-800">
                  {teacher.fullName}
                </p>
              ))
            ) : (
              <p className="text-sm text-slate-500">No teachers assigned</p>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              onClose();
              onEdit(subject);
            }}
            className="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-100 transition-colors"
          >
            Edit Subject
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailsModal;