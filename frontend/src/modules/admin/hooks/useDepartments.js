// frontend/src/modules/admin/hooks/useDepartments.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as departmentApi from "../api/departmentApi";
import { departmentKeys } from "../../../shared/api/queryKeys";

export function useDepartments(filters = {}) {
  return useQuery({
    queryKey: departmentKeys.list(filters),
    queryFn: () => departmentApi.getAllDepartments(filters),
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentApi.createDepartment,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() }),
  });
}

export function useToggleDepartmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentApi.toggleDepartmentStatus,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() }),
  });
}