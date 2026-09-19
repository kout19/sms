import { useState } from "react";
import { Pencil } from "lucide-react";
import ConversationListSidebar from "../components/ConversationListSidebar";
import MessageThread from "../components/MessageThread";
import NewMessageModal from "../components/NewMessageModal";
import { useMarkAsRead } from "../hooks/useMessages";

export default function MessagesPage() {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const markAsRead = useMarkAsRead();

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    markAsRead.mutate(id);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">
            Communicate with teachers, parents, students, and staff
          </p>
        </div>
        <button
          onClick={() => setIsNewMessageOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
        >
          <Pencil className="w-4 h-4" />
          New Message
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        <ConversationListSidebar
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
        />
        <MessageThread
          conversationId={activeConversationId}
          onStartNew={() => setIsNewMessageOpen(true)}
        />
      </div>

      <NewMessageModal
        isOpen={isNewMessageOpen}
        onClose={() => setIsNewMessageOpen(false)}
        onSent={() => setIsNewMessageOpen(false)}
      />
    </div>
  );
}
