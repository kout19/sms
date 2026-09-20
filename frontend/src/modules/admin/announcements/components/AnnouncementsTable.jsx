import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {truncateDescription} from "@shared/utils/truncateDescription";
import {
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Archive,
  Trash2,
} from "lucide-react";
import Avatar from "@shared/components/Avatar";
import DropdownMenu from "@shared/components/DropdownMenu";
import Pagination from "@shared/components/Pagination";
import { AUDIENCE_OPTIONS, PRIORITY_STYLES, STATUS_STYLES } from "../utils/announcementConstants";
import {
  useAnnouncements,
  useArchiveAnnouncement,
  useDeleteAnnouncement,
} from "../hooks/useAnnouncements";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AnnouncementsTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState("all");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 7;

  const { data, isLoading } = useAnnouncements({
    search,
    audience,
    status,
    priority,
    page,
    pageSize: PAGE_SIZE,
  });
  const archive = useArchiveAnnouncement();
  const remove = useDeleteAnnouncement();

  const resetToPage1 = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 flex-wrap px-6 py-4 border-b border-gray-100">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => resetToPage1(setSearch)(e.target.value)}
            placeholder="Search announcements..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={audience}
          onChange={(e) => resetToPage1(setAudience)(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All</option>
          {AUDIENCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => resetToPage1(setStatus)(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All</option>
          {Object.entries(STATUS_STYLES).map(([k, s]) => (
            <option key={k} value={k}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => resetToPage1(setPriority)(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All</option>
          {Object.entries(PRIORITY_STYLES).map(([k, s]) => (
            <option key={k} value={k}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading || !data ? (
        <p className="px-6 py-8 text-sm text-gray-400">
          Loading announcements...
        </p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[2.2fr_1fr_1.4fr_1fr_1fr_1fr_0.5fr] gap-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <span>Announcement</span>
              <span>Audience</span>
              <span>Author</span>
              <span>Date</span>
              <span>Status</span>
              <span>Priority</span>
              <span></span>
            </div>
            <div>
              {data.items.map((a) => {
                const statusStyle = STATUS_STYLES[a.status];
                const priorityStyle = PRIORITY_STYLES[a.priority];
                return (
                  <div
                    key={a.id}
                    onClick={() => navigate(`/admin/announcements/${a.id}`)}
                    className="grid grid-cols-[2.2fr_1fr_1.4fr_1fr_1fr_1fr_0.5fr] gap-4 px-6 py-3.5 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/60 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {a.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {truncateDescription(a.content, a.title)}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600 capitalize">
                      {a.audience}
                    </span>
                    <div className="flex items-center gap-2">
                      <Avatar name={a.authorName} colorful />
                      <span className="text-sm text-gray-700">
                        {a.authorName}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(a.publishDate)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-fit ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {statusStyle.label}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border w-fit ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.accent}`}
                    >
                      {priorityStyle.label}
                    </span>
                    <div
                      className="flex justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu
                        trigger={
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        }
                        items={[
                          {
                            label: "View Details",
                            icon: Eye,
                            onClick: () =>
                              navigate(`/admin/announcements/${a.id}`),
                          },
                          {
                            label: "Edit",
                            icon: Pencil,
                            onClick: () =>
                              navigate(`/admin/announcements/${a.id}/edit`),
                          },
                          {
                            label:
                              a.status === "archived" ? "Unarchive" : "Archive",
                            icon: Archive,
                            onClick: () => archive.mutate(a.id),
                          },
                          {
                            label: "Delete",
                            icon: Trash2,
                            variant: "danger",
                            onClick: () => remove.mutate(a.id),
                          },
                        ]}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={data?.total || 0}
        onPageChange={setPage}
      />
    </div>
  );
}
