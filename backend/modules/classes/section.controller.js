const classService = require("./class.service");
const {
  validateUpdateSection,
  validateSectionStatus,
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

exports.getOne = async (req, res, next) => {
  try {
    const section = await classService.getSection(
      requireSchoolId(req),
      req.params.id,
    );
    if (!section) return next(new AppError("Section not found", 404));
    res.json({ success: true, message: "Section retrieved", data: section });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { error, value } = validateUpdateSection(req.body);
    if (error) rejectValidation(error);
    const section = await classService.updateSection(
      requireSchoolId(req),
      req.params.id,
      value,
    );
    if (!section) return next(new AppError("Section not found", 404));
    res.json({ success: true, message: "Section updated", data: section });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { error, value } = validateSectionStatus(req.body);
    if (error) rejectValidation(error);
    const section = await classService.updateSectionStatus(
      requireSchoolId(req),
      req.params.id,
      value.isActive,
    );
    if (!section) return next(new AppError("Section not found", 404));
    res.json({ success: true, message: "Section status updated", data: section });
  } catch (error) {
    next(error);
  }
};
