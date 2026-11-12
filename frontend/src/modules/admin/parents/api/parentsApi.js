import apiAxios from "../../../../shared/api/axios";

const BASE = "/admin/parents";

export const getAllParents = async (filters, { signal } = {}) => {
  const response = await apiAxios.get(BASE, { params: filters, signal });
  return response.data;
};

export const getParentById = async (id, { signal } = {}) => {
  const response = await apiAxios.get(`${BASE}/${id}`, { signal });
  return response.data.data;
};

export const getStudentOptions = async (search, { signal } = {}) => {
  const response = await apiAxios.get(`${BASE}/student-options`, {
    params: { search, page: 1, limit: 50 },
    signal,
  });
  return response.data;
};

export const createParent = async (payload) => {
  const response = await apiAxios.post(BASE, payload);
  return response.data.data;
};

export const updateParent = async (id, payload) => {
  const response = await apiAxios.patch(`${BASE}/${id}`, payload);
  return response.data.data;
};

export const updateParentStudents = async (id, students) => {
  const response = await apiAxios.put(`${BASE}/${id}/students`, { students });
  return response.data.data;
};

export const setParentStatus = async (id, isActive) => {
  const response = await apiAxios.patch(`${BASE}/${id}/status`, { isActive });
  return response.data.data;
};
