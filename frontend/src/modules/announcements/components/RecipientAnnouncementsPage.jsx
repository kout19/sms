import { useState } from "react";
import { Check, Megaphone, Plus, Search, X } from "lucide-react";
import PageHeader from "@shared/components/dashboard/PageHeader";
import SectionCard from "@shared/components/dashboard/SectionCard";
import RichTextEditor from "@shared/components/RichTextEditor";
import Pagination from "@shared/components/Pagination";
import AudienceSelector from "../../admin/announcements/components/AudienceSelector";
import {
  useAnnouncementAudienceOptions,
  useCreateAnnouncement,
  usePublishAnnouncement,
} from "../../admin/announcements/hooks/useAnnouncements";
import {
  useAnnouncementUnreadCount,
  useRecipientAnnouncement,
  useRecipientAnnouncements,
  useSetAnnouncementReadState,
} from "../hooks/useRecipientAnnouncements";

const emptyAudience = { allUsers: false, roles: [], classIds: [], sectionIds: [] };
const apiError = (error) => error?.response?.data?.message || error?.message || "Something went wrong.";
const formatted = (value) => value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "";

export default function RecipientAnnouncementsPage({ title = "Announcements", subtitle, accent = "indigo", allowPosting = false }) {
  const [filters, setFilters] = useState({ search: "", read: "all", priority: "all", page: 1, limit: 10 });
  const [selectedId, setSelectedId] = useState(null);
  const [showComposer, setShowComposer] = useState(false);
  const [composer, setComposer] = useState({ title: "", content: "", priority: "normal", audience: emptyAudience });
  const [composerError, setComposerError] = useState("");
  const inbox = useRecipientAnnouncements(filters);
  const detail = useRecipientAnnouncement(selectedId);
  const unread = useAnnouncementUnreadCount();
  const readState = useSetAnnouncementReadState();
  const audienceOptions = useAnnouncementAudienceOptions();
  const create = useCreateAnnouncement();
  const publish = usePublishAnnouncement();
  const update = (field, value) => setFilters((current) => ({ ...current, [field]: value, page: field === "page" ? value : 1 }));
  const open = (id) => setSelectedId(id);
  const hasAudience = () => composer.audience.allUsers || composer.audience.roles.length || composer.audience.classIds.length || composer.audience.sectionIds.length;
  const submitPost = async () => {
    setComposerError("");
    if (!composer.title.trim() || !composer.content.trim() || !hasAudience()) { setComposerError("Enter a title, message, and at least one assigned class or section."); return; }
    try {
      const announcement = await create.mutateAsync(composer);
      await publish.mutateAsync(announcement.id);
      setComposer({ title: "", content: "", priority: "normal", audience: emptyAudience });
      setShowComposer(false);
    } catch (error) { setComposerError(apiError(error)); }
  };
  const selected = detail.data;

  return <div className="p-6 w-full bg-gray-50 min-h-full space-y-6">
    <PageHeader icon={Megaphone} title={title} subtitle={subtitle} accent={accent} action={allowPosting ? <button type="button" onClick={() => setShowComposer((value) => !value)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium"><Plus className="w-4 h-4" />New announcement</button> : undefined} />
    {allowPosting && showComposer && <SectionCard title="Post to assigned classes"><div className="space-y-4"><input value={composer.title} onChange={(event) => setComposer({ ...composer, title: event.target.value })} placeholder="Announcement title" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" /><RichTextEditor value={composer.content} onChange={(content) => setComposer({ ...composer, content })} placeholder="Write your message..." /><div><p className="text-sm font-medium text-gray-700 mb-2">Audience</p>{audienceOptions.isLoading ? <p className="text-sm text-gray-400">Loading assigned sections...</p> : <AudienceSelector value={composer.audience} onChange={(audience) => setComposer({ ...composer, audience })} options={audienceOptions.data} />}</div>{composerError && <p role="alert" className="text-sm text-rose-600">{composerError}</p>}<div className="flex gap-3"><button type="button" onClick={() => setShowComposer(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button><button type="button" disabled={create.isPending || publish.isPending} onClick={submitPost} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm disabled:opacity-50">{create.isPending || publish.isPending ? "Publishing..." : "Publish"}</button></div></div></SectionCard>}
    <SectionCard badge={`${unread.data?.count || 0} unread`}><div className="flex flex-wrap gap-3 mb-4"><div className="relative flex-1 min-w-[220px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={filters.search} onChange={(event) => update("search", event.target.value)} placeholder="Search announcements" className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm" /></div><select value={filters.read} onChange={(event) => update("read", event.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm"><option value="all">All</option><option value="unread">Unread</option><option value="read">Read</option></select><select value={filters.priority} onChange={(event) => update("priority", event.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm"><option value="all">All priorities</option><option value="normal">Normal</option><option value="important">Important</option><option value="urgent">Urgent</option></select></div>{inbox.isLoading && <p className="py-8 text-sm text-gray-400">Loading announcements...</p>}{inbox.isError && <p className="py-8 text-sm text-rose-600">{apiError(inbox.error)} <button type="button" onClick={() => inbox.refetch()} className="underline">Retry</button></p>}{!inbox.isLoading && !inbox.isError && inbox.data?.data?.length === 0 && <p className="py-8 text-sm text-gray-400">You have no announcements matching these filters.</p>}{inbox.data?.data?.map((announcement) => <button type="button" key={announcement.id} onClick={() => open(announcement.id)} className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border mb-3 transition-colors ${announcement.recipient?.readAt ? "bg-white border-slate-100 hover:bg-slate-50" : "bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50"}`}><div className="flex items-center justify-center w-9 h-9 bg-indigo-100 rounded-full shrink-0"><Megaphone className="w-4 h-4 text-indigo-600" /></div><span className="flex-1 min-w-0"><span className="flex items-center justify-between gap-3"><span className="font-medium text-sm text-slate-800 truncate">{announcement.title}</span>{!announcement.recipient?.readAt && <span className="text-[10px] uppercase font-semibold text-indigo-600">New</span>}</span><span className="block text-xs text-slate-500 mt-1">{announcement.authorName} · {formatted(announcement.publishedAt)}</span></span></button>)}<Pagination page={inbox.data?.meta?.page || filters.page} pageSize={inbox.data?.meta?.limit || filters.limit} total={inbox.data?.meta?.total || 0} onPageChange={(page) => update("page", page)} /></SectionCard>
    {selectedId && <div className="fixed inset-0 z-50 bg-slate-900/40 p-4 flex items-center justify-center"><div role="dialog" aria-modal="true" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"><div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100"><div><p className="text-xs font-semibold uppercase text-indigo-600">{selected?.priority || "normal"}</p><h2 className="text-xl font-bold text-slate-900">{selected?.title || "Loading..."}</h2><p className="text-sm text-slate-500 mt-1">{selected && `${selected.authorName} · ${formatted(selected.publishedAt)}`}</p></div><button type="button" onClick={() => setSelectedId(null)} aria-label="Close announcement" className="p-1 text-slate-500"><X /></button></div><div className="p-6">{detail.isLoading && <p className="text-sm text-gray-400">Loading announcement...</p>}{detail.isError && <p className="text-sm text-rose-600">{apiError(detail.error)}</p>}{selected && <div className="prose prose-sm max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: selected.content }} />}</div>{selected && <div className="flex justify-end gap-3 p-4 border-t border-gray-100"><button type="button" disabled={readState.isPending} onClick={() => readState.mutate({ id: selected.id, read: !selected.recipient?.readAt })} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700"><Check className="w-4 h-4" />Mark as {selected.recipient?.readAt ? "unread" : "read"}</button></div>}</div></div>}
  </div>;
}
