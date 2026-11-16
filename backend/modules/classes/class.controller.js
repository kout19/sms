const classService = require("./class.service");
const {
  validateClassList,
  validateCreateClass,
  validateUpdateClass,
  validateClassStatus,
  validateCreateSection,
  validateAcademicYearQuery,
  validationErrorItems,
} = require("./class.validation");
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
    const { error, value } = validateClassList(req.query);
    if (error) rejectValidation(error);
    const result = await classService.listClasses(schoolId, value);
    res.json({ success: true, message: "Classes retrieved", ...result });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateAcademicYearQuery(req.query);
    if (error) rejectValidation(error);
    const classRecord = await classService.getClass(
      schoolId,
      req.params.id,
      value.academicYear,
    );
    if (!classRecord) return next(new AppError("Class not found", 404));
    res.json({ success: true, message: "Class retrieved", data: classRecord });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateCreateClass(req.body);
    if (error) rejectValidation(error);
    const classRecord = await classService.createClass(schoolId, value);
    res.status(201).json({ success: true, message: "Class created", data: classRecord });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateUpdateClass(req.body);
    if (error) rejectValidation(error);
    const classRecord = await classService.updateClass(
      schoolId,
      req.params.id,
      value,
    );
    if (!classRecord) return next(new AppError("Class not found", 404));
    res.json({ success: true, message: "Class updated", data: classRecord });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateClassStatus(req.body);
    if (error) rejectValidation(error);
    const classRecord = await classService.updateClassStatus(
      schoolId,
      req.params.id,
      value.isActive,
    );
    if (!classRecord) return next(new AppError("Class not found", 404));
    res.json({ success: true, message: "Class status updated", data: classRecord });
  } catch (error) {
    next(error);
  }
};

exports.listSections = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateAcademicYearQuery(req.query);
    if (error) rejectValidation(error);
    const sections = await classService.listSections(
      schoolId,
      req.params.classId,
      value.academicYear,
    );
    if (!sections) return next(new AppError("Class not found", 404));
    res.json({ success: true, message: "Sections retrieved", data: sections });
  } catch (error) {
    next(error);
  }
};

exports.createSection = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateCreateSection(req.body);
    if (error) rejectValidation(error);
    const section = await classService.createSection(
      schoolId,
      req.params.classId,
      value,
    );
    if (!section) return next(new AppError("Class not found or inactive", 404));
    res.status(201).json({ success: true, message: "Section created", data: section });
  } catch (error) {
    next(error);
  }
};
