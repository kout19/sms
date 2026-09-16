import apiAxios from "@shared/api/axios";
import { getAttendanceStatus } from "../utils/attendanceStatusConstants";
const BASE = "/admin/reports/attendance-report";
const dealy = (ms = 200) => new Promise((r) => setTimeout(r, ms));

const MOCK_OVERVIEW = {
  attendanceRate: 90,
  attendanceRateTrend: "+1.8%",
  presentDays: 695,
  presentDaysTrend: "+1.8%",
  absentDays: 60,
  absentDaysTrend: "-18",
  lateArivals: 19,
  lateArivalsTrend: "-3%",
  chronicAbsence: 3,
  chronicAbsenceTrend: "Need support",
};

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const getAttendanceOverview = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(`${BASE}/overview`, { params: filters }); return response.data.data;
  await delay();
  return MOCK_OVERVIEW;
};

const MOCK_MONTHLY_BREAKDOWN = [
  { month: "Jan", present: 1780, absent: 150, late: 70 },
  { month: "Feb", present: 1810, absent: 130, late: 60 },
  { month: "Mar", present: 1750, absent: 170, late: 80 },
  { month: "Apr", present: 1880, absent: 90, late: 30 },
  { month: "May", present: 1840, absent: 110, late: 50 },
  { month: "Jun", present: 1790, absent: 140, late: 70 },
  { month: "Jul", present: 1720, absent: 190, late: 90 },
  { month: "Aug", present: 1850, absent: 100, late: 50 },
];

// GROUP B - whole-school per-grade term totals. NOT derivable from the
// 18-row detailed table below (180+ students per grade vs 18 total rows) -
// kept as its own dataset deliberately, see note above the code block.
const MOCK_GRADE_SUMMARY = [
  {
    grade: "Grade 10",
    rate: 91,
    trend: "+1.2%",
    present: 162,
    absent: 12,
    late: 6,
  },
  {
    grade: "Grade 11",
    rate: 90,
    trend: "-0.8%",
    present: 172,
    absent: 14,
    late: 6,
  },
  {
    grade: "Grade 12",
    rate: 93,
    trend: "+2.4%",
    present: 153,
    absent: 8,
    late: 4,
  },
];

