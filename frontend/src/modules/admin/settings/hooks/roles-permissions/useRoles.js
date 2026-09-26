import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as rolesApi from "../../api/roles-permissions/rolesApi";
import { makeResourceKeys } from "@shared/api/queryKeys";

const roleKeys = makeResourceKeys("rolesPermissions");

export function useRoles() {
  return useQuery({ queryKey: roleKeys.all, queryFn: rolesApi.getRoles });
}

function invalidate(queryClient) {
  queryClient.invalidateQueries({ queryKey: roleKeys.all });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, permissions }) => rolesApi.updateRolePermissions(roleId, permissions),
    onSuccess: () => invalidate(queryClient),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: rolesApi.createRole, onSuccess: () => invalidate(queryClient) });
}

export function useUpdateRoleDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, name, description }) => rolesApi.updateRoleDetails(roleId, { name, description }),
    onSuccess: () => invalidate(queryClient),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: rolesApi.deleteRole, onSuccess: () => invalidate(queryClient) });
}