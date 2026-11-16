import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as examApi from "../api/examApi";

export const examKeys = {
  all: ["exams"],
  lists: () => [...examKeys.all, "list"],
  list: (filters) => [...examKeys.lists(), filters],
  stats: (filters) => [...examKeys.all, "stats", filters],
  options: () => [...examKeys.all, "options"],
  details: () => [...examKeys.all, "detail"],
  detail: (id) => [...examKeys.details(), id],
};

export function useExams(filters) {
  return useQuery({
    queryKey: examKeys.list(filters),
    queryFn: ({ signal }) => examApi.getExams(filters, { signal }),
    placeholderData: keepPreviousData,
  });
}

export function useExamOptions() {
  return useQuery({
    queryKey: examKeys.options(),
    queryFn: ({ signal }) => examApi.getExamOptions({ signal }),
    staleTime: 60 * 1000,
  });
}

export function useExamStats(filters = {}) {
  return useQuery({
    queryKey: examKeys.stats(filters),
    queryFn: ({ signal }) => examApi.getExamStats(filters, { signal }),
  });
}

export function useExamDetails(id) {
  return useQuery({
    queryKey: examKeys.detail(id),
    queryFn: ({ signal }) => examApi.getExamById(id, { signal }),
    enabled: Boolean(id),
  });
}

const useExamMutation = (mutationFn) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: examKeys.all }),
  });
};

export const useCreateExam = () => useExamMutation(examApi.createExam);
export const useUpdateExam = () => useExamMutation(examApi.updateExam);
export const useDeleteExam = () => useExamMutation(examApi.deleteExam);
