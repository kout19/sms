import { Clock } from "lucide-react";
import PageHeader from "../../../shared/components/dashboard/PageHeader";
import SectionCard from "../../../shared/components/dashboard/SectionCard";
import { studentSchedule } from "../data/studentMockData";

const StudentSchedulePage = () => {
  return (
    <div className="p-6 w-full bg-gray-50 min-h-full">
      <PageHeader
        icon={Clock}
        title="Schedule"
        subtitle="Your daily class timetable"
        accent="emerald"
      />

      <SectionCard badge={`${studentSchedule.length} classes today`}>
        <div className="space-y-3">
          {studentSchedule.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-2xl border border-slate-100 border-l-4 border-l-emerald-500 p-4 gap-3 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 bg-emerald-100 rounded-full">
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-semibold text-sm text-slate-700">{item.time}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{item.subject}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Room {item.room} · {item.teacher}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default StudentSchedulePage;
