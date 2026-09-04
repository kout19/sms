import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as accountantApi from "../api/accountantsApi";
import { accountantKeys, transactionKeys } from "../../../../shared/api/queryKeys"; // if not exported yet, see note below

// const accountantKeys = makeResourceKeys("accountants");
// const transactionKeys = makeResourceKeys("transactions");

export function useFinanceOverview() {
  return useQuery({
    queryKey: [...accountantKeys.all, "overview"],
    queryFn: accountantApi.getFinanceOverview,
  });
}

export function useAccountants(filters = {}) {
  return useQuery({
    queryKey: accountantKeys.list(filters),
    queryFn: () => accountantApi.getAllAccountants(filters),
  });
}

export function useToggleAccountantStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountantApi.toggleAccountantStatus,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: accountantKeys.lists() }),
  });
}

export function useRecentTransactions(limit = 6) {
  return useQuery({
    queryKey: transactionKeys.list({ limit }),
    queryFn: () => accountantApi.getRecentTransactions(limit),
  });
}
