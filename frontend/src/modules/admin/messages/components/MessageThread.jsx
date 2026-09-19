import { MessageSquare, Star, Archive, Trash2 } from "lucide-react";
import Avatar from "@shared/components/Avatar";
import RoleTag from "./RoleTag";
import MessageBubble from "./MessageBubble";
import MessageComposer from "./MessageComposer";
import {
  useConversationThread,
  useSendReply,
  useToggleStar,
  useToggleArchive,
} from "../hooks/useMessages";

export default function MessageThread({ conversationId, onStartNew }) {
  const { data, isLoading } = useConversationThread(conversationId);
  const sendReply = useSendReply();
  const toggleStar = useToggleStar();
  const toggleArchive = useToggleArchive();

  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <MessageSquare className="w-7 h-7 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-900">Select a conversation</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-xs">
          Choose a conversation from the left to view messages.
        </p>
        <button
          onClick={onStartNew}
          className="mt-4 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
        >
          Or start a new message
        </button>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
        Loading conversation...
      </div>
    );
  }

  const { conversation, messages } = data;

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Avatar name={conversation.participantName} colorful />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {conversation.participantName}
              </span>
              <RoleTag role={conversation.role} />
            </div>
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              {conversation.isOnline && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
              {conversation.isOnline ? "Active now" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleStar.mutate(conversationId)}
            className="p-2 rounded-lg hover:bg-gray-50"
          >
            <Star
              className={`w-4 h-4 ${conversation.isStarred ? "fill-amber-400 text-amber-400" : "text-gray-400"}`}
            />
          </button>
          <button
            onClick={() => toggleArchive.mutate(conversationId)}
            className="p-2 rounded-lg hover:bg-gray-50"
          >
            <Archive className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-50">
            <Trash2 className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-8">
            No messages yet — say hello.
          </p>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
        )}
      </div>

      <MessageComposer
        isSending={sendReply.isPending}
        onSend={({ text, attachment }) =>
          sendReply.mutate({ conversationId, text, attachment })
        }
      />
    </div>
  );
}
