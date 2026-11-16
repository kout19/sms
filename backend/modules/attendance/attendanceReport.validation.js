const Joi = require("joi");

const uuid = Joi.string().uuid({ version: ["uuidv4", "uuidv1"] });
const date = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/);
const isValidDate = (value) => {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

const filters = {
  academicYearId: uuid.allow("", null).empty(""),
  startDate: date.allow("", null).empty(""),
  endDate: date.allow("", null).empty(""),
  classId: uuid.allow("", null).empty(""),
  sectionId: uuid.allow("", null).empty(""),
  subjectId: uuid.allow("", null).empty(""),
  status: Joi.string().valid("present", "absent", "late", "excused").allow("", null).empty(""),
  type: Joi.string().valid("daily", "subject", "period").allow("", null).empty(""),
  groupBy: Joi.string().valid("daily", "weekly", "monthly").default("weekly"),
};

const validateDateRange = (value, helpers) => {
  if ((value.startDate && !value.endDate) || (!value.startDate && value.endDate)) {
    return helpers.error("any.invalid", { message: "Start date and end date must be provided together" });
  }
  if (value.startDate && value.endDate) {
    if (!isValidDate(value.startDate) || !isValidDate(value.endDate)) {
      return helpers.error("any.invalid", { message: "Dates must be valid calendar dates" });
    }
    const start = Date.parse(`${value.startDate}T00:00:00.000Z`);
    const end = Date.parse(`${value.endDate}T00:00:00.000Z`);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) {
      return helpers.error("any.invalid", { message: "Start date must be on or before end date" });
    }
    if ((end - start) / 86400000 + 1 > 366) {
      return helpers.error("any.invalid", { message: "Date range cannot exceed 366 days" });
    }
  }
  return value;
};

const reportFilters = Joi.object(filters)
  .unknown(false)
  .custom(validateDateRange)
  .messages({ "any.invalid": "{{#message}}" });

exports.validateReportFilters = (query = {}) =>
  reportFilters.validate(query, { abortEarly: false, stripUnknown: true, convert: true });

exports.validateReportListQuery = (query = {}, kinds = ["absences", "late", "records"]) =>
  Joi.object({
    ...filters,
    kind: Joi.string().valid(...kinds).required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(25),
    sortBy: Joi.string().valid("absent", "late", "attendancePercentage", "date", "studentName").default("absent"),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
    minAbsent: Joi.number().integer().min(1).max(100).default(3),
    minLate: Joi.number().integer().min(2).max(100).default(2),
  })
    .unknown(false)
    .custom(validateDateRange)
    .messages({ "any.invalid": "{{#message}}" })
    .validate(query, { abortEarly: false, stripUnknown: true, convert: true });

exports.validateReportDetailQuery = (query = {}) =>
  Joi.object({
    ...filters,
    kind: Joi.string().valid("student", "teacher", "session").required(),
    id: uuid.required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
  })
    .unknown(false)
    .custom(validateDateRange)
    .messages({ "any.invalid": "{{#message}}" })
    .validate(query, { abortEarly: false, stripUnknown: true, convert: true });
