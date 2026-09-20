import { useNavigate } from "react-router-dom";
import { Archive, Trash2, Pencil } from "lucide-react";
import Avatar from "@shared/components/Avatar";
import { PRIORITY_STYLES, STATUS_STYLES } from "../utils/announcementConstants";
import {
  useArchiveAnnouncement,
  useDeleteAnnouncement,
} from "../hooks/useAnnouncements";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function AnnouncementDetailView({ announcement }) {
  const navigate = useNavigate();
  const archive = useArchiveAnnouncement();
  const remove = useDeleteAnnouncement();
  const statusStyle = STATUS_STYLES[announcement.status];
  const priorityStyle = PRIORITY_STYLES[announcement.priority];
  const isPublished =
    announcement.status === "published" || announcement.status === "archived";

  const handleDelete = () => {
    if (window.confirm("Delete this announcement? This cannot be undone.")) {
      remove.mutate(announcement.id, {
        onSuccess: () => navigate("/admin/announcements"),
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 max-w-3xl">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.label}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.accent}`}
          >
            {priorityStyle.label}
          </span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-5">
          {announcement.title}
        </h1>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
          <div>
            <p className="text-xs text-gray-400">Audience</p>
            <p className="text-sm font-medium text-gray-800 capitalize mt-0.5">
              {announcement.audience}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Author</p>
            <div className="flex items-center gap-2 mt-1">
              <Avatar name={announcement.authorName} colorful />
              <span className="text-sm font-medium text-gray-800">
                {announcement.authorName}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400">Date</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">
              {formatDate(announcement.publishDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Created</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">
              {formatDate(announcement.createdAt)}
            </p>
          </div>
        </div>

        {isPublished && (
          <div className="border-t border-gray-100 pt-5 mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
              Delivery Statistics
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {announcement.stats.recipients.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">Recipients</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  {announcement.stats.delivered.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">Delivered</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-sky-600">
                  {announcement.stats.read.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">Read</p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 pt-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Content
          </p>
          <div
            className="text-sm text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => archive.mutate(announcement.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Archive className="w-4 h-4" />
            {announcement.status === "archived" ? "Unarchive" : "Archive"}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-rose-200 text-sm text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
        <button
          onClick={() =>
            navigate(`/admin/announcements/${announcement.id}/edit`)
          }
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  );
}
