import apiAxios from "@shared/api/axios";

const BASE = "/admin/attendance/reports";

const getData = async (url, params) => {
  const response = await apiAxios.get(url, { params });
  return response.data.data;
};

export const getAttendanceReportOptions = () => getData(`${BASE}/options`);
export const getAttendanceReport = (filters) => getData(BASE, filters);
export const getAttendanceReportStudents = (params) => getData(`${BASE}/students`, params);
export const getAttendanceReportRecords = (params) => getData(`${BASE}/records`, params);
export const getAttendanceReportDetail = (params) => getData(`${BASE}/detail`, params);

export const exportAttendanceReport = async (filters) => {
  const response = await apiAxios.get(`${BASE}/export`, {
    params: filters,
    responseType: "blob",
  });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = "attendance-report.xlsx";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
