import { useState } from "react";
import {
  BookOpen,
  CalendarCheck,
  Clock,
  TrendingUp,
} from "lucide-react";
import PageHeader from "../../../shared/components/dashboard/PageHeader";
import SectionCard from "../../../shared/components/dashboard/SectionCard";
import ViewSelect from "../../../shared/components/dashboard/ViewSelect";
import TabPills from "../../../shared/components/dashboard/TabPills";
import { children } from "../data/parentMockData";

const progressTabs = [
  { id: "grades", label: "Grades", icon: TrendingUp },
  { id: "attendance", label: "Attendance", icon: CalendarCheck },
  { id: "schedule", label: "Schedule", icon: Clock },
];

const ParentProgressPage = () => {
  const [selectedChild, setSelectedChild] = useState(children[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState("grades");

  const childOptions = children.map((child) => ({
    value: child.id,
    label: `${child.name} (${child.class})`,
  }));

  const child = children.find((c) => c.id === selectedChild);

  if (!child) return null;

  return (
    <div className="p-6 w-full bg-gray-50 min-h-full">
      <PageHeader
        icon={BookOpen}
        title="Child Progress"
        subtitle="Grades, attendance, and schedule for your children"
        accent="violet"
      />

      <SectionCard className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <ViewSelect
            label="Select child"
            value={selectedChild}
            onChange={setSelectedChild}
            options={childOptions}
          />
          <TabPills
            tabs={progressTabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs text-slate-500">GPA</p>
          <p className="text-2xl font-bold text-violet-600 mt-1">{child.gpa}</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs text-slate-500">Attendance</p>
          <p className="text-2xl font-bold text-violet-600 mt-1">{child.attendance}%</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm col-span-2 md:col-span-1">
          <p className="text-xs text-slate-500">Class</p>
          <p className="text-lg font-bold text-slate-800 mt-1">{child.class}</p>
        </div>
      </div>

      {activeTab === "grades" && (
        <SectionCard title={`Grades — ${child.name}`} badge={`${child.grades.length} subjects`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {child.grades.map((grade) => (
              <div
                key={grade.subject}
                className="p-4 bg-gray-50 rounded-xl border border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-slate-800">{grade.subject}</p>
                  <span className="text-lg font-bold text-violet-600">{grade.grade}</span>
                </div>
                <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-xl overflow-hidden">
                  <div
                    className="bg-violet-500 h-full rounded-xl"
                    style={{ width: `${grade.score}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">{grade.score}%</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {activeTab === "attendance" && (
        <SectionCard title={`Attendance — ${child.name}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {child.attendanceRecords.map((record) => (
              <div
                key={record.month}
                className="p-3 bg-gray-50 rounded-xl border border-slate-100 text-center"
              >
                <p className="text-xs text-slate-500">{record.month}</p>
                <p className="text-lg font-bold text-violet-600 mt-1">{record.rate}%</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {activeTab === "schedule" && (
        <SectionCard title={`Schedule — ${child.name}`} badge={`${child.schedule.length} classes`}>
          <div className="space-y-3">
            {child.schedule.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-2xl border border-slate-100 border-l-4 border-l-violet-500 p-4 gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 bg-violet-100 rounded-full">
                    <Clock className="w-4 h-4 text-violet-600" />
                  </div>
                  <span className="font-semibold text-sm text-slate-700">{item.time}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{item.subject}</p>
                  <p className="text-xs text-slate-500">Room {item.room}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default ParentProgressPage;
