import { useState } from "react";
import { CalendarCheck, MapPin, BarChart3 } from "lucide-react";
import PageHeader from "../../../shared/components/dashboard/PageHeader";
import SectionCard from "../../../shared/components/dashboard/SectionCard";
import TabPills from "../../../shared/components/dashboard/TabPills";
import ViewSelect from "../../../shared/components/dashboard/ViewSelect";
import { teacherClasses } from "../data/teacherMockData";
import { attendanceRecords } from "../data/teacherMockData";

const tabs = [
  { id: "mark", label: "Mark Attendance", icon: MapPin },
  { id: "report", label: "Attendance Report", icon: BarChart3 },
];

const TeacherAttendancePage = () => {
  const [activeTab, setActiveTab] = useState("mark");
  const [selectedClass, setSelectedClass] = useState("10-A");

  const classOptions = teacherClasses.map((cls) => ({
    value: cls.section,
    label: cls.section,
  }));

  const activeClassData = teacherClasses.find(
    (cls) => cls.section === selectedClass,
  );

  return (
    <div className="p-6 w-full bg-gray-50 min-h-full">
      <PageHeader
        icon={CalendarCheck}
        title="Attendance"
        subtitle="Mark daily attendance and review class reports"
      />

      <SectionCard className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <TabPills tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <ViewSelect
            label="Class"
            value={selectedClass}
            onChange={setSelectedClass}
            options={classOptions}
          />
        </div>
      </SectionCard>

      {activeTab === "mark" ? (
        <SectionCard
          title={`Mark Attendance — ${selectedClass}`}
          badge={new Date().toLocaleDateString()}
        >
          <div className="space-y-2">
            {activeClassData?.students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-slate-100"
              >
                <div>
                  <p className="font-medium text-sm text-slate-800">
                    {student.name}
                  </p>
                  <p className="text-xs text-slate-500">Roll {student.rollNo}</p>
                </div>
                <div className="flex gap-2">
                  {["Present", "Absent", "Late"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                        status === "Present"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : status === "Absent"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-4 w-full sm:w-auto px-6 py-2 text-sm font-medium bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
          >
            Submit Attendance
          </button>
        </SectionCard>
      ) : (
        <SectionCard title="Attendance Report">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {attendanceRecords
              .filter((r) => r.class === selectedClass)
              .map((record, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-xl border border-slate-100"
                >
                  <p className="text-xs text-slate-500">{record.date}</p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {record.class}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs">
                    <span className="text-emerald-600">{record.present} present</span>
                    <span className="text-red-500">{record.absent} absent</span>
                    <span className="text-amber-600">{record.late} late</span>
                  </div>
                </div>
              ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Class</th>
                  <th className="pb-3 font-medium">Present</th>
                  <th className="pb-3 font-medium">Absent</th>
                  <th className="pb-3 font-medium">Late</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-50 hover:bg-gray-50"
                  >
                    <td className="py-3 text-slate-600">{record.date}</td>
                    <td className="py-3">
                      <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                        {record.class}
                      </span>
                    </td>
                    <td className="py-3 text-emerald-600">{record.present}</td>
                    <td className="py-3 text-red-500">{record.absent}</td>
                    <td className="py-3 text-amber-600">{record.late}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default TeacherAttendancePage;
