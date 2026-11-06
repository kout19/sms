import apiAxios from "@shared/api/axios";

const BASE = "/admin/teachers";

export const getAllTeachers = async (filters = {}, { signal } = {}) => {
  const params = { ...filters };
  if (!params.search) delete params.search;
  if (!params.classId) delete params.classId;

  const response = await apiAxios.get(BASE, { params, signal });
  return response.data;
};

export const getTeacherClasses = async () => {
  const response = await apiAxios.get(`${BASE}/classes`);
  return response.data.data;
};

export const getTeacherById = async (id) => {
  const response = await apiAxios.get(`${BASE}/${id}`);
  return response.data.data;
};

export const createTeacher = async (payload) => {
  const response = await apiAxios.post(BASE, payload);
  return response.data.data;
};

export const updateTeacher = async (id, payload) => {
  const response = await apiAxios.patch(`${BASE}/${id}`, payload);
  return response.data.data;
};

export const deleteTeacher = async (id) => {
  const response = await apiAxios.delete(`${BASE}/${id}`);
  return response.data.data;
};

export const toggleTeacherStatus = async (id) => {
  const response = await apiAxios.patch(`${BASE}/${id}/status`);
  return response.data.data;
};
