import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as studentsApi from "../api/studentsApi";
import { parentKeys, studentKeys } from "@shared/api/queryKeys";

const normalizeListFilters = (filters = {}) => ({
  search: String(filters.search || "").trim().replace(/\s+/g, " "),
  classId: filters.classId || "",
  page: Number(filters.page) || 1,
  limit: Number(filters.limit) || 20,
  ...(typeof filters.isActive === "boolean" ? { isActive: filters.isActive } : {}),
});

export function useStudents(filters = {}) {
  const normalized = normalizeListFilters(filters);

  return useQuery({
    queryKey: studentKeys.list(normalized),
    queryFn: ({ signal }) => studentsApi.getAllStudents(normalized, { signal }),
    placeholderData: keepPreviousData,
  });
}

export function useStudent(id) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: ({ signal }) => studentsApi.getStudentById(id, { signal }),
    enabled: Boolean(id),
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentsApi.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: parentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: parentKeys.details() });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => studentsApi.updateStudent(id, payload),
    onSuccess: (_updatedStudent, { id }) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: parentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: parentKeys.details() });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentsApi.deleteStudent,
    onSuccess: (_student, id) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.removeQueries({ queryKey: studentKeys.detail(id) });
    },
  });
}

export function useStudentClasses() {
  return useQuery({
    queryKey: [...studentKeys.all, "classes"],
    queryFn: ({ signal }) => studentsApi.getStudentClasses({ signal }),
    staleTime: 60 * 1000,
  });
}

export function usePreviewStudentImport() {
  return useMutation({
    mutationFn: studentsApi.previewStudentImport,
  });
}

export function useImportStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentsApi.importStudents,
    onSuccess: (summary) => {
      if (summary?.imported > 0) {
        queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      }
    },
  });
}

export function useToggleStudentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentsApi.toggleStudentStatus,
    onSuccess: (_updatedStudent, id) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
    },
  });
}
