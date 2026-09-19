import { Star } from "lucide-react";
import Avatar from "@shared/components/Avatar";
import { formatRelativeTime } from "@shared/utils/formatRelativeTime";
import RoleTag from "./RoleTag";

export default function ConversationListItem({
  conversation,
  isActive,
  onClick,
  onToggleStar,
}) {
  const hasUnread = conversation.unreadCount > 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors ${
        isActive ? "bg-indigo-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <Avatar name={conversation.participantName} colorful />
          {conversation.isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-sm truncate ${hasUnread ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}
            >
              {conversation.participantName}
            </span>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {formatRelativeTime(conversation.lastMessageAt)}
            </span>
          </div>
          <div className="mt-0.5">
            <RoleTag role={conversation.role} />
          </div>
          <p
            className={`text-sm mt-1 truncate ${hasUnread ? "text-gray-700 font-medium" : "text-gray-400"}`}
          >
            {conversation.preview}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {hasUnread && (
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar();
            }}
            className="p-0.5"
          >
            <Star
              className={`w-4 h-4 ${conversation.isStarred ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
            />
          </button>
        </div>
      </div>
    </button>
  );
}
