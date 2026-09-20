import { Eye, Pencil } from "lucide-react";
import { PRIORITY_STYLES } from "../utils/announcementConstants";

export default function AnnouncementPreview({
  formData,
  onBackToEdit,
  onSaveDraft,
  isSaving,
}) {
  const priorityStyle = PRIORITY_STYLES[formData.priority];

  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      <div className="flex items-center gap-2 px-6 py-3 bg-indigo-50 border-b border-indigo-100 text-sm text-indigo-700">
        <Eye className="w-4 h-4" />
        <span className="font-medium">Announcement Preview</span>
        <span className="text-indigo-400">
          — This is how recipients will see it
        </span>
      </div>

      <div className="p-8">
        <div
          className={`bg-white rounded-xl border-t-4 shadow-sm p-6 max-w-2xl ${priorityStyle.accent}`}
        >
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {formData.title || "Untitled Announcement"}
            </h2>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}
            >
              {priorityStyle.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Admin ·{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            · <span className="capitalize">{formData.audience}</span>
          </p>
          <div
            className="text-sm text-gray-700 mt-4 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: formData.content || "<em>No content yet</em>",
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <button
          onClick={onBackToEdit}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
        >
          <Pencil className="w-4 h-4" />
          Back to Edit
        </button>
        <button
          onClick={onSaveDraft}
          disabled={isSaving}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Draft"}
        </button>
      </div>
    </div>
  );
}
