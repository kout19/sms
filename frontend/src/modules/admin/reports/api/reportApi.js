import apiAxios from "@shared/api/axios"; // or your custom API client instance
import {getLetterGrade, getPerformanceStatus} from "@shared/components/gradeConstants";

const BASE = "/admin/reports/academic-report";


const MOCK_OVERVIEW = {
  averageScore: 76,
  averageScoreTrend: "+4.2%",
  passRate: 84,
  passRateTrend: "+2.1%",
  passRateDetail: "16 of 19 students",
  failedStudents: 3,
  failedStudentsTrend: "-3 from last term",
  topPerformersCount: 5,
  topPerformersTrend: "+1 this term",
};

const MOCK_TREND = [
  { month: "Jan", avgScore: 71, passRate: 87 },
  { month: "Feb", avgScore: 73, passRate: 88 },
  { month: "Mar", avgScore: 70, passRate: 86 },
  { month: "Apr", avgScore: 75, passRate: 89 },
  { month: "May", avgScore: 78, passRate: 91 },
  { month: "Jun", avgScore: 74, passRate: 89 },
  { month: "Jul", avgScore: 71, passRate: 87 },
  { month: "Aug", avgScore: 75, passRate: 89 },
  { month: "Sep", avgScore: 76, passRate: 91 },
];

const MOCK_PASS_FAIL = { passed: 91, failed: 9 };

const MOCK_SUBJECTS = [
  { subject: "CS", score: 88 },
  { subject: "HIST", score: 85 },
  { subject: "ENG", score: 83 },
  { subject: "BIO", score: 78 },
  { subject: "STAT", score: 76 },
  { subject: "GEO", score: 75 },
  { subject: "MATH", score: 74 },
  { subject: "CHEM", score: 71 },
  { subject: "PHY", score: 69 },
];

const MOCK_GRADES = [
  { grade: "G10", avgScore: 76, passRate: 89 },
  { grade: "G11", avgScore: 78, passRate: 92 },
  { grade: "G12", avgScore: 75, passRate: 95 },
];



// Table mock data
const MOCK_DETAILED_RECORDS = [
  {
    id: "s1",
    studentName: "Harper Martinez",
    studentCode: "STD-015",
    className: "Grade 12A",
    subject: "Computer Science",
    score: 97,
    trend: "up",
  },
  {
    id: "s2",
    studentName: "Evelyn Robinson",
    studentCode: "STD-016",
    className: "Grade 12A",
    subject: "Literature",
    score: 96,
    trend: "up",
  },
  {
    id: "s3",
    studentName: "James Taylor",
    studentCode: "STD-008",
    className: "Grade 11A",
    subject: "History",
    score: 95,
    trend: "up",
  },
  {
    id: "s4",
    studentName: "Mia Anderson",
    studentCode: "STD-009",
    className: "Grade 11A",
    subject: "English Language",
    score: 94,
    trend: "flat",
  },
  {
    id: "s5",
    studentName: "Mason Walker",
    studentCode: "STD-019",
    className: "Grade 12B",
    subject: "Economics",
    score: 93,
    trend: "up",
  },
  {
    id: "s6",
    studentName: "Liam Foster",
    studentCode: "STD-002",
    className: "Grade 10A",
    subject: "Mathematics",
    score: 91,
    trend: "up",
  },
  {
    id: "s7",
    studentName: "Sophia Miller",
    studentCode: "STD-005",
    className: "Grade 10B",
    subject: "Biology",
    score: 88,
    trend: "up",
  },
  {
    id: "s8",
    studentName: "Abigail Lee",
    studentCode: "STD-018",
    className: "Grade 12A",
    subject: "Economics",
    score: 87,
    trend: "up",
  },
  {
    id: "s9",
    studentName: "Grace Kim",
    studentCode: "STD-014",
    className: "Grade 11B",
    subject: "Geography",
    score: 82,
    trend: "flat",
  },
  {
    id: "s10",
    studentName: "Lucas Bennett",
    studentCode: "STD-007",
    className: "Grade 10A",
    subject: "Chemistry",
    score: 80,
    trend: "up",
  },
  {
    id: "s11",
    studentName: "Isabella Cruz",
    studentCode: "STD-013",
    className: "Grade 11B",
    subject: "Statistics",
    score: 79,
    trend: "up",
  },
  {
    id: "s12",
    studentName: "Benjamin Harris",
    studentCode: "STD-012",
    className: "Grade 11B",
    subject: "Mathematics",
    score: 77,
    trend: "up",
  },
  {
    id: "s13",
    studentName: "Ethan Wilson",
    studentCode: "STD-006",
    className: "Grade 10B",
    subject: "Chemistry",
    score: 74,
    trend: "up",
  },
  {
    id: "s14",
    studentName: "Sofia Hall",
    studentCode: "STD-020",
    className: "Grade 12B",
    subject: "Literature",
    score: 71,
    trend: "flat",
  },
  {
    id: "s15",
    studentName: "Charlotte White",
    studentCode: "STD-011",
    className: "Grade 11A",
    subject: "Physics",
    score: 53,
    trend: "flat",
  },
  {
    id: "s16",
    studentName: "Noah Davis",
    studentCode: "STD-004",
    className: "Grade 10A",
    subject: "Statistics",
    score: 51,
    trend: "down",
  },
  {
    id: "s17",
    studentName: "Alexander Lewis",
    studentCode: "STD-017",
    className: "Grade 12A",
    subject: "Mathematics",
    score: 49,
    trend: "down",
  },
  {
    id: "s18",
    studentName: "Oliver Jackson",
    studentCode: "STD-010",
    className: "Grade 11A",
    subject: "Chemistry",
    score: 47,
    trend: "down",
  },
  {
    id: "s19",
    studentName: "Olivia Brown",
    studentCode: "STD-003",
    className: "Grade 10A",
    subject: "Physics",
    score: 42,
    trend: "down",
  },
  {
    id: "s20",
    studentName: "Elijah Martinez",
    studentCode: "STD-016",
    className: "Grade 12A",
    subject: "Biology",
    score: 98,
    trend: "up",
  },
].map((r) => ({
  ...r,
  grade: getLetterGrade(r.score),
  status: getPerformanceStatus(r.score),
}));


