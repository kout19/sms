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
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: [...attendanceKeys.all, "today-breakdown"],
      });
    },
  });
}
