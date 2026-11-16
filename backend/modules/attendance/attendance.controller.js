const attendanceService = require("./attendance.service");
const {
  validateAttendanceQuery,
  validateBulkStatus,
  validateBulkMark,
  validateStatusUpdate,
  validateRegisterQuery,
  validateSaveSession,
  validationErrorItems,
} = require("./attendance.validation");
const AppError = require("../../utils/AppError");

const requireSchoolId = (req) => {
  if (!req.tenant?.schoolId) {
    throw new AppError("Your account is not assigned to a school", 403);
  }
  return req.tenant.schoolId;
};

const rejectValidation = (error) => {
  throw new AppError("Validation failed", 400, validationErrorItems(error));
};

exports.getSummary = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const result = await attendanceService.getSummary(schoolId);
    res.json({ success: true, message: "Attendance summary retrieved", data: result });
  } catch (error) {
    next(error);
  }
};

exports.getTrend = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const result = await attendanceService.getTrend(schoolId);
    res.json({ success: true, message: "Attendance trend retrieved", data: result });
  } catch (error) {
    next(error);
  }
};

exports.getTodayBreakdown = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const result = await attendanceService.getTodayBreakdown(schoolId);
    res.json({ success: true, message: "Attendance breakdown retrieved", data: result });
  } catch (error) {
    next(error);
  }
};

exports.getRecords = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateAttendanceQuery(req.query);
    if (error) rejectValidation(error);
    const records = await attendanceService.getAttendanceRecords(schoolId, value);
    res.json({ success: true, message: "Attendance records retrieved", data: records });
  } catch (error) {
    next(error);
  }
};

exports.getRegister = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateRegisterQuery(req.query);
    if (error) rejectValidation(error);
    const register = await attendanceService.getRegisterForSection(schoolId, value);
    res.json({ success: true, message: "Attendance register retrieved", data: register });
  } catch (error) {
    next(error);
  }
};

exports.saveSession = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateSaveSession(req.body);
    if (error) rejectValidation(error);
    const result = await attendanceService.createOrUpdateSession(schoolId, value);
    res.status(201).json({ success: true, message: "Attendance saved", data: result });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateStatusUpdate(req.body);
    if (error) rejectValidation(error);
    const record = await attendanceService.updateStatus(schoolId, req.params.id, value);
    res.json({ success: true, message: "Attendance status updated", data: record });
  } catch (error) {
    next(error);
  }
};

exports.bulkUpdate = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateBulkStatus(req.body);
    if (error) rejectValidation(error);
    const result = await attendanceService.bulkUpdateStatus(schoolId, value.ids, value.status);
    res.json({ success: true, message: "Attendance statuses updated", data: result });
  } catch (error) {
    next(error);
  }
};

exports.bulkMark = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateBulkMark(req.body);
    if (error) rejectValidation(error);
    const result = await attendanceService.bulkMarkAttendance(schoolId, value);
    res.json({ success: true, message: "Attendance saved", data: result });
  } catch (error) {
    next(error);
  }
};

exports.listSessions = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const result = await attendanceService.listSessions(schoolId, req.query);
    res.json({ success: true, message: "Attendance sessions retrieved", data: result });
  } catch (error) {
    next(error);
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const result = await attendanceService.getSession(schoolId, req.params.id);
    res.json({ success: true, message: "Attendance session retrieved", data: result });
  } catch (error) {
    next(error);
  }
};

exports.deleteSession = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const result = await attendanceService.deleteSession(schoolId, req.params.id);
    res.json({ success: true, message: "Attendance session deleted", data: result });
  } catch (error) {
    next(error);
  }
};
