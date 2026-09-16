import * as financeapi from "../api/financeApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeResourceKeys } from "@shared/api/queryKeys";
const reportKeys = makeResourceKeys("reports");
const section = (name, filters) => [...reportKeys.all, name, filters];
export function useFinanceReportOverview() {
  return useQuery({
    queryKey: reportKeys.detail("overview"),
    queryFn: financeapi.getFinanceOverview,
  });
}

export function useRevenueTrend(filters) {
  return useQuery({
    queryKey: section("trend", filters),
    queryFn: () => financeapi.getRevenueTrend(filters),
  });
}
export function useRevenueByFeeType(filters) {
  return useQuery({
    queryKey: section("byFeeType", filters),
    queryFn: () => financeapi.getRevenueByFeeType(filters),
  });
}
export function useExpensesByCategory(filters) {
  return useQuery({
    queryKey: section("expenses", filters),
    queryFn: () => financeapi.getExpensesByCategory(filters),
  });
}
export function useFeeCollectionRecords(filters) {
  return useQuery({
    queryKey: section("feeRecords", filters),
    queryFn: () => financeapi.getFeeCollectionRecords(filters),
  });
}