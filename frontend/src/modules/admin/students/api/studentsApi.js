import apiAxios from "@shared/api/axios";

const BASE = "/students";

export const getAllStudents = async (filters = {}) => {
  const response = await apiAxios.get(BASE, { params: filters });
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await apiAxios.get(`${BASE}/${id}`);
  return response.data.data;
};


export const createStudent = async (payload) => {
  const response = await apiAxios.post(BASE, payload);
  return response.data.data;
};

export const updateStudent = async (id, payload) => {
  const response = await apiAxios.patch(`${BASE}/${id}`, payload);
  return response.data.data;
};

export const deleteStudent = async (id) => {
  await apiAxios.delete(`${BASE}/${id}`);
  return id;
};

export const toggleStudentStatus = async (id) => {
  const response = await apiAxios.patch(`${BASE}/${id}/status`);
  return response.data.data;
};
