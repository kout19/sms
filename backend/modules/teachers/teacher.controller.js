const teacherService = require("./teacher.service");
const {
  validateCreateTeacher,
  validateUpdateTeacher,
  validationErrorItems,
} = require("./teacher.validation");
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
    const { search, classId, isActive, page, limit } = req.query;
    const result = await teacherService.listTeachers(schoolId, {
      search,
      classId,
      isActive: isActive === undefined ? undefined : isActive === "true",
      page,
      limit,
    });
    res.json({
      success: true,
      message: "Teachers retrieved",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

exports.listClasses = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const classes = await teacherService.listClassesForSchool(schoolId);
    res.json({
      success: true,
      message: "Classes retrieved",
      data: classes,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const teacher = await teacherService.getTeacherById(schoolId, req.params.id);
    if (!teacher) return next(new AppError("Teacher not found", 404));
    res.json({
      success: true,
      message: "Teacher retrieved",
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateCreateTeacher(req.body);
    if (error) rejectValidation(error);
    const teacher = await teacherService.createTeacher(schoolId, value);
    res.status(201).json({
      success: true,
      message: "Teacher created",
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateUpdateTeacher(req.body);
    if (error) rejectValidation(error);
    const teacher = await teacherService.updateTeacher(
      schoolId,
      req.params.id,
      value,
    );
    if (!teacher) return next(new AppError("Teacher not found", 404));
    res.json({
      success: true,
      message: "Teacher updated",
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const teacher = await teacherService.deactivateTeacher(
      schoolId,
      req.params.id,
    );
    if (!teacher) return next(new AppError("Teacher not found", 404));
    res.json({
      success: true,
      message: "Teacher deactivated",
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleStatus = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const teacher = await teacherService.toggleTeacherStatus(
      schoolId,
      req.params.id,
    );
    if (!teacher) return next(new AppError("Teacher not found", 404));
    res.json({
      success: true,
      message: "Teacher status updated",
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};
