import { useState, useEffect } from "react";
import Modal from "@shared/components/AttendanceModal";
import Avatar from "@shared/components/Avatar";
import { useAttendanceRecords, useBulkMarkAttendance } from "../hooks/useAttendance";
import { ATTENDANCE_STATUSES } from "../constants/colorConstants";

const STATUS_KEYS = Object.keys(ATTENDANCE_STATUSES); // ["present", "absent", "late", "excused"]

function StatusCircle({ statusKey, isSelected, onClick }) {
  const style = ATTENDANCE_STATUSES[statusKey];
  const letter = style.label[0]; // P / A / L / E

  return (
    <button
      onClick={onClick}
      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-colors ${
        isSelected
          ? `${style.text} border-current`
          : "text-gray-300 border-gray-200 hover:border-gray-300"
      }`}
    >
      {letter}
    </button>
  );
}

export default function MarkAttendanceModal({ isOpen, onClose, date }) {
  // Full, unfiltered roster - deliberately NOT reusing the table's filtered
  // list, since Mark Attendance should always show every student for the day.
  const { data: roster = [] } = useAttendanceRecords({});
  const bulkMark = useBulkMarkAttendance();

  const [draft, setDraft] = useState({}); // { [studentId]: status }

  useEffect(() => {
    if (isOpen && roster.length) {
      const initial = {};
      roster.forEach((r) => { initial[r.id] = r.status; });
      setDraft(initial);
    }
  }, [isOpen, roster]);

  const markAll = (status) => {
    const updated = {};
    roster.forEach((r) => { updated[r.id] = status; });
    setDraft(updated);
  };

  const handleSave = async () => {
    const entries = Object.entries(draft).map(([id, status]) => ({ id, status }));
    await bulkMark.mutateAsync({ date, entries });
    onClose();
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mark Attendance"
      subtitle={formattedDate}
      maxWidth="max-w-xl"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={bulkMark.isPending}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50"
          >
            {bulkMark.isPending ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      }
    >
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <span className="text-sm text-gray-500">Mark all:</span>
        {STATUS_KEYS.map((key) => {
          const style = ATTENDANCE_STATUSES[key];
          return (
            <button
              key={key}
              onClick={() => markAll(key)}
              className={`px-3 py-1 rounded-full border text-xs font-medium ${style.text} border-current hover:${style.bg}`}
            >
              {style.label}
            </button>
          );
        })}
      </div>

      <div>
        {roster.map((student) => (
          <div key={student.id} className="flex items-center justify-between px-6 py-3 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              <Avatar name={student.studentName} colorful />
              <div>
                <p className="text-sm font-medium text-gray-900">{student.studentName}</p>
                <p className="text-xs text-gray-400">{student.studentCode} · {student.className}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {STATUS_KEYS.map((key) => (
                <StatusCircle
                  key={key}
                  statusKey={key}
                  isSelected={draft[student.id] === key}
                  onClick={() => setDraft((prev) => ({ ...prev, [student.id]: key }))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}