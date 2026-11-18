import { useState } from "react";
import Modal from "@shared/components/AttendanceModal";
import { ROLE_TAG_STYLES } from "../utils/messageConstants";
import { useCreateConversation } from "../hooks/useMessages";
import RecipientPicker from "./RecipientPicker";

export default function NewMessageModal({ isOpen, onClose, onSent }) {
  const [role, setRole] = useState("teacher");
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const createConversation = useCreateConversation();

  const reset = () => {
    setRole("teacher");
    setRecipients([]);
    setSubject("");
    setText("");
    createConversation.reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSend = async () => {
    if (!recipients.length || !subject.trim() || !text.trim()) return;
    try {
      const result = await createConversation.mutateAsync({
        recipientIds: recipients.map((recipient) => recipient.id),
        subject: subject.trim(),
        text: text.trim(),
      });
      reset();
      onSent?.(result);
    } catch {
      // The API error is displayed in the form.
    }
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
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={
              createConversation.isPending ||
              !recipients.length ||
              !subject.trim() ||
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
        {createConversation.isError && (
          <p role="alert" className="text-sm text-rose-600">
            {createConversation.error?.response?.data?.message ||
              createConversation.error?.message ||
              "Your message could not be sent."}
          </p>
        )}
        <div>
          <label
            htmlFor="message-recipient-role"
            className="text-sm font-medium text-gray-700 block mb-1.5"
          >
            Recipient Type
          </label>
          <select
            id="message-recipient-role"
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
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
          <label
            htmlFor="message-subject"
            className="text-sm font-medium text-gray-700 block mb-1.5"
          >
            Subject <span className="text-rose-500">*</span>
          </label>
          <input
            id="message-subject"
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            maxLength={200}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="message-body"
            className="text-sm font-medium text-gray-700 block mb-1.5"
          >
            Message <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="message-body"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={5}
            maxLength={20000}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </Modal>
  );
}
