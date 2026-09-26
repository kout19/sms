import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as usersApi from "../../api/user-management/userManagementApi";
import { makeResourceKeys } from "@shared/api/queryKeys";

const userMgmtKeys = makeResourceKeys("adminUsers");

export function useUsers(filters) {
  return useQuery({
    queryKey: userMgmtKeys.list(filters),
    queryFn: () => usersApi.getUsers(filters),
  });
}

export function useUser(id) {
  return useQuery({
    queryKey: userMgmtKeys.detail(id),
    queryFn: () => usersApi.getUserById(id),
    enabled: Boolean(id),
  });
}

function invalidateAll(queryClient) {
  queryClient.invalidateQueries({ queryKey: userMgmtKeys.lists() });
  queryClient.invalidateQueries({ queryKey: userMgmtKeys.details() });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => usersApi.updateUser(id, payload),
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => usersApi.changeUserRole(id, role),
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useToggleSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.toggleSuspendUser,
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useResetUserPassword() {
  return useMutation({ mutationFn: usersApi.resetUserPassword });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => invalidateAll(queryClient),
  });
}
