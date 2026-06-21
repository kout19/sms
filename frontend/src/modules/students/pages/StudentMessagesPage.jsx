import { MessageSquare } from "lucide-react";
import PageHeader from "../../../shared/components/dashboard/PageHeader";
import SectionCard from "../../../shared/components/dashboard/SectionCard";
import { studentMessages } from "../data/studentMockData";

const StudentMessagesPage = () => {
  return (
    <div className="p-6 w-full bg-gray-50 min-h-full">
      <PageHeader
        icon={MessageSquare}
        title="Messages"
        subtitle="Messages from teachers and school staff"
        accent="emerald"
      />

      <SectionCard badge={`${studentMessages.filter((m) => m.unread).length} unread`}>
        <div className="space-y-2">
          {studentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                msg.unread
                  ? "bg-emerald-50 border-emerald-100 hover:bg-emerald-100"
                  : "bg-gray-50 border-slate-100 hover:bg-gray-100"
              }`}
            >
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${
                  msg.unread ? "bg-emerald-500 text-white" : "bg-gray-200 text-slate-600"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm truncate ${msg.unread ? "font-semibold text-slate-800" : "font-medium text-slate-700"}`}>
                    {msg.from}
                  </p>
                  <span className="text-xs text-slate-400 shrink-0">{msg.time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate">{msg.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default StudentMessagesPage;
