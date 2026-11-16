import apiAxios from "@shared/api/axios";

const BASE = "/admin/reports/academic";

const getAcademicReportData = async (path, filters = {}) => {
  const response = await apiAxios.get(`${BASE}/${path}`, { params: filters });
  return response.data.data ?? response.data;
};

export const getSchoolHealthOverview = async () => {
  const response = await apiAxios.get(`${BASE}/summary`);
  return response.data.data ?? response.data;
};

export const getQuickInsights = async () => {
  const response = await apiAxios.get(`${BASE}/summary`);
  return response.data.data?.summary ? [{
    id: "academic-data-unavailable",
    title: "Academic reports unavailable",
    subtitle: response.data.data.reason,
    type: "warning",
    icon: "AlertTriangle",
    action: "/admin/reports/academic-reports",
  }] : [];
};

export const getAcademicOverview = async (filters = {}) =>
  getAcademicReportData("summary", filters);

export const getReportOverview = async (filters = {}) =>
  getAcademicReportData("overview", filters);

export const getScoreTrend = async (filters = {}) =>
  getAcademicReportData("exam-analysis", filters);

export const getPassFailDistribution = async (filters = {}) =>
  getAcademicReportData("grade-distribution", filters);

export const getSubjectPerformance = async (filters = {}) =>
  getAcademicReportData("subject-performance", filters);

export const getGradePerformance = async (filters = {}) =>
  getAcademicReportData("grade-distribution", filters);

export const getDetailedRecords = async (filters = {}) =>
  getAcademicReportData("student-performance", filters);

export const getTopPerformers = async (filters = {}) =>
  getAcademicReportData("top-students", filters);

export const getAtRiskStudents = async (filters = {}) =>
  getAcademicReportData("at-risk-students", filters);

export const exportAcademicReport = async (filters = {}) => {
  const response = await apiAxios.get(`${BASE}/export`, {
    params: filters,
    responseType: "blob",
  });
  return response.data;
};