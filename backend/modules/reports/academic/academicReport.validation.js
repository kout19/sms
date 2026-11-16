const Joi = require("joi");

const uuid = Joi.string().uuid({ version: ["uuidv4"] }).allow("");
const optionalText = (max) => Joi.string().trim().max(max).allow(null, "").empty("");

const academicReportQuery = Joi.object({
  academicYearId: uuid,
  classId: uuid,
  sectionId: uuid,
  subjectId: uuid,
  examId: uuid,
  studentId: uuid,
  term: optionalText(50),
  status: optionalText(50),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(200).default(25),
  sort: optionalText(50).default("createdAt"),
  order: Joi.string().valid("asc", "desc").default("desc"),
  search: optionalText(120),
})
  .unknown(false)
  .validate;

exports.validationErrorItems = (error) =>
  (error?.details ?? []).map((detail) => ({
    field: detail.path.length ? detail.path.join(".") : "value",
    message: (detail.context?.message || detail.message).replace(/"/g, ""),
  }));

exports.validateAcademicReportQuery = (query, options = {}) =>
  academicReportQuery(query, { abortEarly: false, stripUnknown: true, ...options });
