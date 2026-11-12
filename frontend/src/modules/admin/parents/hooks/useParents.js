import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  parentKeys,
  studentKeys,
} from "../../../../shared/api/queryKeys";
import * as parentApi from "../api/parentsApi";

const normalizeFilters = (filters = {}) => ({
  search: String(filters.search || "").trim().replace(/\s+/g, " "),
  status: ["active", "inactive"].includes(filters.status)
    ? filters.status
    : "all",
  page: Math.max(1, Number(filters.page) || 1),
  limit: Math.min(100, Math.max(1, Number(filters.limit) || 20)),
});

export function useParents(filters = {}, enabled = true) {
  const normalized = normalizeFilters(filters);
  return useQuery({
    queryKey: parentKeys.list(normalized),
    queryFn: ({ signal }) => parentApi.getAllParents(normalized, { signal }),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useParent(id, enabled = true) {
  return useQuery({
    queryKey: parentKeys.detail(id),
    queryFn: ({ signal }) => parentApi.getParentById(id, { signal }),
    enabled: Boolean(id) && enabled,
  });
}

export function useParentStudentOptions(search) {
  const normalizedSearch = String(search || "").trim().replace(/\s+/g, " ");
  return useQuery({
    queryKey: [...parentKeys.all, "student-options", normalizedSearch],
    queryFn: ({ signal }) =>
      parentApi.getStudentOptions(normalizedSearch, { signal }),
    enabled: normalizedSearch.length >= 2,
    staleTime: 30 * 1000,
  });
}

const invalidateParents = (queryClient, id) => {
  queryClient.invalidateQueries({ queryKey: parentKeys.lists() });
  if (id) {
    queryClient.invalidateQueries({ queryKey: parentKeys.detail(id) });
  } else {
    queryClient.invalidateQueries({ queryKey: parentKeys.details() });
  }
};

const invalidateLinkedStudents = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
  queryClient.invalidateQueries({ queryKey: studentKeys.details() });
};

export function useCreateParent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: parentApi.createParent,
    onSuccess: (_parent, payload) => {
      invalidateParents(queryClient);
      if (payload.students?.length) invalidateLinkedStudents(queryClient);
    },
  });
}

export function useUpdateParent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => parentApi.updateParent(id, payload),
    onSuccess: (parent, { payload }) => {
      invalidateParents(queryClient, parent.id);
      if (payload.students !== undefined) invalidateLinkedStudents(queryClient);
    },
  });
}

export function useUpdateParentStudents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, students }) =>
      parentApi.updateParentStudents(id, students),
    onSuccess: (parent) => {
      invalidateParents(queryClient, parent.id);
      invalidateLinkedStudents(queryClient);
    },
  });
}

export function useToggleParentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) =>
      parentApi.setParentStatus(id, isActive),
    onSuccess: (parent) => invalidateParents(queryClient, parent.id),
  });
}
