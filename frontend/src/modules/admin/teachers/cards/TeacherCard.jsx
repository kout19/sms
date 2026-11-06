import { Mail, Phone } from "lucide-react";

const TeacherCard = ({
  name,
  email,
  phone,
  employeeId,
  isActive,
  homeroomLabel,
  onEdit,
  onView,
  onDelete,
}) => {
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const titles = ["dr.", "mr.", "mrs.", "ms.", "prof.", "doc."];
    const cleanWords = fullName
      .trim()
      .split(/\s+/)
      .filter((word) => !titles.includes(word.toLowerCase()));
    const firstInitial = cleanWords[0]?.[0] || "";
    const lastInitial =
      cleanWords.length > 1 ? cleanWords[cleanWords.length - 1][0] : "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  return (
    <div className="w-full border border-slate-200 rounded-xl bg-white p-6 shadow-sm hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl mb-4">
          <span>{getInitials(name)}</span>
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
            isActive
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-slate-900">{name}</h3>
          <p className="text-xs text-slate-500 mt-1">
            {employeeId ? `Employee ID: ${employeeId}` : "No employee ID"}
          </p>
          {homeroomLabel ? (
            <p className="text-xs text-slate-500 mt-1">Homeroom: {homeroomLabel}</p>
          ) : null}
        </div>
        <div className="text-slate-500 flex flex-col gap-1">
          <div className="flex items-center gap-1 justify-start">
            <Mail size={16} />
            <p className="text-sm">Email: {email}</p>
          </div>
          <div className="flex items-center gap-1 justify-start">
            <Phone size={16} />
            <p className="text-sm">Phone: {phone || "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={onView}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={!isActive}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
