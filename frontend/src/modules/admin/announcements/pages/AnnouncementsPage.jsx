import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import AnnouncementsTable from "../components/AnnouncementsTable";

export default function AnnouncementsPage() {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage school-wide communications
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/announcements/new")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>
      <AnnouncementsTable />
    </div>
  );
}
