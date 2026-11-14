const subjectService = require("./subject.service");
const {
  validateCreateSubject,
  validateUpdateSubject,
  validationErrorItems,
} = require("./subject.validation");
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
    const { search, departmentId, classId, academicYear, status, isActive, page, limit } = req.query;

    const result = await subjectService.listSubjects(schoolId, {
      search,
      departmentId,
      classId,
      academicYear,
      status,
      isActive: isActive === undefined ? undefined : isActive === "true",
      page,
      limit,
    });

    res.json({
      success: true,
      message: "Subjects retrieved",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

exports.listOptions = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const data = await subjectService.listSubjectOptions(schoolId);
    res.json({
      success: true,
      message: "Subject options retrieved",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const subject = await subjectService.getSubjectById(schoolId, req.params.id);
    if (!subject) return next(new AppError("Subject not found", 404));

    res.json({
      success: true,
      message: "Subject retrieved",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateCreateSubject(req.body);
    if (error) rejectValidation(error);

    const normalized = {
      ...value,
      classIds: value.classIds ?? [],
      teacherProfileIds: value.teacherProfileIds ?? value.teacherIds ?? [],
    };

    const subject = await subjectService.createSubject(schoolId, normalized);

    res.status(201).json({
      success: true,
      message: "Subject created",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateUpdateSubject(req.body);
    if (error) rejectValidation(error);

    const normalized = {
      ...value,
      classIds: value.classIds ?? undefined,
      teacherProfileIds: value.teacherProfileIds ?? value.teacherIds ?? undefined,
    };

    const subject = await subjectService.updateSubject(schoolId, req.params.id, normalized);
    if (!subject) return next(new AppError("Subject not found", 404));

    res.json({
      success: true,
      message: "Subject updated",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const subject = await subjectService.deactivateSubject(schoolId, req.params.id);
    if (!subject) return next(new AppError("Subject not found", 404));

    res.json({
      success: true,
      message: "Subject deactivated",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleStatus = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const subject = await subjectService.toggleSubjectStatus(schoolId, req.params.id);
    if (!subject) return next(new AppError("Subject not found", 404));

    res.json({
      success: true,
      message: "Subject status updated",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};
