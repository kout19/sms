import { useState, useRef } from "react";
import { Paperclip, Send } from "lucide-react";

export default function MessageComposer({ onSend, isSending }) {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() && !attachment) return;
    onSend({ text: text.trim(), attachment });
    setText("");
    setAttachment(null);
  };

  return (
    <div className="border-t border-gray-100 p-4">
      {attachment && (
        <div className="flex items-center justify-between mb-2 px-3 py-2 bg-gray-50 rounded-lg text-sm">
          <span className="text-gray-600 truncate">{attachment.name}</span>
          <button
            onClick={() => setAttachment(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 flex-shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) =>
            e.target.files[0] &&
            setAttachment({
              name: e.target.files[0].name,
              size: `${Math.round(e.target.files[0].size / 1024)} KB`,
            })
          }
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSend}
          disabled={isSending || (!text.trim() && !attachment)}
          className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
