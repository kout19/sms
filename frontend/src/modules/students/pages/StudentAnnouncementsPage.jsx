import { Megaphone } from "lucide-react";
import PageHeader from "../../../shared/components/dashboard/PageHeader";
import SectionCard from "../../../shared/components/dashboard/SectionCard";
import { studentAnnouncements } from "../data/studentMockData";

const StudentAnnouncementsPage = () => {
  return (
    <div className="p-6 w-full bg-gray-50 min-h-full">
      <PageHeader
        icon={Megaphone}
        title="Announcements"
        subtitle="School notices and upcoming events"
        accent="emerald"
      />

      <SectionCard badge={`${studentAnnouncements.length} announcements`}>
        <div className="space-y-3">
          {studentAnnouncements.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-slate-100 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-center w-9 h-9 bg-emerald-100 rounded-full shrink-0">
                <Megaphone className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-sm text-slate-800">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">{item.date}</span>
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {item.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default StudentAnnouncementsPage;
