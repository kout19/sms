import { useState } from "react";
import { Paperclip } from "lucide-react";
import Modal from "@shared/components/AttendanceModal";
import { ROLE_TAG_STYLES } from "../utils/messageConstants";
import { useCreateConversation } from "../hooks/useMessages";
import RecipientPicker from "./RecipientPicker";

export default function NewMessageModal({ isOpen, onClose, onSent }) {
  const [role, setRole] = useState("teacher");
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const createConversation = useCreateConversation();

  const reset = () => {
    setRole("teacher");
    setRecipients([]);
    setSubject("");
    setText("");
    setAttachment(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSend = async () => {
    if (recipients.length === 0 || !text.trim()) return;
    await createConversation.mutateAsync({
      recipientIds: recipients.map((r) => r.id),
      role,
      subject: subject.trim(),
      text: text.trim(),
      attachment,
    });
    reset();
    onSent?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Message"
      subtitle="Send a message to members of your school community."
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Save Draft
          </button>
          <button
            onClick={handleSend}
            disabled={
              createConversation.isPending ||
              recipients.length === 0 ||
              !text.trim()
            }
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50"
          >
            {createConversation.isPending ? "Sending..." : "Send Message"}
          </button>
        </div>
      }
    >
      <div className="px-6 py-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Recipient Type
          </label>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setRecipients([]);
            }}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(ROLE_TAG_STYLES).map(([key, style]) => (
              <option key={key} value={key}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            To <span className="text-rose-500">*</span>
          </label>
          <RecipientPicker
            role={role}
            selected={recipients}
            onChange={setRecipients}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Message
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <label className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-gray-200 text-sm text-gray-500 cursor-pointer hover:border-gray-300">
          <Paperclip className="w-4 h-4" />
          {attachment ? attachment.name : "Click to attach a file"}
          <input
            type="file"
            className="hidden"
            onChange={(e) =>
              e.target.files[0] && setAttachment(e.target.files[0])
            }
          />
        </label>
        <p className="text-xs text-gray-400 -mt-3">
          PDF, DOCX, XLSX, PNG — max 20MB
        </p>
      </div>
    </Modal>
  );
}
