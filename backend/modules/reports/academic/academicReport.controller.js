const academicReportService = require("./academicReport.service");
const { validateAcademicReportQuery, validationErrorItems } = require("./academicReport.validation");
const AppError = require("../../../utils/AppError");

const requireSchoolId = (req) => {
  if (!req.tenant?.schoolId) {
    throw new AppError("Your account is not assigned to a school", 403);
  }
  return req.tenant.schoolId;
};

const rejectValidation = (error) => {
  throw new AppError("Validation failed", 400, validationErrorItems(error));
};

const readFilters = (req) => ({
  academicYearId: req.query.academicYearId || undefined,
  classId: req.query.classId || undefined,
  sectionId: req.query.sectionId || undefined,
  subjectId: req.query.subjectId || undefined,
  examId: req.query.examId || undefined,
  studentId: req.query.studentId || undefined,
  term: req.query.term || undefined,
  status: req.query.status || undefined,
  search: req.query.search || undefined,
  page: req.query.page,
  pageSize: req.query.pageSize,
  sort: req.query.sort,
  order: req.query.order,
});

const sendAcademicData = (req, res, next, handler, name) => {
  (async () => {
    try {
      const schoolId = requireSchoolId(req);
      const { error, value } = validateAcademicReportQuery(req.query);
      if (error) rejectValidation(error);
      const data = await handler(schoolId, value);
      res.json({ success: true, message: `${name} retrieved`, data });
    } catch (error) {
      next(error);
    }
  })();
};

exports.getSummary = (req, res, next) =>
  sendAcademicData(req, res, next, academicReportService.getSummary, "Academic summary");

exports.getOverview = (req, res, next) =>
  sendAcademicData(req, res, next, academicReportService.getSummary, "Academic overview");

exports.getStudentPerformance = (req, res, next) =>
  sendAcademicData(req, res, next, academicReportService.getStudentPerformance, "Student performance");

exports.getClassPerformance = (req, res, next) =>
  sendAcademicData(req, res, next, academicReportService.getClassPerformance, "Class performance");

exports.getSectionPerformance = (req, res, next) =>
  sendAcademicData(req, res, next, academicReportService.getSectionPerformance, "Section performance");

exports.getSubjectPerformance = (req, res, next) =>
  sendAcademicData(req, res, next, academicReportService.getSubjectPerformance, "Subject performance");

exports.getExamAnalysis = (req, res, next) =>
  sendAcademicData(req, res, next, academicReportService.getExamAnalysis, "Exam analysis");

exports.getGradeDistribution = (req, res, next) =>
  sendAcademicData(req, res, next, academicReportService.getGradeDistribution, "Grade distribution");

exports.getTopStudents = (req, res, next) =>
  sendAcademicData(req, res, next, academicReportService.getTopStudents, "Top students");

exports.getAtRiskStudents = (req, res, next) =>
  sendAcademicData(req, res, next, academicReportService.getAtRiskStudents, "At-risk students");

exports.getAcademicProgress = (req, res, next) =>
  sendAcademicData(req, res, next, academicReportService.getAcademicProgress, "Academic progress");

exports.getStudentPerformanceDetail = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateAcademicReportQuery(req.query);
    if (error) rejectValidation(error);
    const data = await academicReportService.getStudentPerformanceDetail(schoolId, req.params.studentId, value);
    res.json({ success: true, message: "Student academic detail retrieved", data });
  } catch (error) {
    next(error);
  }
};

exports.exportAcademicReport = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateAcademicReportQuery(req.query);
    if (error) rejectValidation(error);
    const data = await academicReportService.exportAcademicReport(schoolId, value);
    res.json({ success: true, message: "Academic report export request evaluated", data });
  } catch (error) {
    next(error);
  }
};

exports.readFilters = readFilters;
