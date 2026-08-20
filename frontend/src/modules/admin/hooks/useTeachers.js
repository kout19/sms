// frontend/src/modules/admin/hooks/useTeachers.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as teacherApi from "../api/teachersApi";
import { teacherKeys } from "../../../shared/api/queryKeys";

// List query - we gonna  use inside TeachersPage
// this means that we need teachers list
export function useTeachers(filters = {}) {
  return useQuery({
    queryKey: teacherKeys.list(filters), // used to fetch data based on the filters
    queryFn: () => teacherApi.getAllTeachers(filters), // this is a function telling the query how to fetch data
  });
}

// Single-record query -we gonna  use inside a Teacher detail/edit page
export function useTeacher(id) {
  return useQuery({
    queryKey: teacherKeys.detail(id),
    queryFn: () => teacherApi.getTeacherById(id),
    enabled: Boolean(id), // This will not fire if id isn't ready yet
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherApi.createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
    },
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => teacherApi.updateTeacher(id, payload),
    onSuccess: (updatedTeacher, { id }) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teacherKeys.detail(id) });
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherApi.deleteTeacher,
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
      queryClient.removeQueries({ queryKey: teacherKeys.detail(deletedId) });
    },
  });
}

export function useToggleTeacherStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherApi.toggleTeacherStatus,
    onSuccess: (updatedTeacher, id) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teacherKeys.detail(id) });
    },
  });
}
