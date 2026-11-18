import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Archive, Ban, Eye, MoreHorizontal, Pencil, Search } from "lucide-react";
import DropdownMenu from "@shared/components/DropdownMenu";
import Pagination from "@shared/components/Pagination";
import { AUDIENCE_OPTIONS, PRIORITY_STYLES, STATUS_STYLES } from "../utils/announcementConstants";
import { useAnnouncements, useArchiveAnnouncement, useCancelAnnouncement } from "../hooks/useAnnouncements";

const formatDate = (value) => value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value)) : "—";
const audienceText = (audience = {}) => audience.allUsers ? "Everyone" : [audience.roles?.join(", "), audience.classes?.length ? `${audience.classes.length} classes` : "", audience.sections?.length ? `${audience.sections.length} sections` : ""].filter(Boolean).join(" · ") || "Custom";

export default function AnnouncementsTable() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: "", audience: "all", status: "all", priority: "all", page: 1, limit: 10 });
  const { data, isLoading, isError, error, refetch } = useAnnouncements(filters);
  const archive = useArchiveAnnouncement();
  const cancel = useCancelAnnouncement();
  const update = (field, value) => setFilters((current) => ({ ...current, [field]: value, page: field === "page" ? value : 1 }));
  const doAction = async (label, action, id) => {
    if (!window.confirm(`${label} this announcement?`)) return;
    await action.mutateAsync(id);
  };

  return <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
    <div className="flex items-center gap-3 flex-wrap px-6 py-4 border-b border-gray-100"><div className="relative flex-1 min-w-[220px]"><Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" /><input value={filters.search} onChange={(event) => update("search", event.target.value)} placeholder="Search announcements..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm" /></div><select value={filters.audience} onChange={(event) => update("audience", event.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"><option value="all">All audiences</option>{AUDIENCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><select value={filters.status} onChange={(event) => update("status", event.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"><option value="all">All statuses</option>{Object.entries(STATUS_STYLES).map(([key, style]) => <option key={key} value={key}>{style.label}</option>)}</select><select value={filters.priority} onChange={(event) => update("priority", event.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"><option value="all">All priorities</option>{Object.entries(PRIORITY_STYLES).map(([key, style]) => <option key={key} value={key}>{style.label}</option>)}</select></div>
    {isLoading && <p className="px-6 py-10 text-sm text-gray-400">Loading announcements...</p>}
    {isError && <div className="px-6 py-10 text-sm text-rose-600">{error?.response?.data?.message || "Announcements could not be loaded."} <button type="button" onClick={() => refetch()} className="underline">Retry</button></div>}
    {!isLoading && !isError && data?.data?.length === 0 && <p className="px-6 py-10 text-sm text-gray-400">No announcements match these filters.</p>}
    {!isLoading && !isError && data?.data?.length > 0 && <div className="overflow-x-auto"><div className="min-w-[980px]"><div className="grid grid-cols-[2.2fr_1.4fr_1.2fr_1fr_1fr_1fr_0.5fr] gap-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100"><span>Announcement</span><span>Audience</span><span>Author</span><span>Date</span><span>Status</span><span>Priority</span><span /></div>{data.data.map((announcement) => { const status = STATUS_STYLES[announcement.status] || STATUS_STYLES.draft; const priority = PRIORITY_STYLES[announcement.priority] || PRIORITY_STYLES.normal; return <div key={announcement.id} onClick={() => navigate(`/admin/announcements/${announcement.id}`)} className="grid grid-cols-[2.2fr_1.4fr_1.2fr_1fr_1fr_1fr_0.5fr] gap-4 px-6 py-3.5 items-center border-b border-gray-50 hover:bg-gray-50 cursor-pointer"><div><p className="text-sm font-semibold text-gray-900 truncate">{announcement.title}</p><p className="text-xs text-gray-400 truncate">{announcement.recipientCount ?? 0} recipient{announcement.recipientCount === 1 ? "" : "s"}</p></div><span className="text-sm text-gray-600 truncate">{audienceText(announcement.audience)}</span><span className="text-sm text-gray-700 truncate">{announcement.authorName}</span><span className="text-sm text-gray-500">{formatDate(announcement.publishedAt || announcement.scheduledFor || announcement.createdAt)}</span><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-fit ${status.bg} ${status.text}`}>{status.label}</span><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border w-fit ${priority.bg} ${priority.text} ${priority.accent}`}>{priority.label}</span><div onClick={(event) => event.stopPropagation()} className="flex justify-end"><DropdownMenu trigger={<button type="button" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><MoreHorizontal className="w-4 h-4" /></button>} items={[{ label: "View Details", icon: Eye, onClick: () => navigate(`/admin/announcements/${announcement.id}`) }, ...(["draft", "scheduled"].includes(announcement.status) ? [{ label: "Edit", icon: Pencil, onClick: () => navigate(`/admin/announcements/${announcement.id}/edit`) }] : []), ...(announcement.status === "scheduled" ? [{ label: "Cancel schedule", icon: Ban, variant: "danger", onClick: () => doAction("Cancel", cancel, announcement.id) }] : []), ...(announcement.status === "published" ? [{ label: "Archive", icon: Archive, onClick: () => doAction("Archive", archive, announcement.id) }] : [])]} /></div></div>; })}</div></div>}
    <Pagination page={data?.meta?.page || filters.page} pageSize={data?.meta?.limit || filters.limit} total={data?.meta?.total || 0} onPageChange={(page) => update("page", page)} />
  </div>;
}