// GROUP C - a watchlist-style subset (18 students), NOT the full roster.
// Chronic Absentees is DERIVED from this - one real source for both.
const MOCK_DETAILED_RECORDS = [
  {
    id: "a1",
    studentName: "Sophia Miller",
    studentCode: "STD-005",
    className: "Grade 10B",
    present: 43,
    absent: 0,
    late: 0,
    rate: 100,
  },
  {
    id: "a2",
    studentName: "Mia Anderson",
    studentCode: "STD-009",
    className: "Grade 11A",
    present: 43,
    absent: 0,
    late: 0,
    rate: 100,
  },
  {
    id: "a3",
    studentName: "Harper Martinez",
    studentCode: "STD-015",
    className: "Grade 12A",
    present: 43,
    absent: 0,
    late: 0,
    rate: 100,
  },
  {
    id: "a4",
    studentName: "Emma Johnson",
    studentCode: "STD-001",
    className: "Grade 10A",
    present: 42,
    absent: 0,
    late: 1,
    rate: 98,
  },
  {
    id: "a5",
    studentName: "James Taylor",
    studentCode: "STD-008",
    className: "Grade 11A",
    present: 42,
    absent: 1,
    late: 0,
    rate: 98,
  },
  {
    id: "a6",
    studentName: "Evelyn Robinson",
    studentCode: "STD-016",
    className: "Grade 12A",
    present: 42,
    absent: 0,
    late: 1,
    rate: 98,
  },
  {
    id: "a7",
    studentName: "Mason Walker",
    studentCode: "STD-019",
    className: "Grade 12B",
    present: 42,
    absent: 1,
    late: 0,
    rate: 98,
  },
  {
    id: "a8",
    studentName: "Liam Williams",
    studentCode: "STD-002",
    className: "Grade 10B",
    present: 41,
    absent: 1,
    late: 1,
    rate: 97,
  },
  {
    id: "a9",
    studentName: "Grace Kim",
    studentCode: "STD-014",
    className: "Grade 11B",
    present: 41,
    absent: 1,
    late: 1,
    rate: 95,
  },
  {
    id: "a10",
    studentName: "Lucas Bennett",
    studentCode: "STD-007",
    className: "Grade 10A",
    present: 40,
    absent: 2,
    late: 1,
    rate: 94,
  },
  {
    id: "a11",
    studentName: "Amelia Martin",
    studentCode: "STD-013",
    className: "Grade 11B",
    present: 40,
    absent: 2,
    late: 1,
    rate: 93,
  },
  {
    id: "a12",
    studentName: "Ethan Wilson",
    studentCode: "STD-006",
    className: "Grade 10B",
    present: 38,
    absent: 3,
    late: 2,
    rate: 88,
  },
  {
    id: "a13",
    studentName: "Sofia Hall",
    studentCode: "STD-020",
    className: "Grade 12B",
    present: 37,
    absent: 4,
    late: 2,
    rate: 86,
  },
  {
    id: "a14",
    studentName: "Noah Davis",
    studentCode: "STD-004",
    className: "Grade 10A",
    present: 36,
    absent: 4,
    late: 3,
    rate: 84,
  },
  {
    id: "a15",
    studentName: "Charlotte White",
    studentCode: "STD-011",
    className: "Grade 11A",
    present: 35,
    absent: 5,
    late: 3,
    rate: 81,
  },
  {
    id: "a16",
    studentName: "Alexander Lewis",
    studentCode: "STD-017",
    className: "Grade 12A",
    present: 31,
    absent: 11,
    late: 1,
    rate: 72,
  },
  {
    id: "a17",
    studentName: "Olivia Brown",
    studentCode: "STD-003",
    className: "Grade 10A",
    present: 30,
    absent: 12,
    late: 1,
    rate: 71,
  },
  {
    id: "a18",
    studentName: "Oliver Jackson",
    studentCode: "STD-010",
    className: "Grade 11A",
    present: 29,
    absent: 13,
    late: 1,
    rate: 68,
  },
].map((r) => ({ ...r, status: getAttendanceStatus(r.rate) }));

export const getAttendanceTrend = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(`${BASE}/trend`, { params: filters }); return response.data.data;
  await delay();
  const days = MOCK_MONTHLY_BREAKDOWN.map((m) => ({
    month: m.month,
    rate: Math.round((m.present / (m.present + m.absent + m.late)) * 100),
  }));
  // "Stable" as shown in the screenshot - a real implementation would
  // compute this from variance/slope across the period, not hardcode it.
  return { days, badge: "Stable" };
};

export const getMonthlyBreakdown = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(`${BASE}/monthly-breakdown`, { params: filters }); return response.data.data;
  await delay();
  return MOCK_MONTHLY_BREAKDOWN;
};

export const getGradeSummary = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(`${BASE}/by-grade`, { params: filters }); return response.data.data;
  await delay();
  return MOCK_GRADE_SUMMARY;
};

export const getDetailedAttendanceRecords = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(`${BASE}/detailed`, { params: filters }); return response.data.data;
  await delay();
  return [...MOCK_DETAILED_RECORDS].sort((a, b) => b.rate - a.rate);
};

export const getChronicAbsentees = async (filters = {}) => {
  await delay();
  return [...MOCK_DETAILED_RECORDS]
    .filter((r) => r.status === "chronicAbsent")
    .sort((a, b) => a.rate - b.rate)
    .map((r) => ({
      id: r.id,
      name: r.studentName,
      className: r.className,
      absentDays: r.absent,
      rate: r.rate,
    }));
};