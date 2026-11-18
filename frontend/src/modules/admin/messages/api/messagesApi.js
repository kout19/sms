import apiAxios from "@shared/api/axios";

const BASE = "/messages";

const getPayload = (response) => response.data?.data;

const mapConversation = (conversation, currentUserId) => {
  const participants = conversation.participants || [];
  const otherParticipants = participants.filter(
    (participant) => participant.id !== currentUserId,
  );
  const participantName =
    otherParticipants.map((participant) => participant.name).join(", ") ||
    conversation.participantName ||
    "Unknown participant";

  return {
    ...conversation,
    participantName,
    role:
      conversation.role ||
      (otherParticipants.length === 1 ? otherParticipants[0].role : null),
    preview: conversation.preview || "",
    lastMessageAt: conversation.lastMessageAt || conversation.createdAt,
    unreadCount: Number(conversation.unreadCount || 0),
    isArchived: Boolean(conversation.isArchived),
    isOnline: false,
  };
};

export const getConversations = async (
  { folder = "all", search = "", role = "", page = 1, limit = 20 } = {},
  currentUserId,
  { signal } = {},
) => {
  const sent = folder === "sent";
  const params = { search, page, limit };
  if (role) params.role = role;
  if (!sent) {
    params.tab = folder === "unread" || folder === "archived" ? folder : "all";
  }
  const response = await apiAxios.get(sent ? BASE + "/sent" : BASE + "/inbox", {
    params,
    signal,
  });
  return {
    data: (response.data?.data || []).map((item) =>
      mapConversation(item, currentUserId),
    ),
    meta: response.data?.meta || { page, limit, total: 0, totalPages: 0 },
  };
};

export const getConversationThread = async (
  conversationId,
  currentUserId,
  { signal } = {},
) => {
  const response = await apiAxios.get(BASE + "/thread/" + conversationId, {
    signal,
  });
  const thread = getPayload(response);
  return {
    conversation: mapConversation(thread.conversation, currentUserId),
    messages: (thread.messages || []).map((message) => ({
      ...message,
      text: message.body,
      sentAt: message.createdAt,
      isMine: message.senderId === currentUserId,
    })),
  };
};

export const sendReply = async (conversationId, { text }) => {
  const response = await apiAxios.post(BASE + "/" + conversationId + "/reply", {
    body: text,
  });
  return getPayload(response);
};

export const createConversation = async ({ recipientIds, subject, text }) => {
  const response = await apiAxios.post(BASE, {
    recipientIds,
    subject,
    body: text,
  });
  return getPayload(response);
};

export const setArchiveState = async (conversationId, isArchived) => {
  const action = isArchived ? "archive" : "unarchive";
  const response = await apiAxios.patch(
    BASE + "/" + conversationId + "/" + action,
  );
  return getPayload(response);
};

export const markAsRead = async (conversationId) => {
  const response = await apiAxios.patch(
    BASE + "/" + conversationId + "/read",
  );
  return getPayload(response);
};

export const markAsUnread = async (conversationId) => {
  const response = await apiAxios.patch(
    BASE + "/" + conversationId + "/unread",
  );
  return getPayload(response);
};

export const moveToTrash = async (conversationId) => {
  const response = await apiAxios.delete(BASE + "/" + conversationId);
  return getPayload(response);
};

export const getUnreadCount = async ({ signal } = {}) => {
  const response = await apiAxios.get(BASE + "/unread-count", { signal });
  return Number(getPayload(response)?.count || 0);
};

export const searchDirectory = async (role, search = "", { signal } = {}) => {
  const response = await apiAxios.get(BASE + "/recipients", {
    params: { role, search, limit: 50 },
    signal,
  });
  return getPayload(response) || [];
};
