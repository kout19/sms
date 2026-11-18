import { useState } from "react";
import { Send } from "lucide-react";

export default function MessageComposer({ onSend, isSending }) {
  const [text, setText] = useState("");

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    try {
      await onSend({ text: trimmed });
      setText("");
    } catch {
      // The thread displays the mutation error and keeps the draft text here.
    }
  };

  return (
    <div className="border-t border-gray-100 p-4">
      <div className="flex items-end gap-2">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a reply..."
          rows={1}
          maxLength={20000}
          className="flex-1 resize-none px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isSending || !text.trim()}
          className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 flex-shrink-0"
          aria-label="Send reply"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
