import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RichTextEditor from "@shared/components/RichTextEditor";
import FileDropzone from "@shared/components/FileDropzone";
import { AUDIENCE_OPTIONS, PRIORITY_STYLES } from "../utils/announcementConstants";
import {
  useAnnouncement,
  useCreateAnnouncement,
  useUpdateAnnouncement,
} from "../hooks/useAnnouncements";
import AnnouncementPreview from "../components/AnnouncementPreview";

const EMPTY_FORM = {
  title: "",
  content: "",
  audience: "everyone",
  priority: "normal",
  attachments: [],
};

export default function AnnouncementFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const { data: existing } = useAnnouncement(id);
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [publishOption, setPublishOption] = useState("draft"); // draft | now | schedule
  const [scheduledFor, setScheduledFor] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEditMode && existing) {
      setFormData({
        title: existing.title,
        content: existing.content,
        audience: existing.audience,
        priority: existing.priority,
        attachments: [],
      });
      setPublishOption(
        existing.status === "scheduled"
          ? "schedule"
          : existing.status === "published"
            ? "now"
            : "draft",
      );
      setScheduledFor(existing.scheduledFor || "");
    }
  }, [isEditMode, existing]);

  const buildStatus = () =>
    publishOption === "now"
      ? "published"
      : publishOption === "schedule"
        ? "scheduled"
        : "draft";

  const handleSave = async () => {
    const payload = {
      ...formData,
      status: buildStatus(),
      publishDate:
        publishOption === "now"
          ? new Date().toISOString().slice(0, 10)
          : publishOption === "schedule"
            ? scheduledFor?.slice(0, 10)
            : null,
      scheduledFor: publishOption === "schedule" ? scheduledFor : null,
    };

    if (isEditMode) {
      await updateAnnouncement.mutateAsync({ id, payload });
      navigate(`/admin/announcements/${id}`);
    } else {
      const created = await createAnnouncement.mutateAsync(payload);
      navigate(`/admin/announcements/${created.id}`);
    }
  };

  const isSaving = createAnnouncement.isPending || updateAnnouncement.isPending;

  if (showPreview) {
    return (
      <div className="p-6">
        <AnnouncementPreview
          formData={formData}
          onBackToEdit={() => setShowPreview(false)}
          onSaveDraft={handleSave}
          isSaving={isSaving}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 max-w-3xl">
      <p className="text-sm text-gray-400">
        Announcements <span className="mx-1">/</span>{" "}
        <span className="text-gray-700 font-medium">
          {isEditMode ? "Edit Announcement" : "New Announcement"}
        </span>
      </p>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Basic Information</h3>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Content <span className="text-rose-500">*</span>
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(html) => setFormData({ ...formData, content: html })}
            placeholder="Write your announcement..."
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Audience</h3>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Send to
          </label>
          <select
            value={formData.audience}
            onChange={(e) =>
              setFormData({ ...formData, audience: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
          >
            {AUDIENCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Priority</h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(PRIORITY_STYLES).map(([key, style]) => (
            <button
              key={key}
              onClick={() => setFormData({ ...formData, priority: key })}
              className={`px-4 py-2.5 rounded-lg border text-sm font-medium ${
                formData.priority === key
                  ? `${style.bg} ${style.text} ${style.accent}`
                  : "border-gray-200 text-gray-500"
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Attachments</h3>
        <FileDropzone
          files={formData.attachments}
          onChange={(files) => setFormData({ ...formData, attachments: files })}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          maxSizeMB={10}
          hint="PDF, DOC, DOCX, JPG, PNG up to 10MB"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Publishing</h3>
        <div className="space-y-2">
          {[
            {
              key: "draft",
              label: "Save as Draft",
              desc: "Save without publishing",
            },
            {
              key: "now",
              label: "Publish Now",
              desc: "Publish immediately to all recipients",
            },
            {
              key: "schedule",
              label: "Schedule",
              desc: "Set a date and time to auto-publish",
            },
          ].map((opt) => (
            <label
              key={opt.key}
              className={`flex items-start gap-3 px-4 py-3 rounded-lg border cursor-pointer ${publishOption === opt.key ? "border-indigo-300 bg-indigo-50/40" : "border-gray-200"}`}
            >
              <input
                type="radio"
                checked={publishOption === opt.key}
                onChange={() => setPublishOption(opt.key)}
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                <p className="text-xs text-gray-400">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
        {publishOption === "schedule" && (
          <input
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            onClick={() => navigate("/admin/announcements")}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !formData.title.trim()}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50"
            >
              {isSaving
                ? "Saving..."
                : publishOption === "now"
                  ? "Publish"
                  : publishOption === "schedule"
                    ? "Schedule"
                    : "Save Draft"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
