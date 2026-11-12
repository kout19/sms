const accountantService = require("./accountant.service");
const {
  validateListAccountants,
  validateCreateAccountant,
  validateUpdateAccountant,
  validateAccountantStatus,
  validationErrorItems,
} = require("./accountant.validation");
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
    const { error, value } = validateListAccountants(req.query);
    if (error) rejectValidation(error);

    const result = await accountantService.listAccountants(schoolId, value);
    res.json({
      success: true,
      message: "Accountants retrieved",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

exports.overview = async (req, res, next) => {
  try {
    const overview = await accountantService.getAccountantOverview(
      requireSchoolId(req),
    );
    res.json({
      success: true,
      message: "Accountant overview retrieved",
      data: overview,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const accountant = await accountantService.getAccountantById(
      requireSchoolId(req),
      req.params.id,
    );
    if (!accountant) return next(new AppError("Accountant not found", 404));

    res.json({
      success: true,
      message: "Accountant retrieved",
      data: accountant,
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = validateCreateAccountant(req.body);
    if (error) rejectValidation(error);

    const accountant = await accountantService.createAccountant(
      requireSchoolId(req),
      value,
    );
    res.status(201).json({
      success: true,
      message: "Accountant created",
      data: accountant,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { error, value } = validateUpdateAccountant(req.body);
    if (error) rejectValidation(error);

    const accountant = await accountantService.updateAccountant(
      requireSchoolId(req),
      req.params.id,
      value,
    );
    if (!accountant) return next(new AppError("Accountant not found", 404));

    res.json({
      success: true,
      message: "Accountant updated",
      data: accountant,
    });
  } catch (error) {
    next(error);
  }
};

exports.setStatus = async (req, res, next) => {
  try {
    const { error, value } = validateAccountantStatus(req.body);
    if (error) rejectValidation(error);

    const accountant = await accountantService.setAccountantStatus(
      requireSchoolId(req),
      req.params.id,
      value.isActive,
    );
    if (!accountant) return next(new AppError("Accountant not found", 404));

    res.json({
      success: true,
      message: value.isActive
        ? "Accountant activated"
        : "Accountant deactivated",
      data: accountant,
    });
  } catch (error) {
    next(error);
  }
};
