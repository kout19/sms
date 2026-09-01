import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectKeys } from "../../../shared/api/queryKeys";
import * as subjectApi from "../api/subjectsApi";

export function useSubjects(filters = {}) {
  return useQuery({
    queryKey: subjectKeys.list(filters),
    queryFn: () => subjectApi.getAllSubjects(filters),
  });
}
export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subjectApi.createSubject,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() }),
  });
}

export function useToggleSubjectStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subjectApi.toggleSubjectStatus,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() }),
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subjectApi.deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subjectApi.updateSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}