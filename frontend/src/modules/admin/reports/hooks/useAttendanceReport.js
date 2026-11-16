import { useQuery } from "@tanstack/react-query";
import * as attendanceApi from "../api/attendanceApi";
import { attendanceKeys } from "@shared/api/queryKeys";

export const attendanceReportKeys = {
  options: [...attendanceKeys.all, "report-options"],
  report: (filters) => [...attendanceKeys.all, "report", filters],
  students: (params) => [...attendanceKeys.all, "report-students", params],
  records: (params) => [...attendanceKeys.all, "report-records", params],
  detail: (params) => [...attendanceKeys.all, "report-detail", params],
};

export function useAttendanceReportOptions() {
  return useQuery({
    queryKey: attendanceReportKeys.options,
    queryFn: attendanceApi.getAttendanceReportOptions,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAttendanceReport(filters, enabled = true) {
  return useQuery({
    queryKey: attendanceReportKeys.report(filters),
    queryFn: () => attendanceApi.getAttendanceReport(filters),
    enabled,
  });
}

export function useAttendanceReportStudents(params, enabled = true) {
  return useQuery({
    queryKey: attendanceReportKeys.students(params),
    queryFn: () => attendanceApi.getAttendanceReportStudents(params),
    enabled,
  });
}

export function useAttendanceReportRecords(params, enabled = true) {
  return useQuery({
    queryKey: attendanceReportKeys.records(params),
    queryFn: () => attendanceApi.getAttendanceReportRecords(params),
    enabled,
  });
}

export function useAttendanceReportDetail(params, enabled = true) {
  return useQuery({
    queryKey: attendanceReportKeys.detail(params),
    queryFn: () => attendanceApi.getAttendanceReportDetail(params),
    enabled,
  });
}
