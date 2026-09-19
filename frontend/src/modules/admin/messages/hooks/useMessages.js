import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as messagesApi from "../api/messagesApi";
import { makeResourceKeys } from "@shared/api/queryKeys";

const messageKeys = makeResourceKeys("messages");

export function useConversations(filters) {
  return useQuery({
    queryKey: messageKeys.list(filters),
    queryFn: () => messagesApi.getConversations(filters),
  });
}

export function useConversationThread(conversationId) {
  return useQuery({
    queryKey: messageKeys.detail(conversationId),
    queryFn: () => messagesApi.getConversationThread(conversationId),
    enabled: Boolean(conversationId),
  });
}

export function useSendReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, text, attachment }) =>
      messagesApi.sendReply(conversationId, { text, attachment }),
    onSuccess: (_data, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.detail(conversationId),
      });
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.createConversation,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() }),
  });
}

export function useToggleStar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.toggleStar,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() }),
  });
}

export function useToggleArchive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.toggleArchive,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() }),
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.markAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() }),
  });
}

export function useDirectorySearch(role, query) {
  return useQuery({
    queryKey: [...messageKeys.all, "directory", role, query],
    queryFn: () => messagesApi.searchDirectory(role, query),
    enabled: Boolean(role),
  });
}
