import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as attendanceApi from "../api/attendanceApi";
import { makeResourceKeys } from "@shared/api/queryKeys";

const attendanceKeys = makeResourceKeys("attendance");

export function useAttendanceTrend() {
  return useQuery({
    queryKey: [...attendanceKeys.all, "trend"],
    queryFn: attendanceApi.getAttendanceTrend,
  });
}

export function useTodayBreakdown() {
  return useQuery({
    queryKey: [...attendanceKeys.all, "today-breakdown"],
    queryFn: attendanceApi.getTodayBreakdown,
  });
}

export function useAttendanceRecords(filters = {}) {
  return useQuery({
    queryKey: attendanceKeys.list(filters),
    queryFn: () => attendanceApi.getAttendanceRecords(filters),
  });
}

export function useSetAttendanceStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) =>
      attendanceApi.setAttendanceStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateAllAttendanceViews(queryClient);
    },
  });
}

export function useAttendanceStats() {
  return useQuery({
    queryKey: [...attendanceKeys.all, "stats"],
    queryFn: attendanceApi.getAttendanceStats,
  });
}

function invalidateAllAttendanceViews(queryClient) {
  queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
  queryClient.invalidateQueries({ queryKey: [...attendanceKeys.all, "stats"] });
  queryClient.invalidateQueries({
    queryKey: [...attendanceKeys.all, "today-breakdown"],
  });
}

export function useBulkMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ date, entries }) =>
      attendanceApi.bulkMarkAttendance(date, entries),
    onSuccess: () => invalidateAllAttendanceViews(queryClient),
  });
}

export function useBulkUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }) =>
      attendanceApi.bulkUpdateStatus(ids, status),
    onSuccess: () => invalidateAllAttendanceViews(queryClient),
  });
}
