import { useQuery } from "@tanstack/react-query";
import * as reportsApi from "../api/reportApi";
import { makeResourceKeys } from "@shared/api/queryKeys";

const reportKeys = makeResourceKeys("academicReports");
const section = (name, filters) => [...reportKeys.all, name, filters];

export function useAcademicOverview(filters) {
  return useQuery({
    queryKey: section("overview", filters),
    queryFn: () => reportsApi.getAcademicOverview(filters),
  });
}
export function useScoreTrend(filters) {
  return useQuery({
    queryKey: section("trend", filters),
    queryFn: () => reportsApi.getScoreTrend(filters),
  });
}
export function usePassFailDistribution(filters) {
  return useQuery({
    queryKey: section("passFail", filters),
    queryFn: () => reportsApi.getPassFailDistribution(filters),
  });
}
export function useSubjectPerformance(filters) {
  return useQuery({
    queryKey: section("subjects", filters),
    queryFn: () => reportsApi.getSubjectPerformance(filters),
  });
}
export function useGradePerformance(filters) {
  return useQuery({
    queryKey: section("grades", filters),
    queryFn: () => reportsApi.getGradePerformance(filters),
  });
}
export function useTopPerformers(filters) {
  return useQuery({
    queryKey: section("topPerformers", filters),
    queryFn: () => reportsApi.getTopPerformers(filters),
  });
}
export function useAtRiskStudents(filters) {
  return useQuery({
    queryKey: section("atRisk", filters),
    queryFn: () => reportsApi.getAtRiskStudents(filters),
  });
}

export function useDetailedRecords(filters) {
  return useQuery({
    queryKey: section("detailed", filters),
    queryFn: () => reportsApi.getDetailedRecords(filters),
  });
}