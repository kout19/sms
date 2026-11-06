import { useQuery } from "@tanstack/react-query";
import * as dashboardApi from "../api/dashboardApi";
import { overviewKeys } from "@shared/api/queryKeys";

export function useAdminOverview() {
  return useQuery({
    queryKey: overviewKeys.detail("admin"),
    queryFn: dashboardApi.getAdminOverview,
    staleTime: 5 * 60 * 1000,
  });
}
