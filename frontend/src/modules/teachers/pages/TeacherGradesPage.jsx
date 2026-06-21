import { useState } from "react";
import { Eye, Pencil, TrendingUp } from "lucide-react";
import PageHeader from "../../../shared/components/dashboard/PageHeader";
import SectionCard from "../../../shared/components/dashboard/SectionCard";
import TabPills from "../../../shared/components/dashboard/TabPills";
import ViewSelect from "../../../shared/components/dashboard/ViewSelect";
import { gradeEntries, teacherClasses } from "../data/teacherMockData";

const tabs = [
  { id: "enter", label: "Enter Grades", icon: Pencil },
  { id: "view", label: "View Grades", icon: Eye },
];

const TeacherGradesPage = () => {
  const [activeTab, setActiveTab] = useState("enter");
  const [selectedClass, setSelectedClass] = useState("10-A");

  const classOptions = teacherClasses.map((cls) => ({
    value: cls.section,
    label: cls.section,
  }));

  const classGrades = gradeEntries.filter((g) => g.class === selectedClass);

  return (
    <div className="p-6 w-full bg-gray-50 min-h-full">
      <PageHeader
        icon={TrendingUp}
        title="Grades"
        subtitle="Enter and review student grades by class"
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

      {activeTab === "enter" ? (
        <SectionCard title={`Enter Grades — ${selectedClass}`}>
          <div className="space-y-3">
            {classGrades.map((entry, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl border border-slate-100"
              >
                <div>
                  <p className="font-medium text-sm text-slate-800">
                    {entry.student}
                  </p>
                  <p className="text-xs text-slate-500">{entry.assignment}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={entry.score}
                    max={entry.maxScore}
                    className="w-20 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-500">/ {entry.maxScore}</span>
                  <button
                    type="button"
                    className="px-4 py-2 text-xs font-medium bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : (
        <SectionCard title={`Grade Report — ${selectedClass}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Assignment</th>
                  <th className="pb-3 font-medium">Score</th>
                  <th className="pb-3 font-medium">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {classGrades.map((entry, index) => {
                  const pct = Math.round((entry.score / entry.maxScore) * 100);
                  return (
                    <tr
                      key={index}
                      className="border-b border-slate-50 hover:bg-gray-50"
                    >
                      <td className="py-3 font-medium text-slate-800">
                        {entry.student}
                      </td>
                      <td className="py-3 text-slate-600">{entry.assignment}</td>
                      <td className="py-3 text-slate-600">
                        {entry.score}/{entry.maxScore}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            pct >= 80
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default TeacherGradesPage;
