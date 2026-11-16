const prisma = require("../../../config/prisma");

const REQUIRED_MODELS = [
  "ExamResult",
  "Assessment",
  "AssessmentType",
  "GradeScale",
  "StudentAcademicRecord",
];

const buildFilters = (filters = {}) => ({
  academicYearId: filters.academicYearId || null,
  classId: filters.classId || null,
  sectionId: filters.sectionId || null,
  subjectId: filters.subjectId || null,
  examId: filters.examId || null,
  studentId: filters.studentId || null,
  term: filters.term || null,
  status: filters.status || null,
  search: filters.search || null,
});

const buildUnavailablePayload = async (schoolId, filters = {}) => {
  const [examCount, completedExamCount, studentCount, sectionCount, subjectCount, academicYearCount] =
    await Promise.all([
      prisma.exam.count({ where: { schoolId, archivedAt: null } }),
      prisma.exam.count({ where: { schoolId, archivedAt: null, status: "completed" } }),
      prisma.studentProfile.count({ where: { user: { schoolId } } }),
      prisma.section.count({ where: { schoolId, isActive: true } }),
      prisma.subject.count({ where: { schoolId, isActive: true } }),
      prisma.academicYear.count({ where: { schoolId, isActive: true } }),
    ]);

  return {
    supported: false,
    missingData: true,
    reason:
      "Academic reporting is currently unavailable because the schema has exam metadata but no exam result, assessment, or grading tables to calculate student marks, pass/fail outcomes, and grade distributions.",
    requiredModels: REQUIRED_MODELS,
    filters: buildFilters(filters),
    schoolId,
    summary: {
      totalStudents: studentCount,
      totalExams: examCount,
      totalPublishedExams: completedExamCount,
      totalSubjects: subjectCount,
      totalSections: sectionCount,
      totalAcademicYears: academicYearCount,
      status: "data_unavailable",
      explanation:
        "Only exam metadata is available in the current schema. Student marks and grading calculations depend on additional academic result tables that do not exist yet.",
    },
    data: [],
    meta: {
      page: Number(filters.page || 1),
      pageSize: Number(filters.pageSize || 25),
      total: 0,
      totalPages: 0,
    },
  };
};

exports.getSummary = async (schoolId, filters = {}) => {
  const payload = await buildUnavailablePayload(schoolId, filters);
  return {
    ...payload,
    summary: {
      ...payload.summary,
      title: "Academic overview",
      supported: false,
    },
  };
};

exports.getStudentPerformance = async (schoolId, filters = {}) => buildUnavailablePayload(schoolId, filters);
exports.getClassPerformance = async (schoolId, filters = {}) => buildUnavailablePayload(schoolId, filters);
exports.getSectionPerformance = async (schoolId, filters = {}) => buildUnavailablePayload(schoolId, filters);
exports.getSubjectPerformance = async (schoolId, filters = {}) => buildUnavailablePayload(schoolId, filters);
exports.getExamAnalysis = async (schoolId, filters = {}) => buildUnavailablePayload(schoolId, filters);
exports.getGradeDistribution = async (schoolId, filters = {}) => buildUnavailablePayload(schoolId, filters);
exports.getTopStudents = async (schoolId, filters = {}) => buildUnavailablePayload(schoolId, filters);
exports.getAtRiskStudents = async (schoolId, filters = {}) => buildUnavailablePayload(schoolId, filters);
exports.getAcademicProgress = async (schoolId, filters = {}) => buildUnavailablePayload(schoolId, filters);

exports.getStudentPerformanceDetail = async (schoolId, studentId, filters = {}) => {
  const payload = await buildUnavailablePayload(schoolId, { ...filters, studentId });
  return {
    ...payload,
    studentId,
    title: "Student academic detail",
  };
};

exports.exportAcademicReport = async (schoolId, filters = {}) => {
  const payload = await buildUnavailablePayload(schoolId, filters);
  return {
    ...payload,
    export: {
      supported: false,
      format: "none",
      reason: "The academic result tables required for PDF, Excel, and print exports do not exist yet.",
    },
  };
};
