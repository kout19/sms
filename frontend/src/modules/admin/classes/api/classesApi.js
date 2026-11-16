import apiAxios from "@shared/api/axios";

const BASE = "/admin/classes";
const SECTION_BASE = "/admin/sections";

export async function getClasses(filters = {}, { signal } = {}) {
  const response = await apiAxios.get(BASE, { params: filters, signal });
  return response.data;
}

export async function getClass(id, { signal } = {}) {
  const response = await apiAxios.get(`${BASE}/${id}`, { signal });
  return response.data.data;
}

export async function createClass(payload) {
  const response = await apiAxios.post(BASE, payload);
  return response.data.data;
}

export async function updateClass(id, payload) {
  const response = await apiAxios.patch(`${BASE}/${id}`, payload);
  return response.data.data;
}

export async function updateClassStatus(id, isActive) {
  const response = await apiAxios.patch(`${BASE}/${id}/status`, { isActive });
  return response.data.data;
}

export async function getSections(classId, { signal } = {}) {
  const response = await apiAxios.get(`${BASE}/${classId}/sections`, { signal });
  return response.data.data;
}

export async function getSection(id, { signal } = {}) {
  const response = await apiAxios.get(`${SECTION_BASE}/${id}`, { signal });
  return response.data.data;
}

export async function createSection(classId, payload) {
  const response = await apiAxios.post(`${BASE}/${classId}/sections`, payload);
  return response.data.data;
}

export async function updateSection(id, payload) {
  const response = await apiAxios.patch(`${SECTION_BASE}/${id}`, payload);
  return response.data.data;
}

export async function updateSectionStatus(id, isActive) {
  const response = await apiAxios.patch(`${SECTION_BASE}/${id}/status`, {
    isActive,
  });
  return response.data.data;
}
