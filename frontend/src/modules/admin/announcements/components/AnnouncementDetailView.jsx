import { Archive, Ban, Clock3, Pencil, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PRIORITY_STYLES, STATUS_STYLES } from "../utils/announcementConstants";
import { useArchiveAnnouncement, useCancelAnnouncement, useExpireAnnouncement } from "../hooks/useAnnouncements";

const formatDate = (value) => value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
const audienceText = (audience = {}) => {
  const labels = [];
  if (audience.allUsers) labels.push("Everyone");
  if (audience.roles?.length) labels.push(audience.roles.join(", "));
  if (audience.classes?.length) labels.push(`${audience.classes.length} class${audience.classes.length === 1 ? "" : "es"}`);
  if (audience.sections?.length) labels.push(`${audience.sections.length} section${audience.sections.length === 1 ? "" : "s"}`);
  return labels.join(" · ") || "No audience selected";
};

export default function AnnouncementDetailView({ announcement, statistics, statisticsLoading }) {
  const navigate = useNavigate();
  const archive = useArchiveAnnouncement();
  const cancel = useCancelAnnouncement();
  const expire = useExpireAnnouncement();
  const statusStyle = STATUS_STYLES[announcement.status] || STATUS_STYLES.draft;
  const priorityStyle = PRIORITY_STYLES[announcement.priority] || PRIORITY_STYLES.normal;
  const runAction = async (name, mutation) => {
    if (!window.confirm(`${name} this announcement?`)) return;
    try { await mutation.mutateAsync(announcement.id); navigate("/admin/announcements"); } catch { /* Axios error remains available to the enclosing page after refetch. */ }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 max-w-4xl">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>{statusStyle.label}</span><span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.accent}`}>{priorityStyle.label}</span></div>
        <h1 className="text-xl font-bold text-gray-900 mb-5">{announcement.title}</h1>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-sm"><div><p className="text-xs text-gray-400">Audience</p><p className="font-medium text-gray-800 mt-0.5 capitalize">{audienceText(announcement.audience)}</p></div><div><p className="text-xs text-gray-400">Author</p><p className="font-medium text-gray-800 mt-0.5">{announcement.authorName}</p></div><div><p className="text-xs text-gray-400">Created</p><p className="font-medium text-gray-800 mt-0.5">{formatDate(announcement.createdAt)}</p></div><div><p className="text-xs text-gray-400">Published / scheduled</p><p className="font-medium text-gray-800 mt-0.5">{formatDate(announcement.publishedAt || announcement.scheduledFor)}</p></div><div><p className="text-xs text-gray-400">Expires</p><p className="font-medium text-gray-800 mt-0.5">{formatDate(announcement.expiresAt)}</p></div></div>
        {announcement.status !== "draft" && statistics && <div className="border-t border-gray-100 pt-5 mb-6"><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Readership</p><div className="grid grid-cols-3 gap-4 text-center"><div><p className="text-2xl font-bold text-gray-900">{statistics.totalRecipients.toLocaleString()}</p><p className="text-xs text-gray-400">Recipients</p></div><div><p className="text-2xl font-bold text-emerald-600">{statistics.read.toLocaleString()}</p><p className="text-xs text-gray-400">Read</p></div><div><p className="text-2xl font-bold text-sky-600">{statistics.readPercentage}%</p><p className="text-xs text-gray-400">Read rate</p></div></div></div>}
        {statisticsLoading && <p className="text-sm text-gray-400">Loading readership statistics...</p>}
        <div className="border-t border-gray-100 pt-5"><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Content</p><div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: announcement.content }} /></div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-gray-100"><div className="flex gap-2">{announcement.status === "scheduled" && <button type="button" onClick={() => runAction("Cancel", cancel)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-rose-200 text-sm text-rose-600"><Ban className="w-4 h-4" />Cancel schedule</button>}{announcement.status === "published" && <><button type="button" onClick={() => runAction("Archive", archive)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600"><Archive className="w-4 h-4" />Archive</button><button type="button" onClick={() => runAction("Expire", expire)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-200 text-sm text-amber-700"><XCircle className="w-4 h-4" />Expire</button></>}</div>{["draft", "scheduled"].includes(announcement.status) && <button type="button" onClick={() => navigate(`/admin/announcements/${announcement.id}/edit`)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium"><Pencil className="w-4 h-4" />Edit</button>}<span className="sr-only"><Clock3 /></span></div>
    </div>
  );
}
