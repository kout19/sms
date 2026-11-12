import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as accountantApi from "../api/accountantsApi";
import { accountantKeys } from "../../../../shared/api/queryKeys";

const normalizeListFilters = (filters = {}) => ({
  search: String(filters.search || "").trim().replace(/\s+/g, " "),
  status: ["active", "inactive"].includes(filters.status)
    ? filters.status
    : "all",
  page: Math.max(1, Number(filters.page) || 1),
  limit: Math.min(100, Math.max(1, Number(filters.limit) || 20)),
});

export function useAccountantOverview() {
  return useQuery({
    queryKey: [...accountantKeys.all, "overview"],
    queryFn: ({ signal }) => accountantApi.getAccountantOverview({ signal }),
    staleTime: 30 * 1000,
  });
}

export function useAccountants(filters = {}) {
  const normalized = normalizeListFilters(filters);
  return useQuery({
    queryKey: accountantKeys.list(normalized),
    queryFn: ({ signal }) =>
      accountantApi.getAllAccountants(normalized, { signal }),
    placeholderData: keepPreviousData,
  });
}

export function useAccountant(id, enabled = true) {
  return useQuery({
    queryKey: accountantKeys.detail(id),
    queryFn: ({ signal }) => accountantApi.getAccountantById(id, { signal }),
    enabled: Boolean(id) && enabled,
  });
}

const invalidateAccountants = (queryClient, id) => {
  queryClient.invalidateQueries({ queryKey: accountantKeys.lists() });
  queryClient.invalidateQueries({
    queryKey: [...accountantKeys.all, "overview"],
  });
  if (id) {
    queryClient.invalidateQueries({ queryKey: accountantKeys.detail(id) });
  }
};

export function useCreateAccountant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountantApi.createAccountant,
    onSuccess: () => invalidateAccountants(queryClient),
  });
}

export function useUpdateAccountant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountantApi.updateAccountant,
    onSuccess: (accountant, { id }) => {
      queryClient.setQueryData(accountantKeys.detail(id), accountant);
      invalidateAccountants(queryClient, id);
    },
  });
}

export function useSetAccountantStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountantApi.setAccountantStatus,
    onSuccess: (accountant, { id }) => {
      queryClient.setQueryData(accountantKeys.detail(id), accountant);
      invalidateAccountants(queryClient, id);
    },
  });
}
