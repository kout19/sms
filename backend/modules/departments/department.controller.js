const departmentService = require("./department.service");
const {
  validateCreateDepartment,
  validateUpdateDepartment,
  validationErrorItems,
} = require("./department.validation");
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
    const { search, status, isActive, page, limit } = req.query;
    const result = await departmentService.listDepartments(schoolId, {
      search,
      status,
      isActive: isActive === undefined ? undefined : isActive === "true",
      page,
      limit,
    });

    res.json({
      success: true,
      message: "Departments retrieved",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const department = await departmentService.getDepartmentById(
      schoolId,
      req.params.id,
    );
    if (!department) return next(new AppError("Department not found", 404));

    res.json({
      success: true,
      message: "Department retrieved",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

exports.listHeadOptions = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const users = await departmentService.listHeadTeachers(schoolId);
    res.json({
      success: true,
      message: "Department head options retrieved",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateCreateDepartment(req.body);
    if (error) rejectValidation(error);

    const department = await departmentService.createDepartment(
      schoolId,
      value,
    );
    res.status(201).json({
      success: true,
      message: "Department created",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const { error, value } = validateUpdateDepartment(req.body);
    if (error) rejectValidation(error);

    const department = await departmentService.updateDepartment(
      schoolId,
      req.params.id,
      value,
    );
    if (!department) return next(new AppError("Department not found", 404));

    res.json({
      success: true,
      message: "Department updated",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const department = await departmentService.deactivateDepartment(
      schoolId,
      req.params.id,
    );
    if (!department) return next(new AppError("Department not found", 404));

    res.json({
      success: true,
      message: "Department deactivated",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleStatus = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const department = await departmentService.toggleDepartmentStatus(
      schoolId,
      req.params.id,
    );
    if (!department) return next(new AppError("Department not found", 404));

    res.json({
      success: true,
      message: "Department status updated",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};
