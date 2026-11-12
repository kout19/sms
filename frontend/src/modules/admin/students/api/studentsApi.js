import apiAxios from "@shared/api/axios";

const BASE = "/students";

const uploadConfig = {
  transformRequest: [
    (data, headers) => {
      if (typeof headers.delete === "function") {
        headers.delete("Content-Type");
      } else if (headers) {
        delete headers["Content-Type"];
      }
      return data;
    },
  ],
};

export const getAllStudents = async (filters = {}, { signal } = {}) => {
  const params = { ...filters };
  if (!params.search) delete params.search;
  if (!params.classId) delete params.classId;

  const response = await apiAxios.get(BASE, { params, signal });
  return response.data;
};

export const getStudentClasses = async ({ signal } = {}) => {
  const response = await apiAxios.get(`${BASE}/classes`, { signal });
  return response.data.data;
};

export const getStudentById = async (id, { signal } = {}) => {
  const response = await apiAxios.get(`${BASE}/${id}`, { signal });
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
  const response = await apiAxios.delete(`${BASE}/${id}`);
  return response.data.data;
};

export const toggleStudentStatus = async (id) => {
  const response = await apiAxios.patch(`${BASE}/${id}/status`);
  return response.data.data;
};

export const downloadStudentTemplate = async () => {
  const response = await apiAxios.get(`${BASE}/import/template`, {
    responseType: "blob",
  });

  if (response.data?.type?.includes("json")) {
    const text = await response.data.text();
    const payload = JSON.parse(text);
    throw new Error(payload.message || "The template could not be downloaded.");
  }

  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = "student-import-template.xlsx";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const postWorkbook = async (path, file) => {
  const form = new FormData();
  form.append("file", file);
  const response = await apiAxios.post(`${BASE}${path}`, form, uploadConfig);
  return response.data.data;
};

export const previewStudentImport = (file) =>
  postWorkbook("/import/preview", file);

export const importStudents = (file) => postWorkbook("/import", file);
