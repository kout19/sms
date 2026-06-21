import { CalendarCheck } from "lucide-react";
import PageHeader from "../../../shared/components/dashboard/PageHeader";
import SectionCard from "../../../shared/components/dashboard/SectionCard";
import { attendanceSummary, monthlyAttendance } from "../data/studentMockData";

const StudentAttendancePage = () => {
  return (
    <div className="p-6 w-full bg-gray-50 min-h-full">
      <PageHeader
        icon={CalendarCheck}
        title="Attendance"
        subtitle="Your attendance record for the current academic year"
        accent="emerald"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Attendance Rate", value: `${attendanceSummary.rate}%`, color: "text-emerald-600" },
          { label: "Present", value: attendanceSummary.present, color: "text-emerald-600" },
          { label: "Absent", value: attendanceSummary.absent, color: "text-red-500" },
          { label: "Late", value: attendanceSummary.late, color: "text-amber-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm"
          >
            <p className="text-xs text-slate-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <SectionCard title="Monthly Overview">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {monthlyAttendance.map((item) => (
            <div
              key={item.month}
              className="p-3 bg-gray-50 rounded-xl border border-slate-100 text-center"
            >
              <p className="text-xs text-slate-500">{item.month}</p>
              <p className="text-lg font-bold text-emerald-600 mt-1">{item.rate}%</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default StudentAttendancePage;
