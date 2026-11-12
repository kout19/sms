const parentService = require("./parent.service");
const {
  validateListParents,
  validateStudentOptions,
  validateCreateParent,
  validateUpdateParent,
  validateParentStatus,
  validateParentStudents,
  validationErrorItems,
} = require("./parent.validation");
const AppError = require("../../utils/AppError");

const requireSchoolId = (req) => {
  if (!req.tenant?.schoolId) {
    throw new AppError("Your account is not assigned to a school", 403);
  }
  return req.tenant.schoolId;
};

const validated = (validator, payload) => {
  const { error, value } = validator(payload);
  if (error) {
    throw new AppError("Validation failed", 400, validationErrorItems(error));
  }
  return value;
};

exports.list = async (req, res, next) => {
  try {
    const filters = validated(validateListParents, req.query);
    const result = await parentService.listParents(requireSchoolId(req), filters);
    res.json({ success: true, message: "Parents retrieved", ...result });
  } catch (error) {
    next(error);
  }
};

exports.studentOptions = async (req, res, next) => {
  try {
    const filters = validated(validateStudentOptions, req.query);
    const result = await parentService.listStudentOptions(
      requireSchoolId(req),
      filters,
    );
    res.json({
      success: true,
      message: "Student options retrieved",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const parent = await parentService.getParentById(
      requireSchoolId(req),
      req.params.id,
    );
    if (!parent) return next(new AppError("Parent not found", 404));
    res.json({ success: true, message: "Parent retrieved", data: parent });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const payload = validated(validateCreateParent, req.body);
    const parent = await parentService.createParent(
      requireSchoolId(req),
      payload,
    );
    res.status(201).json({
      success: true,
      message: "Parent created",
      data: parent,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const payload = validated(validateUpdateParent, req.body);
    const parent = await parentService.updateParent(
      requireSchoolId(req),
      req.params.id,
      payload,
    );
    if (!parent) return next(new AppError("Parent not found", 404));
    res.json({ success: true, message: "Parent updated", data: parent });
  } catch (error) {
    next(error);
  }
};

exports.updateStudents = async (req, res, next) => {
  try {
    const { students } = validated(validateParentStudents, req.body);
    const parent = await parentService.replaceParentStudents(
      requireSchoolId(req),
      req.params.id,
      students,
    );
    if (!parent) return next(new AppError("Parent not found", 404));
    res.json({
      success: true,
      message: "Parent student relationships updated",
      data: parent,
    });
  } catch (error) {
    next(error);
  }
};

exports.setStatus = async (req, res, next) => {
  try {
    const { isActive } = validated(validateParentStatus, req.body);
    const parent = await parentService.setParentStatus(
      requireSchoolId(req),
      req.params.id,
      isActive,
    );
    if (!parent) return next(new AppError("Parent not found", 404));
    res.json({
      success: true,
      message: isActive ? "Parent activated" : "Parent deactivated",
      data: parent,
    });
  } catch (error) {
    next(error);
  }
};