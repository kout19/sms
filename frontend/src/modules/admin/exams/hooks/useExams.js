import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examApi } from "../api/examApi";

export const examKeys = {
  all: ["exams"],
  stats: () => [...examKeys.all, "stats"],
  list: (filters) => [...examKeys.all, "list", filters],
};

// Hook to fetch exam statistics
export function useExamStats() {
  return useQuery({
    queryKey: examKeys.stats(),
    queryFn: () => examApi.getExamStats(),
  });
}

// Hook to fetch filtered/sorted exam lists
export function useExams(filters = {}) {
  return useQuery({
    queryKey: examKeys.list(filters),
    queryFn: () => examApi.getExams(filters),
  });
}

// Hook to create an exam
export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examApi.createExam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examKeys.all }),
  });
}

// Hook to publish an exam
export function usePublishExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examApi.publishExam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examKeys.all }),
  });
}

// Hook to archive an exam
export function useArchiveExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examApi.archiveExam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examKeys.all }),
  });
}

// Hook to delete an exam
export function useDeleteExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examApi.deleteExam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examKeys.all }),
  });

}
// get details of a single exam by ID

export function useExamDetails(id) {
  return useQuery({
    queryKey: [...examKeys.all, "detail", id],
    queryFn: () => examApi.getExamById(id),
    enabled: !!id, // Only fetch when an ID is present
  });
}
// update data
export function useUpdateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examApi.updateExam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examKeys.all }),
  });
}
