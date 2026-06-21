import { useState } from "react";
import { Megaphone, Plus } from "lucide-react";
import PageHeader from "../../../shared/components/dashboard/PageHeader";
import SectionCard from "../../../shared/components/dashboard/SectionCard";
import ViewSelect from "../../../shared/components/dashboard/ViewSelect";
import { teacherAnnouncements } from "../data/teacherMockData";

const TeacherAnnouncementsPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");

  const audienceOptions = [
    { value: "all", label: "All Classes" },
    { value: "10-a", label: "Grade 10-A" },
    { value: "10-b", label: "Grade 10-B" },
    { value: "10-c", label: "Grade 10-C" },
  ];

  return (
    <div className="p-6 w-full bg-gray-50 min-h-full">
      <PageHeader
        icon={Megaphone}
        title="Announcements"
        subtitle="Create announcements and view past posts"
      />

      <SectionCard title="Create Announcement" className="mb-6">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <ViewSelect
              label="Audience"
              value={audience}
              onChange={setAudience}
              options={audienceOptions}
            />
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Post Announcement
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="All Announcements"
        badge={`${teacherAnnouncements.length} posts`}
      >
        <div className="space-y-3">
          {teacherAnnouncements.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-slate-100 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-center w-9 h-9 bg-indigo-100 rounded-full shrink-0">
                <Megaphone className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-slate-800">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">{item.date}</span>
                  <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {item.audience}
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

export default TeacherAnnouncementsPage;
