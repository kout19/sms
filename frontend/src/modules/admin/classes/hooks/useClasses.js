import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  classKeys,
  studentKeys,
  subjectKeys,
  teacherKeys,
} from "@shared/api/queryKeys";
import * as classesApi from "../api/classesApi";

const sectionListKey = (classId) => [...classKeys.detail(classId), "sections"];
const sectionDetailKey = (id) => [...classKeys.details(), "section", id];

const normalizeFilters = (filters = {}) => ({
  search: String(filters.search || "").trim().replace(/\s+/g, " "),
  academicYear: filters.academicYear || "",
  status: filters.status || "",
  sort: filters.sort || "name",
  order: filters.order || "asc",
  page: Number(filters.page) || 1,
  limit: Number(filters.limit) || 7,
});

export function useClasses(filters = {}) {
  const normalized = normalizeFilters(filters);
  return useQuery({
    queryKey: classKeys.list(normalized),
    queryFn: ({ signal }) => classesApi.getClasses(normalized, { signal }),
    placeholderData: keepPreviousData,
  });
}

export function useClass(id) {
  return useQuery({
    queryKey: classKeys.detail(id),
    queryFn: ({ signal }) => classesApi.getClass(id, { signal }),
    enabled: Boolean(id),
  });
}

export function useClassSections(classId) {
  return useQuery({
    queryKey: sectionListKey(classId),
    queryFn: ({ signal }) => classesApi.getSections(classId, { signal }),
    enabled: Boolean(classId),
  });
}

export function useSection(id) {
  return useQuery({
    queryKey: sectionDetailKey(id),
    queryFn: ({ signal }) => classesApi.getSection(id, { signal }),
    enabled: Boolean(id),
  });
}

const invalidateClassOptions = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: studentKeys.all });
  queryClient.invalidateQueries({ queryKey: teacherKeys.all });
  queryClient.invalidateQueries({ queryKey: subjectKeys.all });
};

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: classesApi.createClass,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: classKeys.lists() }),
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => classesApi.updateClass(id, payload),
    onSuccess: (_classRecord, { id }) => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classKeys.detail(id) });
      invalidateClassOptions(queryClient);
    },
  });
}

export function useUpdateClassStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => classesApi.updateClassStatus(id, isActive),
    onSuccess: (_classRecord, { id }) => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classKeys.detail(id) });
      invalidateClassOptions(queryClient);
    },
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, payload }) =>
      classesApi.createSection(classId, payload),
    onSuccess: (_section, { classId }) => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classKeys.detail(classId) });
      queryClient.invalidateQueries({ queryKey: sectionListKey(classId) });
      invalidateClassOptions(queryClient);
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => classesApi.updateSection(id, payload),
    onSuccess: (section) => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classKeys.detail(section.classId) });
      queryClient.invalidateQueries({ queryKey: sectionListKey(section.classId) });
      queryClient.invalidateQueries({ queryKey: sectionDetailKey(section.id) });
      invalidateClassOptions(queryClient);
    },
  });
}

export function useUpdateSectionStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) =>
      classesApi.updateSectionStatus(id, isActive),
    onSuccess: (section) => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classKeys.detail(section.classId) });
      queryClient.invalidateQueries({ queryKey: sectionListKey(section.classId) });
      queryClient.invalidateQueries({ queryKey: sectionDetailKey(section.id) });
      invalidateClassOptions(queryClient);
    },
  });
}
