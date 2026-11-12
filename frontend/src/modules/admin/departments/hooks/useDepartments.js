import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as departmentApi from "../api/departmentApi";
import { departmentKeys } from "../../../../shared/api/queryKeys";

export function useDepartments(filters = {}) {
  const normalized = {
    search: String(filters.search || "")
      .trim()
      .replace(/\s+/g, " "),
    status: filters.status || "all",
    page: Number(filters.page) || 1,
    limit: Number(filters.limit) || 20,
    ...(typeof filters.isActive === "boolean"
      ? { isActive: filters.isActive }
      : {}),
  };

  return useQuery({
    queryKey: departmentKeys.list(normalized),
    queryFn: ({ signal }) =>
      departmentApi.getAllDepartments(normalized, { signal }),
    placeholderData: keepPreviousData,
  });
}

export function useDepartment(id) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: ({ signal }) => departmentApi.getDepartmentById(id, { signal }),
    enabled: Boolean(id),
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentApi.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      departmentApi.updateDepartment(id, payload),
    onSuccess: (_updatedDepartment, { id }) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(id) });
    },
  });
}

export function useDepartmentHeads() {
  return useQuery({
    queryKey: [...departmentKeys.all, "head-options"],
    queryFn: ({ signal }) =>
      departmentApi.getDepartmentHeadOptions({ signal }),
    staleTime: 60 * 1000,
  });
}

export function useToggleDepartmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentApi.toggleDepartmentStatus,
    onSuccess: (_updatedDepartment, id) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(id) });
    },
  });
}
