import apiAxios from "@shared/api/axios";

const BASE = "/admin/exams";

export async function getExams(filters = {}, { signal } = {}) {
  const response = await apiAxios.get(BASE, { params: filters, signal });
  return response.data;
}

export async function getExamOptions({ signal } = {}) {
  const response = await apiAxios.get(`${BASE}/options`, { signal });
  return response.data.data;
}

export async function getExamStats(filters = {}, { signal } = {}) {
  const response = await apiAxios.get(`${BASE}/stats`, {
    params: filters,
    signal,
  });
  return response.data.data;
}

export async function getExamById(id, { signal } = {}) {
  const response = await apiAxios.get(`${BASE}/${id}`, { signal });
  return response.data.data;
}

export async function createExam(payload) {
  const response = await apiAxios.post(BASE, payload);
  return response.data.data;
}

export async function updateExam({ id, payload }) {
  const response = await apiAxios.patch(`${BASE}/${id}`, payload);
  return response.data.data;
}

export async function deleteExam(id) {
  const response = await apiAxios.delete(`${BASE}/${id}`);
  return response.data.data;
}
