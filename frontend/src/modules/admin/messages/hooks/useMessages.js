import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as messagesApi from "../api/messagesApi";
import { makeResourceKeys } from "@shared/api/queryKeys";

const messageKeys = makeResourceKeys("messages");
const unreadCountKey = [...messageKeys.all, "unread-count"];

const invalidateMessages = (queryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: messageKeys.lists() }),
    queryClient.invalidateQueries({ queryKey: messageKeys.details() }),
    queryClient.invalidateQueries({ queryKey: unreadCountKey }),
  ]);

export function useConversations(filters, currentUserId) {
  return useQuery({
    queryKey: messageKeys.list({ ...filters, currentUserId }),
    queryFn: ({ signal }) =>
      messagesApi.getConversations(filters, currentUserId, { signal }),
    enabled: Boolean(currentUserId),
  });
}

export function useConversationThread(conversationId, currentUserId) {
  return useQuery({
    queryKey: [...messageKeys.details(), currentUserId, conversationId],
    queryFn: ({ signal }) =>
      messagesApi.getConversationThread(conversationId, currentUserId, {
        signal,
      }),
    enabled: Boolean(conversationId && currentUserId),
  });
}

export function useSendReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, text }) =>
      messagesApi.sendReply(conversationId, { text }),
    onSuccess: () => invalidateMessages(queryClient),
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.createConversation,
    onSuccess: invalidateMessages.bind(null, queryClient),
  });
}

export function useToggleArchive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, isArchived }) =>
      messagesApi.setArchiveState(conversationId, isArchived),
    onSuccess: invalidateMessages.bind(null, queryClient),
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.markAsRead,
    onSuccess: invalidateMessages.bind(null, queryClient),
  });
}

export function useMarkAsUnread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.markAsUnread,
    onSuccess: invalidateMessages.bind(null, queryClient),
  });
}

export function useMoveToTrash() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.moveToTrash,
    onSuccess: invalidateMessages.bind(null, queryClient),
  });
}

export function useUnreadMessageCount(currentUserId) {
  return useQuery({
    queryKey: [...unreadCountKey, currentUserId],
    queryFn: ({ signal }) => messagesApi.getUnreadCount({ signal }),
    refetchInterval: 60_000,
    enabled: Boolean(currentUserId),
  });
}

export function useDirectorySearch(role, search, currentUserId) {
  return useQuery({
    queryKey: [...messageKeys.all, "directory", currentUserId, role, search],
    queryFn: ({ signal }) =>
      messagesApi.searchDirectory(role, search, { signal }),
    enabled: Boolean(role && currentUserId),
  });
}
