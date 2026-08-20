// frontend/src/modules/admin/api/teacherApi.js
// Pure API layer - HTTP calls only. No React, no TanStack Query here.
// Components and hooks never call apiAxios directly - they go through this.
import apiAxios from "../../../shared/api/axios";

const BASE = "/admin/teachers";

export const getAllTeachers = async (filters = {}) => {
  const response = await apiAxios.get(BASE, { params: filters });
  return response.data.data; // assumes backend wraps as { data: [...] } - confirm against actual response shape
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
  await apiAxios.delete(`${BASE}/${id}`);
  return id; // return the id so the mutation caller can remove it from cache directly
};

export const toggleTeacherStatus = async (id) => {
  const response = await apiAxios.patch(`${BASE}/${id}/status`);
  return response.data.data;
};
