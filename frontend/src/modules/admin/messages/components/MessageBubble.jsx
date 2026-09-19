import { Paperclip, Check, CheckCheck } from "lucide-react";

export default function MessageBubble({ message }) {
  const isMe = message.senderId === "me";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-md ${isMe ? "items-end" : "items-start"} flex flex-col`}
      >
        {message.type === "file" ? (
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${isMe ? "bg-indigo-50 border-indigo-100" : "bg-gray-50 border-gray-100"}`}
          >
            <Paperclip className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-indigo-600">
                {message.fileName}
              </p>
              <p className="text-xs text-gray-400">{message.fileSize}</p>
            </div>
          </div>
        ) : (
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${isMe ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"}`}
          >
            {message.text}
          </div>
        )}
        <div className="flex items-center gap-1 mt-1 px-1">
          <span className="text-xs text-gray-400">
            {new Date(message.sentAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
          {isMe &&
            message.status &&
            (message.status === "read" ? (
              <CheckCheck className="w-3.5 h-3.5 text-indigo-500" />
            ) : (
              <Check className="w-3.5 h-3.5 text-gray-300" />
            ))}
        </div>
      </div>
    </div>
  );
}