export const reportsApi = {
  getSchoolHealthOverview: async () => {
    // const response = await apiAxios.get("/reports/school-health");
    // return response.data.data;:
    await new Promise((res) => setTimeout(res, 300));
    return {
      academicYear: "2026–2027",
      term: "Term 1",
      totalStudents: 537,
      classesCount: 6,
      academicAvg: "78.4%",
      academicAvgTrend: "+4.2% vs last term",
      attendanceRate: "91.4%",
      attendanceTrend: "+1.8% vs last month",
      feeCollection: "81%",
      outstandingFees: "$92.4K outstanding",
    };
  },
  // Add to features/reports/api/reportsApi.js

  getQuickInsights: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return [
      {
        id: "at-risk",
        title: "5 at-risk students",
        subtitle: "Scoring below 50 — need immediate academic support.",
        type: "danger",
        icon: "AlertTriangle",
        action: "/reports/academic/at-risk",
      },
      {
        id: "chronic-absentees",
        title: "3 chronic absentees",
        subtitle: "Students with attendance below 75% this term.",
        type: "warning",
        icon: "Activity",
        action: "/reports/attendance/absentees",
      },
      {
        id: "outstanding-fees",
        title: "$92,400 outstanding",
        subtitle: "19% of expected revenue still uncollected.",
        type: "purple",
        icon: "DollarSign",
        action: "/reports/financial/outstanding",
      },
      {
        id: "top-performers",
        title: "Grade 12 top performers",
        subtitle: "Harper Martinez leads with 97% average score.",
        type: "success",
        icon: "TrendingUp",
        action: "/reports/academic/top-performers",
      },
    ];
  },
};
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const getAcademicOverview = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(`${BASE}/overview`, { params: filters }); return response.data.data;
  await delay();
  return MOCK_OVERVIEW;
};

export const getScoreTrend = async (filters = {}) => {
  await delay();
  return MOCK_TREND;
};

export const getPassFailDistribution = async (filters = {}) => {
  await delay();
  return MOCK_PASS_FAIL;
};

export const getSubjectPerformance = async (filters = {}) => {
  await delay();
  return MOCK_SUBJECTS; // already sorted highest-first, matching screenshot
};

export const getGradePerformance = async (filters = {}) => {
  await delay();
  return MOCK_GRADES;
};


// Table mock data api's
export const getDetailedRecords = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(`${BASE}/detailed`, { params: filters }); return response.data.data;
  await delay();
  return [...MOCK_DETAILED_RECORDS].sort((a, b) => b.score - a.score);
};

// Now DERIVED from MOCK_DETAILED_RECORDS, not a separate hand-typed array
export const getTopPerformers = async (filters = {}) => {
  await delay();
  return [...MOCK_DETAILED_RECORDS]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((r) => ({
      id: r.id,
      name: r.studentName,
      className: r.className,
      score: r.score,
      grade: r.grade,
    }));
};

export const getAtRiskStudents = async (filters = {}) => {
  await delay();
  return [...MOCK_DETAILED_RECORDS]
    .filter((r) => r.status === "atRisk")
    .sort((a, b) => a.score - b.score)
    .slice(0, 5)
    .map((r) => ({
      id: r.id,
      name: r.studentName,
      subject: r.subject,
      score: r.score,
    }));
};
