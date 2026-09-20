import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAnnouncement } from "../hooks/useAnnouncements";
import AnnouncementDetailView from "../components/AnnouncementDetailView";

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: announcement, isLoading } = useAnnouncement(id);

  if (isLoading)
    return <div className="p-6 text-sm text-gray-400">Loading...</div>;
  if (!announcement)
    return (
      <div className="p-6 text-sm text-red-500">Announcement not found.</div>
    );

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={() => navigate("/admin/announcements")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Announcements
      </button>
      <AnnouncementDetailView announcement={announcement} />
    </div>
  );
}
