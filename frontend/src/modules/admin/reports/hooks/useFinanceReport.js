import { useQuery } from "@tanstack/react-query";
import { makeResourceKeys } from "@shared/api/queryKeys";
import * as financeapi from "../api/financeApi";

const reportKeys = makeResourceKeys("reports");
const section = (name, filters) => [...reportKeys.all, name, filters ?? {}];

export function useFinanceReportOverview(filters) {
  return useQuery({
    queryKey: section("financeOverview", filters),
    queryFn: () => financeapi.getFinanceOverview(filters),
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