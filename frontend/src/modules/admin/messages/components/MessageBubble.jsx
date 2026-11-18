export default function MessageBubble({ message, currentUserId }) {
  const isMe = message.senderId === currentUserId;
  return (
    <div className={"flex " + (isMe ? "justify-end" : "justify-start") + " mb-3"}>
      <div className={"max-w-md flex flex-col " + (isMe ? "items-end" : "items-start")}>
        {!isMe && message.sender?.name && (
          <span className="text-xs text-gray-500 mb-1 px-1">
            {message.sender.name}
          </span>
        )}
        <div
          className={
            "px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap break-words " +
            (isMe ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800")
          }
        >
          {message.text}
        </div>
        <span className="text-xs text-gray-400 mt-1 px-1">
          {new Date(message.sentAt).toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
