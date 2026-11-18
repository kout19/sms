import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "@shared/components/RichTextEditor";
import { PRIORITY_STYLES } from "../utils/announcementConstants";
import {
  useAnnouncement,
  useAnnouncementAudienceOptions,
  useCreateAnnouncement,
  usePublishAnnouncement,
  useRevertAnnouncementToDraft,
  useScheduleAnnouncement,
  useUpdateAnnouncement,
} from "../hooks/useAnnouncements";
import AnnouncementPreview from "../components/AnnouncementPreview";
import AudienceSelector from "../components/AudienceSelector";

const emptyAudience = { allUsers: false, roles: [], classIds: [], sectionIds: [] };
const EMPTY_FORM = { title: "", content: "", priority: "normal", expiresAt: "", audience: emptyAudience };

const asLocalDateTime = (date) => {
  if (!date) return "";
  const value = new Date(date);
  const pad = (part) => String(part).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
};
const plainText = (value) => String(value || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const apiError = (error) => error?.response?.data?.message || error?.message || "Unable to save this announcement.";

export default function AnnouncementFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const { data: existing, isLoading: isLoadingAnnouncement, error: loadError } = useAnnouncement(id);
  const { data: audienceOptions, isLoading: isLoadingAudience, error: audienceError } = useAnnouncementAudienceOptions();
  const create = useCreateAnnouncement();
  const update = useUpdateAnnouncement();
  const publish = usePublishAnnouncement();
  const schedule = useScheduleAnnouncement();
  const revert = useRevertAnnouncementToDraft();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [publishOption, setPublishOption] = useState("draft");
  const [scheduledFor, setScheduledFor] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!existing) return;
    setFormData({
      title: existing.title || "",
      content: existing.content || "",
      priority: existing.priority || "normal",
      expiresAt: asLocalDateTime(existing.expiresAt),
      audience: {
        allUsers: Boolean(existing.audience?.allUsers),
        roles: existing.audience?.roles || [],
        classIds: (existing.audience?.classes || []).map((item) => item.id),
        sectionIds: (existing.audience?.sections || []).map((item) => item.id),
      },
    });
    setPublishOption(existing.status === "scheduled" ? "schedule" : existing.status === "published" ? "now" : "draft");
    setScheduledFor(asLocalDateTime(existing.scheduledFor));
  }, [existing]);

  const payload = () => ({
    title: formData.title.trim(),
    content: formData.content,
    priority: formData.priority,
    expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
    audience: formData.audience,
  });

  const hasAudience = () => {
    const audience = formData.audience;
    return audience.allUsers || audience.roles.length || audience.classIds.length || audience.sectionIds.length;
  };

  const save = async (action = "draft") => {
    setError("");
    if (!formData.title.trim() || !plainText(formData.content) || !hasAudience()) {
      setError("Enter a title, message, and at least one audience target.");
      return;
    }
    if (action === "schedule" && !scheduledFor) {
      setError("Choose a future publication date and time.");
      return;
    }
    try {
      const announcement = isEditMode
        ? await update.mutateAsync({ id, payload: payload() })
        : await create.mutateAsync(payload());
      const announcementId = announcement.id;
      if (action === "draft" && existing?.status === "scheduled") await revert.mutateAsync(announcementId);
      if (action === "now") await publish.mutateAsync(announcementId);
      if (action === "schedule") await schedule.mutateAsync({ id: announcementId, scheduledFor: new Date(scheduledFor).toISOString() });
      navigate(`/admin/announcements/${announcementId}`);
    } catch (requestError) {
      setError(apiError(requestError));
    }
  };

  const isSaving = create.isPending || update.isPending || publish.isPending || schedule.isPending || revert.isPending;
  const locked = ["published", "expired", "archived", "cancelled"].includes(existing?.status);

  if (isEditMode && isLoadingAnnouncement) return <div className="p-6 text-sm text-gray-400">Loading announcement...</div>;
  if (loadError) return <div className="p-6 text-sm text-rose-600">{apiError(loadError)}</div>;
  if (showPreview) return <div className="p-6"><AnnouncementPreview formData={formData} onBackToEdit={() => setShowPreview(false)} onSaveDraft={() => save("draft")} isSaving={isSaving} /></div>;

  return (
    <div className="p-6 space-y-4 max-w-4xl">
      <p className="text-sm text-gray-400">Announcements <span className="mx-1">/</span><span className="text-gray-700 font-medium">{isEditMode ? "Edit Announcement" : "New Announcement"}</span></p>
      {error && <div role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {audienceError && <div role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{apiError(audienceError)}</div>}
      {locked && <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">Published content is immutable. Create a new announcement to publish a correction.</div>}

      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Basic Information</h3>
        <label className="block text-sm font-medium text-gray-700">Title <span className="text-rose-500">*</span><input disabled={locked} type="text" value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} className="mt-1.5 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:bg-gray-50" /></label>
        <div><p className="text-sm font-medium text-gray-700 mb-1.5">Content <span className="text-rose-500">*</span></p><RichTextEditor value={formData.content} onChange={(content) => setFormData({ ...formData, content })} placeholder="Write your announcement..." disabled={locked} /></div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Audience</h3>
        {isLoadingAudience ? <p className="text-sm text-gray-400">Loading eligible classes and sections...</p> : <AudienceSelector value={formData.audience} onChange={(audience) => setFormData({ ...formData, audience })} options={audienceOptions} disabled={locked} />}
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Priority and expiry</h3>
        <div className="grid grid-cols-3 gap-3">{Object.entries(PRIORITY_STYLES).map(([key, style]) => <button type="button" disabled={locked} key={key} onClick={() => setFormData({ ...formData, priority: key })} className={`px-4 py-2.5 rounded-lg border text-sm font-medium ${formData.priority === key ? `${style.bg} ${style.text} ${style.accent}` : "border-gray-200 text-gray-500"}`}>{style.label}</button>)}</div>
        <label className="block text-sm font-medium text-gray-700">Expire after <span className="font-normal text-gray-400">(optional)</span><input disabled={locked} type="datetime-local" value={formData.expiresAt} onChange={(event) => setFormData({ ...formData, expiresAt: event.target.value })} className="mt-1.5 block px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:bg-gray-50" /></label>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Publishing</h3>
        {!locked && <div className="space-y-2">{[
          { key: "draft", label: "Save as Draft", desc: "Save without publishing." },
          { key: "now", label: "Publish Now", desc: "Create the recipient snapshot and deliver immediately." },
          { key: "schedule", label: "Schedule", desc: "Publish later using the announcement worker." },
        ].map((option) => <label key={option.key} className={`flex items-start gap-3 px-4 py-3 rounded-lg border cursor-pointer ${publishOption === option.key ? "border-indigo-300 bg-indigo-50/40" : "border-gray-200"}`}><input type="radio" checked={publishOption === option.key} onChange={() => setPublishOption(option.key)} className="mt-0.5" /><span><span className="block text-sm font-medium text-gray-900">{option.label}</span><span className="block text-xs text-gray-400">{option.desc}</span></span></label>)}</div>}
        {publishOption === "schedule" && !locked && <input type="datetime-local" value={scheduledFor} onChange={(event) => setScheduledFor(event.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" />}
        <p className="text-sm text-gray-500">Attachments are not yet supported because this SMS has no shared file-storage service.</p>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100"><button type="button" onClick={() => navigate("/admin/announcements")} className="px-4 py-2 text-sm font-medium text-gray-600">Cancel</button><div className="flex items-center gap-3">{!locked && <button type="button" onClick={() => setShowPreview(true)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">Preview</button>}{!locked && <button type="button" onClick={() => save(publishOption)} disabled={isSaving || isLoadingAudience} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium disabled:opacity-50">{isSaving ? "Saving..." : publishOption === "now" ? "Publish" : publishOption === "schedule" ? "Schedule" : "Save Draft"}</button>}</div></div>
      </section>
    </div>
  );
}
