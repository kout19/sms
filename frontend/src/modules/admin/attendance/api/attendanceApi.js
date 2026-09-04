import apiAxios from "@shared/api/axios";

const BASE = "/admin/attendance";

const MOCK_TREND = [
  { label: "Mon", date: "2026-08-25", rate: 91, isToday: false },
  { label: "Tue", date: "2026-08-26", rate: 88, isToday: false },
  { label: "Wed", date: "2026-08-27", rate: 84, isToday: false },
  { label: "Thu", date: "2026-08-28", rate: 86, isToday: false },
  { label: "Fri", date: "2026-08-31", rate: 81, isToday: false },
  { label: "Mon", date: "2026-09-01", rate: 91, isToday: true },
];

const MOCK_BREAKDOWN = {
  present: 14, absent: 3, late: 3, excused: 2,
  byGrade: [
    { grade: "Grade 10", rate: 71 },
    { grade: "Grade 11", rate: 71 },
    { grade: "Grade 12", rate: 88 },
  ],
};

const MOCK_RECORDS = [
  { id: "r1", studentName: "Abigail Lee", studentCode: "STD-018", className: "Grade 12A", status: "present", checkIn: "08:15 AM", remarks: null },
  { id: "r2", studentName: "Alexander Lewis", studentCode: "STD-017", className: "Grade 12A", status: "absent", checkIn: null, remarks: null },
  { id: "r3", studentName: "Amelia Martin", studentCode: "STD-013", className: "Grade 11B", status: "present", checkIn: "08:10 AM", remarks: null },
  { id: "r4", studentName: "Aria King", studentCode: "STD-022", className: "Grade 12B", status: "present", checkIn: "08:03 AM", remarks: null },
  { id: "r5", studentName: "Benjamin Harris", studentCode: "STD-012", className: "Grade 11B", status: "present", checkIn: "07:52 AM", remarks: null },
  { id: "r6", studentName: "Caden Scott", studentCode: "STD-021", className: "Grade 12B", status: "present", checkIn: "07:59 AM", remarks: null },
  { id: "r7", studentName: "Charlotte White", studentCode: "STD-011", className: "Grade 11A", status: "late", checkIn: "08:45 AM", remarks: "Traffic congestion" },
  { id: "r8", studentName: "Emma Johnson", studentCode: "STD-001", className: "Grade 10A", status: "present", checkIn: "07:55 AM", remarks: null },
];

export const getAttendanceTrend = async () => {
  // TODO: const response = await apiAxios.get(`${BASE}/trend`); return response.data.data;
  await new Promise((r) => setTimeout(r, 200));
  const rates = MOCK_TREND.map((d) => d.rate);
  return {
    days: MOCK_TREND,
    avgRate: Math.round(rates.reduce((a, b) => a + b, 0) / rates.length),
    bestDayRate: Math.max(...rates),
    lowestRate: Math.min(...rates),
    daysTracked: MOCK_TREND.length,
    weekTrend: "+2.3%",
  };
};

export const getTodayBreakdown = async () => {
  // TODO: const response = await apiAxios.get(`${BASE}/today-breakdown`); return response.data.data;
  await new Promise((r) => setTimeout(r, 200));
  const total = MOCK_BREAKDOWN.present + MOCK_BREAKDOWN.absent + MOCK_BREAKDOWN.late + MOCK_BREAKDOWN.excused;
  return { ...MOCK_BREAKDOWN, total };
};

export const getAttendanceRecords = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(BASE, { params: filters }); return response.data.data;
  await new Promise((r) => setTimeout(r, 200));
  let results = MOCK_RECORDS;
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (r) => r.studentName.toLowerCase().includes(q) || r.studentCode.toLowerCase().includes(q)
    );
  }
  if (filters.classFilter && filters.classFilter !== "all") {
    results = results.filter((r) => r.className === filters.classFilter);
  }
  if (filters.statusFilter && filters.statusFilter !== "all") {
    results = results.filter((r) => r.status === filters.statusFilter);
  }
  return results;
};

export const setAttendanceStatus = async (id, status) => {
  // TODO: const response = await apiAxios.patch(`${BASE}/${id}/status`, { status }); return response.data.data;
  const record = MOCK_RECORDS.find((r) => r.id === id);
  if (!record) throw new Error("Record not found");
  record.status = status;
  return record;
};

export const addRemark = async (id, remark) => {
  // TODO: const response = await apiAxios.patch(`${BASE}/${id}/remark`, { remark }); return response.data.data;
  const record = MOCK_RECORDS.find((r) => r.id === id);
  if (!record) throw new Error("Record not found");
  record.remarks = remark;
  return record;
};