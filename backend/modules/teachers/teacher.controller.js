// backend/modules/teachers/teacher.controller.js
const teacherService = require("./teacher.service");
const {
  validateCreateTeacher,
  validateUpdateTeacher,
} = require("./teacher.validation");
const AppError = require("../../utils/AppError");

// req.tenant.schoolId is set by tenantScope middleware, derived from the
// authenticated user's JWT/session - never trust req.body.schoolId or any
// client-supplied tenant identifier.

exports.list = async (req, res, next) => {
  try {
    const teachers = await teacherService.listTeachers(req.tenant.schoolId);
    res.json({ data: teachers });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const teacher = await teacherService.getTeacherById(
      req.tenant.schoolId,
      req.params.id,
    );
    if (!teacher) return next(new AppError("Teacher not found", 404));
    res.json({ data: teacher });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = validateCreateTeacher(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));
    const teacher = await teacherService.createTeacher(
      req.tenant.schoolId,
      value,
    );
    res.status(201).json({ data: teacher });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { error, value } = validateUpdateTeacher(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));
    const teacher = await teacherService.updateTeacher(
      req.tenant.schoolId,
      req.params.id,
      value,
    );
    if (!teacher) return next(new AppError("Teacher not found", 404));
    res.json({ data: teacher });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const deleted = await teacherService.deleteTeacher(
      req.tenant.schoolId,
      req.params.id,
    );
    if (!deleted) return next(new AppError("Teacher not found", 404));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.toggleStatus = async (req, res, next) => {
  try {
    const teacher = await teacherService.toggleTeacherStatus(
      req.tenant.schoolId,
      req.params.id,
    );
    if (!teacher) return next(new AppError("Teacher not found", 404));
    res.json({ data: teacher });
  } catch (err) {
    next(err);
  }
};
