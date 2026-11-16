const ExcelJS = require("exceljs");
const attendanceReportService = require("./attendanceReport.service");
const {
  validateReportFilters,
  validateReportListQuery,
  validateReportDetailQuery,
} = require("./attendanceReport.validation");
const AppError = require("../../utils/AppError");

const requireSchoolAdmin = (req) => {
  if (req.user?.role !== "admin" || !req.tenant?.schoolId) {
    throw new AppError("Only school administrators can access attendance reports", 403);
  }
  return req.tenant.schoolId;
};

const rejectValidation = (error) => {
  throw new AppError("Validation failed", 400, (error?.details || []).map((detail) => ({
    field: detail.path.join(".") || "value",
    message: detail.message.replace(/"/g, ""),
  })));
};

const reportQuery = (req, res, next, handler) =>
  Promise.resolve()
    .then(() => requireSchoolAdmin(req))
    .then((schoolId) => handler(schoolId))
    .then((data) => {
      if (!res.headersSent) res.json({ success: true, data });
    })
    .catch(next);

exports.getOptions = (req, res, next) =>
  reportQuery(req, res, next, (schoolId) => attendanceReportService.getOptions(schoolId));

exports.getReport = (req, res, next) =>
  reportQuery(req, res, next, async (schoolId) => {
    const { error, value } = validateReportFilters(req.query);
    if (error) rejectValidation(error);
    return attendanceReportService.getReport(schoolId, value);
  });

exports.getStudents = (req, res, next) =>
  reportQuery(req, res, next, async (schoolId) => {
    const { error, value } = validateReportListQuery(req.query, ["absences", "late"]);
    if (error) rejectValidation(error);
    const { kind, page, limit, sortBy, sortOrder, minAbsent, minLate, ...filters } = value;
    return attendanceReportService.getStudentReport(
      schoolId, filters, kind, page, limit, sortBy, sortOrder, minAbsent, minLate,
    );
  });

exports.getRecords = (req, res, next) =>
  reportQuery(req, res, next, async (schoolId) => {
    const { error, value } = validateReportListQuery(req.query, ["records"]);
    if (error) rejectValidation(error);
    const { page, limit, ...filters } = value;
    return attendanceReportService.getRecords(schoolId, filters, page, limit);
  });

exports.getDetail = (req, res, next) =>
  reportQuery(req, res, next, async (schoolId) => {
    const { error, value } = validateReportDetailQuery(req.query);
    if (error) rejectValidation(error);
    const { kind, id, page, limit, ...filters } = value;
    return attendanceReportService.getDetail(schoolId, filters, kind, id, page, limit);
  });

exports.exportReport = (req, res, next) =>
  reportQuery(req, res, next, async (schoolId) => {
    const { error, value } = validateReportFilters(req.query);
    if (error) rejectValidation(error);
    const [report, options, records] = await Promise.all([
      attendanceReportService.getReport(schoolId, value),
      attendanceReportService.getOptions(schoolId),
      attendanceReportService.getExportRecords(schoolId, value),
    ]);
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "School Management System";
    workbook.created = new Date();
    const sheet = workbook.addWorksheet("Attendance Report");
    sheet.columns = [
      { header: "Report", key: "report", width: 26 },
      { header: "Value", key: "value", width: 30 },
    ];
    sheet.insertRow(1, ["Attendance Report"]);
    sheet.addRows([
      { report: "School", value: options.schoolName },
      {
        report: "Academic year",
        value: options.academicYears.find((year) => year.id === value.academicYearId)?.name || "All academic years",
      },
      { report: "Reporting period", value: value.startDate ? `${value.startDate} to ${value.endDate}` : "All dates" },
      { report: "Class", value: options.classes.find((item) => item.id === value.classId)?.name || "All classes" },
      {
        report: "Section",
        value: options.sections.find((item) => item.id === value.sectionId)?.name || "All sections",
      },
      { report: "Subject", value: options.subjects.find((item) => item.id === value.subjectId)?.name || "All subjects" },
      { report: "Status", value: value.status || "All statuses" },
      { report: "Session type", value: value.type || "All types" },
      { report: "Generated", value: new Date().toISOString() },
      { report: "Total attendance records", value: report.summary.total },
      { report: "Present", value: report.summary.present },
      { report: "Absent", value: report.summary.absent },
      { report: "Late", value: report.summary.late },
      { report: "Excused", value: report.summary.excused },
      { report: "Attendance percentage", value: `${report.summary.attendancePercentage}%` },
    ]);
    sheet.addRow([]);
    sheet.addRow(["Attendance Records"]);
    sheet.addRow(["Date", "Admission number", "Student", "Class", "Section", "Subject", "Session type", "Status"]);
    for (const record of records) {
      sheet.addRow([
        record.session.attendanceDate.toISOString().slice(0, 10),
        record.studentProfile.admissionNo || "—",
        `${record.studentProfile.user.firstName} ${record.studentProfile.user.lastName}`.trim(),
        record.session.section.class.name,
        record.session.section.name,
        record.session.subject?.name || "—",
        record.session.type,
        record.status,
      ]);
    }
    return workbook.xlsx.writeBuffer().then((buffer) => {
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", 'attachment; filename="attendance-report.xlsx"');
      res.send(Buffer.from(buffer));
    });
  });
