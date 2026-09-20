import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as announcementsApi from "../api/announcementsApi";
import { makeResourceKeys } from "@shared/api/queryKeys";

const announcementKeys = makeResourceKeys("announcements");

export function useAnnouncements(filters) {
  return useQuery({
    queryKey: announcementKeys.list(filters),
    queryFn: () => announcementsApi.getAnnouncements(filters),
  });
}

export function useAnnouncement(id) {
  return useQuery({
    queryKey: announcementKeys.detail(id),
    queryFn: () => announcementsApi.getAnnouncementById(id),
    enabled: Boolean(id),
  });
}

function invalidateAll(queryClient) {
  queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
  queryClient.invalidateQueries({ queryKey: announcementKeys.details() });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: announcementsApi.createAnnouncement,
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) =>
      announcementsApi.updateAnnouncement(id, payload),
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useArchiveAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: announcementsApi.archiveAnnouncement,
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: announcementsApi.deleteAnnouncement,
    onSuccess: () => invalidateAll(queryClient),
  });
}
