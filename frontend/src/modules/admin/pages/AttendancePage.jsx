import { Clock, CircleCheck, CircleX, Calendar } from "lucide-react";
import AttendanceCard from "../components/cards/AttendanceCard";
import { useState, useEffect } from "react";

const attendanceData = [
  {
    id: 1,
    status: "Present",
    count: 5,
    icon: CircleCheck,
    iconColor: "text-green-600",
  },
  {
    id: 2,
    status: "Absent",
    count: 5,
    icon: CircleX,
    iconColor: "text-red-600",
  },
  {
    id: 3,
    status: "Late",
    count: 5,
    icon: Clock,
    iconColor: "text-yellow-600",
  },
  {
    id: 4,
    status: "Rate",
    count: "63.5%",
    icon: Calendar,
    iconColor: "text-blue-600",
  },
];

const DB = {
  "Chemistry II": [
    { name: "Emma Wilson", status: "present", time: "8:45 AM" },
    { name: "Liam Johnson", status: "present", time: "8:42 AM" },
    { name: "Olivia Brown", status: "late", time: "9:15 AM" },
    { name: "Noah Davis", status: "present", time: "8:50 AM" },
    { name: "Ava Martinez", status: "absent", time: null },
    { name: "Ethan Garcia", status: "present", time: "8:38 AM" },
    { name: "Sophia Rodriguez", status: "present", time: "8:55 AM" },
    { name: "Mason Lee", status: "late", time: "9:20 AM" },
    { name: "Aiden Thompson", status: "present", time: "8:40 AM" },
    { name: "Harper White", status: "absent", time: null },
    { name: "Elijah Harris", status: "present", time: "8:44 AM" },
    { name: "Scarlett Martin", status: "late", time: "9:10 AM" },
  ],
  "Biology I": [
    { name: "Chloe Adams", status: "present", time: "8:30 AM" },
    { name: "James Turner", status: "absent", time: null },
    { name: "Mia Scott", status: "present", time: "8:28 AM" },
    { name: "Oliver White", status: "late", time: "9:05 AM" },
    { name: "Lily Harris", status: "present", time: "8:32 AM" },
    { name: "Caleb Nelson", status: "present", time: "8:35 AM" },
    { name: "Aria Moore", status: "absent", time: null },
  ],
  "Physics III": [
    { name: "Lucas Clark", status: "present", time: "9:00 AM" },
    { name: "Amelia Lewis", status: "present", time: "8:58 AM" },
    { name: "Benjamin Hall", status: "absent", time: null },
    { name: "Charlotte Young", status: "late", time: "9:18 AM" },
    { name: "Sebastian King", status: "present", time: "8:56 AM" },
  ],
  "Mathematics IV": [
    { name: "Henry Walker", status: "present", time: "7:55 AM" },
    { name: "Isabella Allen", status: "present", time: "7:59 AM" },
    { name: "Jack King", status: "present", time: "8:01 AM" },
    { name: "Grace Wright", status: "absent", time: null },
    { name: "Samuel Scott", status: "present", time: "7:57 AM" },
    { name: "Ella Green", status: "late", time: "8:22 AM" },
    { name: "Ryan Baker", status: "present", time: "7:53 AM" },
    { name: "Nora Hill", status: "absent", time: null },
  ],
  "English Literature": [
    { name: "Daniel Baker", status: "present", time: "10:02 AM" },
    { name: "Zoe Carter", status: "present", time: "9:58 AM" },
    { name: "Nathan Mitchell", status: "absent", time: null },
    { name: "Penelope Evans", status: "late", time: "10:15 AM" },
    { name: "Dylan Roberts", status: "present", time: "9:55 AM" },
  ],
};

const CLASSES = Object.keys(DB);
const PAGE_SIZE = 5;

function getInitials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-amber-100 text-amber-800",
  "bg-purple-100 text-purple-800",
  "bg-teal-100 text-teal-800",
  "bg-pink-100 text-pink-800",
  "bg-orange-100 text-orange-800",
];

function avatarColor(name) {
  let h = 0;
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) & 0xfffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function StatusBadge({ status }) {
  if (status === "present")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Present
      </span>
    );
  if (status === "absent")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Absent
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Late
    </span>
  );
}

