import { Eye, Pencil } from "lucide-react";
import { PRIORITY_STYLES } from "../utils/announcementConstants";

const previewText = (html) => {
  if (typeof document === "undefined") return html.replace(/<[^>]*>/g, " ");
  const element = document.createElement("div");
  element.innerHTML = html;
  return element.textContent || element.innerText || "";
};

export default function AnnouncementPreview({ formData, onBackToEdit, onSaveDraft, isSaving }) {
  const priorityStyle = PRIORITY_STYLES[formData.priority];
  const audience = formData.audience || {};
  const targetCount = Number(Boolean(audience.allUsers)) + (audience.roles?.length || 0) + (audience.classIds?.length || 0) + (audience.sectionIds?.length || 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      <div className="flex items-center gap-2 px-6 py-3 bg-indigo-50 border-b border-indigo-100 text-sm text-indigo-700"><Eye className="w-4 h-4" /><span className="font-medium">Draft preview</span><span className="text-indigo-400">Recipient delivery has not occurred.</span></div>
      <div className="p-8"><article className={`bg-white rounded-xl border-t-4 shadow-sm p-6 max-w-2xl ${priorityStyle.accent}`}><div className="flex items-start justify-between gap-3"><h2 className="text-lg font-bold text-gray-900">{formData.title || "Untitled Announcement"}</h2><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>{priorityStyle.label}</span></div><p className="text-xs text-gray-400 mt-1">Draft · {targetCount || "No"} selected audience target{targetCount === 1 ? "" : "s"}</p><p className="whitespace-pre-wrap text-sm text-gray-700 mt-4 leading-relaxed">{previewText(formData.content) || "No content yet"}</p></article></div>
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100"><button type="button" onClick={onBackToEdit} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600"><Pencil className="w-4 h-4" />Back to Edit</button><button type="button" onClick={onSaveDraft} disabled={isSaving} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium disabled:opacity-50">{isSaving ? "Saving..." : "Save Draft"}</button></div>
    </div>
  );
}
