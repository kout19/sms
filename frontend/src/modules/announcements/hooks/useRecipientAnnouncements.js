import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/recipientAnnouncementsApi";

const baseKey = ["recipient-announcements"];
const invalidate = (client) => {
  client.invalidateQueries({ queryKey: baseKey });
  client.invalidateQueries({ queryKey: ["announcements"] });
};

export function useRecipientAnnouncements(filters = {}) {
  return useQuery({ queryKey: [...baseKey, "list", filters], queryFn: ({ signal }) => api.getInbox(filters, { signal }) });
}

export function useRecipientAnnouncement(id) {
  return useQuery({ queryKey: [...baseKey, "detail", id], queryFn: ({ signal }) => api.getInboxAnnouncement(id, { signal }), enabled: Boolean(id) });
}

export function useAnnouncementUnreadCount() {
  return useQuery({ queryKey: [...baseKey, "unread-count"], queryFn: ({ signal }) => api.getUnreadCount({ signal }) });
}

export function useSetAnnouncementReadState() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, read }) => api.setReadState(id, read), onSuccess: () => invalidate(queryClient) });
}
