const examService = require("./exam.service");
const {
  validateCreateExam,
  validateExamList,
  validateStatsQuery,
  validateUpdateExam,
  validationErrorItems,
} = require("./exam.validation");
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

exports.list = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateExamList(req.query);
    if (error) rejectValidation(error);
    const result = await examService.listExams(schoolId, value);
    res.json({ success: true, message: "Exams retrieved", ...result });
  } catch (error) {
    next(error);
  }
};

exports.options = async (req, res, next) => {
  try {
    const options = await examService.getExamOptions(requireSchoolId(req));
    res.json({ success: true, message: "Exam options retrieved", data: options });
  } catch (error) {
    next(error);
  }
};

exports.stats = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateStatsQuery(req.query);
    if (error) rejectValidation(error);
    const stats = await examService.getExamStats(schoolId, value.academicYearId);
    res.json({ success: true, message: "Exam statistics retrieved", data: stats });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const exam = await examService.getExam(
      requireSchoolId(req),
      req.params.id,
    );
    if (!exam) return next(new AppError("Exam not found", 404));
    res.json({ success: true, message: "Exam retrieved", data: exam });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = validateCreateExam(req.body);
    if (error) rejectValidation(error);
    const exam = await examService.createExam(requireSchoolId(req), value);
    res.status(201).json({ success: true, message: "Exam created", data: exam });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { error, value } = validateUpdateExam(req.body);
    if (error) rejectValidation(error);
    const exam = await examService.updateExam(
      requireSchoolId(req),
      req.params.id,
      value,
    );
    if (!exam) return next(new AppError("Exam not found", 404));
    res.json({ success: true, message: "Exam updated", data: exam });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const exam = await examService.archiveExam(
      requireSchoolId(req),
      req.params.id,
    );
    if (!exam) return next(new AppError("Exam not found", 404));
    res.json({
      success: true,
      message: "Exam deleted from active records; its historical record was retained",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};
