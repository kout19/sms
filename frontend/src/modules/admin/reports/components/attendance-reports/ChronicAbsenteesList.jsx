import Avatar from "@shared/components/Avatar";
import { useChronicAbsentees } from "../../hooks/useAttendanceReport";

export default function ChronicAbsenteesList({ filters }) {
  const { data = [], isLoading } = useChronicAbsentees(filters);

  return (
    <div className="bg-rose-50/40 rounded-2xl border border-rose-100 mb-6">
      <div className="flex items-center justify-between px-6 py-4">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Chronic Absentees
        </h3>
        <span className="text-xs font-medium text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
          {data.length} students below 75%
        </span>
      </div>

      {isLoading ? (
        <p className="px-6 pb-4 text-sm text-gray-400">Loading...</p>
      ) : (
        <div>
          <div className="grid grid-cols-[2fr_1.4fr_1.2fr_1fr] gap-4 px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-white/60">
            <span>Student</span>
            <span>Class</span>
            <span>Absent Days</span>
            <span>Rate</span>
          </div>
          {data.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-[2fr_1.4fr_1.2fr_1fr] gap-4 px-6 py-3 items-center bg-white border-t border-rose-50"
            >
              <div className="flex items-center gap-2.5">
                <Avatar name={s.name} colorful />
                <span className="text-sm font-medium text-gray-900">
                  {s.name}
                </span>
              </div>
              <span className="text-sm text-gray-500">{s.className}</span>
              <span className="text-sm font-semibold text-rose-600">
                {s.absentDays} days
              </span>
              <span className="text-sm font-semibold text-rose-600">
                {s.rate}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
