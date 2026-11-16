import apiAxios from "@shared/api/axios";

const BASE = "/admin/attendance";

const readResponse = (response) => response?.data?.data ?? response?.data ?? [];

export const getAttendanceTrend = async () => {
  const response = await apiAxios.get(`${BASE}/trend`);
  return readResponse(response);
};

export const getTodayBreakdown = async () => {
  const response = await apiAxios.get(`${BASE}/today-breakdown`);
  return readResponse(response);
};

export const getAttendanceRecords = async (filters = {}) => {
  const params = {
    search: filters.search || undefined,
    status: filters.statusFilter && filters.statusFilter !== "all" ? filters.statusFilter : undefined,
    classFilter: filters.classFilter && filters.classFilter !== "all" ? filters.classFilter : undefined,
    date: filters.date || undefined,
  };
  const response = await apiAxios.get(BASE, { params });
  return readResponse(response);
};

export const setAttendanceStatus = async (id, status) => {
  const response = await apiAxios.patch(`${BASE}/${id}/status`, { status });
  return readResponse(response);
};

export const addRemark = async (id, remark) => {
  const response = await apiAxios.patch(`${BASE}/${id}/status`, { remarks: remark });
  return readResponse(response);
};

export const getAttendanceStats = async () => {
  const response = await apiAxios.get(`${BASE}/stats`);
  const payload = readResponse(response) || {};
  return {
    presentToday: payload.presentToday ?? 0,
    totalStudents: payload.totalStudents ?? 0,
    absentToday: payload.absentToday ?? 0,
    absentRate: payload.absentRate ?? 0,
    lateArrivals: payload.lateArrivals ?? 0,
    lateCutoff: "08:30 AM",
    attendanceRate: payload.attendanceRate ?? 0,
  };
};

export const bulkMarkAttendance = async (date, entries) => {
  const response = await apiAxios.post(`${BASE}/bulk-mark`, { date, entries });
  return readResponse(response);
};

export const bulkUpdateStatus = async (ids, status) => {
  const response = await apiAxios.patch(`${BASE}/bulk-status`, { ids, status });
  return readResponse(response);
};