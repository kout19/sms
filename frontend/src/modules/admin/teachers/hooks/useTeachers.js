import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as teacherApi from "../api/teachersApi";
import { teacherKeys } from "@shared/api/queryKeys";

const normalizeListFilters = (filters = {}) => ({
  search: String(filters.search || "").trim().replace(/\s+/g, " "),
  classId: filters.classId || "",
  page: Number(filters.page) || 1,
  limit: Number(filters.limit) || 20,
  ...(typeof filters.isActive === "boolean" ? { isActive: filters.isActive } : {}),
});

export function useTeachers(filters = {}) {
  const normalized = normalizeListFilters(filters);

  return useQuery({
    queryKey: teacherKeys.list(normalized),
    queryFn: ({ signal }) => teacherApi.getAllTeachers(normalized, { signal }),
    placeholderData: keepPreviousData,
  });
}

export function useTeacher(id) {
  return useQuery({
    queryKey: teacherKeys.detail(id),
    queryFn: ({ signal }) => teacherApi.getTeacherById(id, { signal }),
    enabled: Boolean(id),
  });
}

export function useTeacherClasses() {
  return useQuery({
    queryKey: [...teacherKeys.all, "classes"],
    queryFn: ({ signal }) => teacherApi.getTeacherClasses({ signal }),
    staleTime: 60 * 1000,
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
    onSuccess: (_updatedTeacher, { id }) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teacherKeys.detail(id) });
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherApi.deleteTeacher,
    onSuccess: (_teacher, id) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
      queryClient.removeQueries({ queryKey: teacherKeys.detail(id) });
    },
  });
}

export function useToggleTeacherStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherApi.toggleTeacherStatus,
    onSuccess: (_updatedTeacher, id) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teacherKeys.detail(id) });
    },
  });
}
