import apiAxios from "../../../../shared/api/axios";

const normalizeDepartment = (department) => ({
  ...department,
  icon: department.icon || "book-open",
  isActive: department.isActive !== false,
  head:
    department.head ||
    (department.headTeacher
      ? `${department.headTeacher.firstName} ${department.headTeacher.lastName}`.trim()
      : null),
  teacherCount: Number(
    department.teacherCount ?? department.teacherProfiles?.length ?? 0,
  ),
  studentCount: Number(department.studentCount ?? 0),
  subjects: Array.isArray(department.subjects) ? department.subjects : [],
});

export const getAllDepartments = async (filters = {}, config = {}) => {
  const params = {};
  if (filters.search) params.search = filters.search;
  if (filters.status && filters.status !== "all")
    params.status = filters.status;
  if (typeof filters.isActive === "boolean") params.isActive = filters.isActive;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const response = await apiAxios.get("/admin/departments", {
    params,
    ...config,
  });

  const payload = response.data || {};
  if (Array.isArray(payload.data)) {
    return {
      ...payload,
      data: payload.data.map(normalizeDepartment),
    };
  }

  return {
    ...payload,
    data: Array.isArray(payload.data?.data)
      ? payload.data.data.map(normalizeDepartment)
      : [],
    meta: payload.data?.meta || payload.meta || {},
  };
};

export const getDepartmentById = async (id, { signal } = {}) => {
  const response = await apiAxios.get(`/admin/departments/${id}`, { signal });
  const payload = response.data?.data ?? response.data;
  return normalizeDepartment(payload);
};

export const createDepartment = async (payload) => {
  const response = await apiAxios.post("/admin/departments", payload);
  return normalizeDepartment(response.data?.data ?? response.data);
};

export const updateDepartment = async (id, payload) => {
  const response = await apiAxios.patch(`/admin/departments/${id}`, payload);
  return normalizeDepartment(response.data?.data ?? response.data);
};

export const toggleDepartmentStatus = async (id) => {
  const response = await apiAxios.patch(`/admin/departments/${id}/status`);
  return normalizeDepartment(response.data?.data ?? response.data);
};

export const getDepartmentHeadOptions = async ({ signal } = {}) => {
  const response = await apiAxios.get("/admin/departments/head-options", {
    signal,
  });
  return response.data?.data ?? [];
};
