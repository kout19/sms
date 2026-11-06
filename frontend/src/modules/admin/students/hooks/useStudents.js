import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as studentsApi from "../api/studentsApi";
import { studentKeys } from "@shared/api/queryKeys";

export function useStudents(filters = {}) {
  return useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: () => studentsApi.getAllStudents(filters),
  });
}

export function useStudent(id) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => studentsApi.getStudentById(id),
    enabled: Boolean(id),
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentsApi.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
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
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentsApi.deleteStudent,
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.removeQueries({ queryKey: studentKeys.detail(deletedId) });
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
