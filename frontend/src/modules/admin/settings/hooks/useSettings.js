import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as settingsApi from "../api/settingsApi";
import { makeResourceKeys } from "@shared/api/queryKeys";

const settingsKeys = makeResourceKeys("generalSettings");

export function useGeneralSettings() {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: settingsApi.getGeneralSettings,
  });
}

export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateGeneralSettings,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: settingsKeys.all }),
  });
}
