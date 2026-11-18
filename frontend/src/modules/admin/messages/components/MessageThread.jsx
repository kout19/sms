import { Archive, Inbox, MailOpen, MessageSquare, Trash2 } from "lucide-react";
import { useAuth } from "../../../auth/hooks/useAuth";
import Avatar from "@shared/components/Avatar";
import RoleTag from "./RoleTag";
import MessageBubble from "./MessageBubble";
import MessageComposer from "./MessageComposer";
import {
  useConversationThread,
  useSendReply,
  useToggleArchive,
  useMarkAsUnread,
  useMoveToTrash,
} from "../hooks/useMessages";

export default function MessageThread({
  conversationId,
  onStartNew,
  onDeleted,
}) {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useConversationThread(
    conversationId,
    user?.id,
  );
  const sendReply = useSendReply();
  const toggleArchive = useToggleArchive();
  const markUnread = useMarkAsUnread();
  const moveToTrash = useMoveToTrash();

  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <MessageSquare className="w-7 h-7 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-900">Select a conversation</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-xs">
          Choose a conversation from the left to view its messages.
        </p>
        <button
          type="button"
          onClick={onStartNew}
          className="mt-4 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
        >
          Or start a new message
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
        Loading conversation...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p role="alert" className="text-sm text-rose-600 px-6 text-center">
          {error?.response?.data?.message ||
            error?.message ||
            "This conversation could not be loaded."}
        </p>
      </div>
    );
  }

  const { conversation, messages } = data;
  const mutationError =
    sendReply.error ||
    toggleArchive.error ||
    markUnread.error ||
    moveToTrash.error;
  const errorMessage =
    mutationError?.response?.data?.message ||
    mutationError?.message ||
    "The message action could not be completed.";

  const handleArchive = () => {
    toggleArchive.mutate({
      conversationId,
      isArchived: !conversation.isArchived,
    });
  };

  const handleTrash = async () => {
    try {
      await moveToTrash.mutateAsync(conversationId);
      onDeleted?.();
    } catch {
      // The mutation error is shown above the thread.
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={conversation.participantName} colorful />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 truncate">
                {conversation.participantName}
              </span>
              <RoleTag role={conversation.role} />
            </div>
            <p className="text-xs text-gray-500 truncate">
              {conversation.subject}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {conversation.canManageInbox && (
            <>
              <button
                type="button"
                title={conversation.isArchived ? "Unarchive conversation" : "Archive conversation"}
                aria-label={conversation.isArchived ? "Unarchive conversation" : "Archive conversation"}
                disabled={toggleArchive.isPending}
                onClick={handleArchive}
                className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                {conversation.isArchived ? (
                  <Inbox className="w-4 h-4 text-gray-500" />
                ) : (
                  <Archive className="w-4 h-4 text-gray-500" />
                )}
              </button>
              {conversation.unreadCount === 0 && (
                <button
                  type="button"
                  title="Mark conversation as unread"
                  aria-label="Mark conversation as unread"
                  disabled={markUnread.isPending}
                  onClick={() => markUnread.mutate(conversationId)}
                  className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  <MailOpen className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </>
          )}
          <button
            type="button"
            title="Move conversation to trash"
            aria-label="Move conversation to trash"
            disabled={moveToTrash.isPending}
            onClick={handleTrash}
            className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {(sendReply.isError ||
        toggleArchive.isError ||
        markUnread.isError ||
        moveToTrash.isError) && (
        <p role="alert" className="px-6 py-2 text-sm text-rose-600">
          {errorMessage}
        </p>
      )}

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-8">
            No messages in this conversation yet.
          </p>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              currentUserId={user?.id}
            />
          ))
        )}
      </div>

      <MessageComposer
        isSending={sendReply.isPending}
        onSend={({ text }) => sendReply.mutateAsync({ conversationId, text })}
      />
    </div>
  );
}
