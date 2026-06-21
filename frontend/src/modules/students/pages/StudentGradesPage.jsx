import { useState } from "react";
import { TrendingUp, BookOpen } from "lucide-react";
import PageHeader from "../../../shared/components/dashboard/PageHeader";
import SectionCard from "../../../shared/components/dashboard/SectionCard";
import ViewSelect from "../../../shared/components/dashboard/ViewSelect";
import { currentGrades, gradeHistory } from "../data/studentMockData";

const viewOptions = [
  { value: "current", label: "Current Grades" },
  { value: "history", label: "Grade History" },
];

const StudentGradesPage = () => {
  const [view, setView] = useState("current");

  return (
    <div className="p-6 w-full bg-gray-50 min-h-full">
      <PageHeader
        icon={TrendingUp}
        title="My Grades"
        subtitle="Track your current performance and past terms"
        accent="emerald"
      />

      <SectionCard className="mb-6">
        <ViewSelect
          label="View"
          value={view}
          onChange={setView}
          options={viewOptions}
        />
      </SectionCard>

      {view === "current" ? (
        <SectionCard title="Current Term" badge={`${currentGrades.length} subjects`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentGrades.map((item) => (
              <div
                key={item.subject}
                className="p-4 bg-gray-50 rounded-xl border border-slate-100 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{item.subject}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.teacher}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-emerald-600">{item.grade}</span>
                    <p className="text-xs text-slate-500">{item.score}%</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-xl overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-xl transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="Grade History" badge={`${gradeHistory.length} terms`}>
          <div className="space-y-3">
            {gradeHistory.map((term) => (
              <div
                key={term.term}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-800">{term.term}</p>
                    <p className="text-xs text-slate-500">{term.subjects} subjects</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600">{term.gpa} GPA</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default StudentGradesPage;
