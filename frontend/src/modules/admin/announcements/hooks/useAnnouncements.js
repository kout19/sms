import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as announcementsApi from "../api/announcementsApi";
import { makeResourceKeys } from "@shared/api/queryKeys";

const announcementKeys = makeResourceKeys("announcements");
const audienceKey = ["announcements", "audience-options"];

const invalidateAnnouncements = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: announcementKeys.all });
  queryClient.invalidateQueries({ queryKey: ["recipient-announcements"] });
};

export function useAnnouncements(filters = {}) {
  return useQuery({
    queryKey: announcementKeys.list(filters),
    queryFn: ({ signal }) => announcementsApi.getAnnouncements(filters, { signal }),
  });
}

export function useAnnouncement(id) {
  return useQuery({
    queryKey: announcementKeys.detail(id),
    queryFn: ({ signal }) => announcementsApi.getAnnouncementById(id, { signal }),
    enabled: Boolean(id),
  });
}

export function useAnnouncementAudienceOptions(enabled = true) {
  return useQuery({
    queryKey: audienceKey,
    queryFn: ({ signal }) => announcementsApi.getAudienceOptions({ signal }),
    enabled,
    staleTime: 60_000,
  });
}

const mutation = (action) => () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: action,
    onSuccess: () => invalidateAnnouncements(queryClient),
  });
};

export const useCreateAnnouncement = mutation(announcementsApi.createAnnouncement);
export const useUpdateAnnouncement = mutation(({ id, payload }) => announcementsApi.updateAnnouncement(id, payload));
export const usePublishAnnouncement = mutation(announcementsApi.publishAnnouncement);
export const useScheduleAnnouncement = mutation(({ id, scheduledFor }) => announcementsApi.scheduleAnnouncement(id, scheduledFor));
export const useCancelAnnouncement = mutation(announcementsApi.cancelAnnouncement);
export const useRevertAnnouncementToDraft = mutation(announcementsApi.revertAnnouncementToDraft);
export const useArchiveAnnouncement = mutation(announcementsApi.archiveAnnouncement);
export const useExpireAnnouncement = mutation(announcementsApi.expireAnnouncement);

export function useAnnouncementStatistics(id) {
  return useQuery({
    queryKey: ["announcements", "statistics", id],
    queryFn: ({ signal }) => announcementsApi.getAnnouncementStatistics(id, { signal }),
    enabled: Boolean(id),
  });
}
