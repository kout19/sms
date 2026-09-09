import { useQuery } from "@tanstack/react-query";
import * as reportsApi from "../api/reportApi"
// Import centralized keys from your query keys file
import { reportKeys, schoolHealthKeys } from "@shared/api/queryKeys";

const section = (name, filters) => [...reportKeys.all, name, filters];
/**
 * Fetch School Health Overview data
 */
export function useSchoolHealthOverview() {
  return useQuery({
    queryKey: schoolHealthKeys.detail("overview"), // Uses school-health resource keys: ['school-health', 'detail', 'overview']
    queryFn: reportsApi.getSchoolHealthOverview,
    staleTime: 5 * 60 * 1000,
  });
}


export function useQuickInsights() {
  return useQuery({
    queryKey: reportKeys.detail("quick-insights"), // Uses report resource keys: ['reports', 'detail', 'quick-insights']
    queryFn: reportsApi.getQuickInsights,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch Overview Report Cards data
 */
export function useReportOverview() {
  return useQuery({
    queryKey: reportKeys.detail("overview"), // Uses report resource keys: ['reports', 'detail', 'overview']
    queryFn: reportsApi.getReportOverview,
    staleTime: 5 * 60 * 1000,
  });
}

// export function useAcademicOverview(filters) {
//   return useQuery({
//     queryKey: section("overview", filters),
//     queryFn: () => reportsApi.getAcademicOverview(filters),
//   });
// }
// export function useScoreTrend(filters) {
//   return useQuery({
//     queryKey: section("trend", filters),
//     queryFn: () => reportsApi.getScoreTrend(filters),
//   });
// }
// export function usePassFailDistribution(filters) {
//   return useQuery({
//     queryKey: section("passFail", filters),
//     queryFn: () => reportsApi.getPassFailDistribution(filters),
//   });
// }
// export function useSubjectPerformance(filters) {
//   return useQuery({
//     queryKey: section("subjects", filters),
//     queryFn: () => reportsApi.getSubjectPerformance(filters),
//   });
// }
// export function useGradePerformance(filters) {
//   return useQuery({
//     queryKey: section("grades", filters),
//     queryFn: () => reportsApi.getGradePerformance(filters),
//   });
// }
// export function useTopPerformers(filters) {
//   return useQuery({
//     queryKey: section("topPerformers", filters),
//     queryFn: () => reportsApi.getTopPerformers(filters),
//   });
// }
// export function useAtRiskStudents(filters) {
//   return useQuery({
//     queryKey: section("atRisk", filters),
//     queryFn: () => reportsApi.getAtRiskStudents(filters),
//   });
// }