function ActionButton({ label, active, color, onClick }) {
  const colors = {
    green: active
      ? "bg-green-600 text-white ring-2 ring-green-400"
      : "bg-green-200 text-green-700 hover:bg-green-300",
    red: active
      ? "bg-red-600 text-white ring-2 ring-red-400"
      : "bg-red-200 text-red-700 hover:bg-red-300",
    amber: active
      ? "bg-amber-500 text-white ring-2 ring-amber-300"
      : "bg-amber-200 text-amber-700 hover:bg-amber-300",
  };
  return (
    <button
      onClick={onClick}
      className={`w-7 h-7 rounded-md text-xs font-bold transition-all active:scale-95 ${colors[color]}`}
    >
      {label}
    </button>
  );
}

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedDate, setSelectedDate] = useState("2026-05-18");
  const [students, setStudents] = useState([]);
  const [saved, setSaved] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const key = `att_${selectedClass}_${selectedDate}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setStudents(JSON.parse(stored));
    } else {
      setStudents((DB[selectedClass] || []).map((s) => ({ ...s })));
    }
    setCurrentPage(1);
  }, [selectedClass, selectedDate]);

  const totalPages = Math.ceil(students.length / PAGE_SIZE);
  const paginated = students.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function setStatus(index, status) {
    const globalIndex = (currentPage - 1) * PAGE_SIZE + index;
    setStudents((prev) =>
      prev.map((s, i) => {
        if (i !== globalIndex) return s;
        const now = new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });
        return {
          ...s,
          status,
          time: status === "absent" ? null : s.time || now,
        };
      }),
    );
  }

  function handleReset() {
    setStudents((DB[selectedClass] || []).map((s) => ({ ...s })));
    setCurrentPage(1);
  }

  function handleSave() {
    const key = `att_${selectedClass}_${selectedDate}`;
    localStorage.setItem(key, JSON.stringify(students));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const presentCount = students.filter((s) => s.status === "present").length;
  const absentCount = students.filter((s) => s.status === "absent").length;
  const lateCount = students.filter((s) => s.status === "late").length;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col gap-2 ">
        <h1 className="text-slate-900 text-xl md:text-2xl font-semibold">
          Attendance
        </h1>
        <p className="text-slate-600 ">Track and manage student attendance</p>
      </div>
      {/* Attendance cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-4 mb-4 md:gap-4">
        {attendanceData.map((attendance, index) => (
          <AttendanceCard
            key={index}
            status={attendance.status}
            count={attendance.count}
            Icon={attendance.icon}
            iconColor={attendance.iconColor}
          />
        ))}
      </div>
      {/* Table card */}

      <div className=" border border-slate-200 rounded-xl shadow-sm p-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CLASSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-xl overflow-x-auto w-full">
          <table className=" min-w-[640px] w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-12 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="w-36 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="w-28 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="w-32 px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-gray-400"
                  >
                    No students found for this class.
                  </td>
                </tr>
              )}
              {paginated.map((student, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {(currentPage - 1) * PAGE_SIZE + i + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${avatarColor(student.name)}`}
                      >
                        {getInitials(student.name)}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {student.time || "–"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <ActionButton
                        label="P"
                        active={student.status === "present"}
                        color="green"
                        onClick={() => setStatus(i, "present")}
                      />
                      <ActionButton
                        label="A"
                        active={student.status === "absent"}
                        color="red"
                        onClick={() => setStatus(i, "absent")}
                      />
                      <ActionButton
                        label="L"
                        active={student.status === "late"}
                        color="amber"
                        onClick={() => setStatus(i, "late")}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, students.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {students.length}
              </span>{" "}
              students
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? "bg-gray-900 text-white"
                        : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              <strong className="text-gray-800">{presentCount}</strong> present
            </span>
            <span>
              <strong className="text-gray-800">{absentCount}</strong> absent
            </span>
            <span>
              <strong className="text-gray-800">{lateCount}</strong> late
            </span>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm text-green-600 font-medium">
                ✓ Saved
              </span>
            )}
            <button
              onClick={handleReset}
              className="h-9 px-4 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="h-9 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Save Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
