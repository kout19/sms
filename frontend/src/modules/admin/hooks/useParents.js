import { parentKeys } from "../../../shared/api/queryKeys";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as parentApi from "../api/parentsApi";

export function useParents(filters = {}) {
  return useQuery({
    queryKey: parentKeys.list(filters),
    queryFn: () => parentApi.getAllParents(filters),
  });
}

export function useCreateParent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: parentApi.createParent,

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: parentKeys.lists() }),
  });
}

export function useToggleParentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: parentApi.toggleParentStatus,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: parentKeys.lists() }),
  });
}
