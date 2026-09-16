import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as attendanceApi from "../api/attendanceApi";
import { makeResourceKeys } from "@shared/api/queryKeys";

const reportKeys = makeResourceKeys("attendances");
const section = (name, filters) => [...reportKeys.all, name, filters];

export function useAttendanceReportOverview() {
  return useQuery({
    queryKey: reportKeys.detail("overview"),
    queryFn: attendanceApi.getAttendanceOverview,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAttendanceTrend(filters) {
  return useQuery({
    queryKey: section("trend", filters),
    queryFn: () => attendanceApi.getAttendanceTrend(filters),
  });
}
export function useMonthlyBreakdown(filters) {
  return useQuery({
    queryKey: section("monthly", filters),
    queryFn: () => attendanceApi.getMonthlyBreakdown(filters),
  });
}
export function useGradeSummary(filters) {
  return useQuery({
    queryKey: section("gradeSummary", filters),
    queryFn: () => attendanceApi.getGradeSummary(filters),
  });
}
export function useDetailedAttendanceRecords(filters) {
  return useQuery({
    queryKey: section("detailed", filters),
    queryFn: () => attendanceApi.getDetailedAttendanceRecords(filters),
  });
}
export function useChronicAbsentees(filters) {
  return useQuery({
    queryKey: section("chronicAbsentees", filters),
    queryFn: () => attendanceApi.getChronicAbsentees(filters),
  });
}