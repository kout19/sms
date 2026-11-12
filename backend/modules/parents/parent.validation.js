const Joi = require("joi");

const optionalText = (max) => Joi.string().trim().max(max).allow(null, "");
const email = Joi.string().trim().lowercase().email().max(200);
const uuid = Joi.string().pattern(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
);
const relationship = Joi.string()
  .valid("mother", "father", "guardian", "other")
  .default("guardian");

const normalizePagination = (query) => {
  const page = Number(query.page);
  const limit = Number(query.limit);
  return {
    ...query,
    page: Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : 1,
    limit: Number.isFinite(limit)
      ? Math.min(100, Math.max(1, Math.trunc(limit)))
      : 20,
  };
};

const validateStudents = Joi.array()
  .items(
    Joi.object({
      studentId: uuid.required(),
      relationship,
    }).unknown(false),
  )
  .unique("studentId");

exports.validateListParents = (query) =>
  Joi.object({
    search: Joi.string().trim().max(100).allow("").default(""),
    status: Joi.string().valid("all", "active", "inactive").default("all"),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  })
    .unknown(false)
    .validate(normalizePagination(query), {
      abortEarly: false,
      convert: true,
    });

exports.validateStudentOptions = (query) =>
  Joi.object({
    search: Joi.string().trim().max(100).allow("").default(""),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
  })
    .unknown(false)
    .validate(normalizePagination(query), {
      abortEarly: false,
      convert: true,
    });

exports.validateCreateParent = (payload) =>
  Joi.object({
    firstName: Joi.string().trim().min(1).max(100).required(),
    lastName: Joi.string().trim().min(1).max(100).required(),
    email: email.required(),
    password: Joi.string().min(8).max(72).required(),
    phone: optionalText(30),
    students: validateStudents.default([]),
  })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validateUpdateParent = (payload) =>
  Joi.object({
    firstName: Joi.string().trim().min(1).max(100),
    lastName: Joi.string().trim().min(1).max(100),
    email,
    phone: optionalText(30),
    students: validateStudents,
  })
    .min(1)
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validateParentStatus = (payload) =>
  Joi.object({ isActive: Joi.boolean().required() })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validateParentStudents = (payload) =>
  Joi.object({ students: validateStudents.required() })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validationErrorItems = (error) =>
  error.details.map((detail) => ({
    field: detail.path.join("."),
    message: detail.message.replaceAll('"', ""),
  }));