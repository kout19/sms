const Joi = require("joi");

const optionalText = (max) =>
  Joi.string().trim().max(max).allow(null, "").empty("");

const requiredText = (max) => Joi.string().trim().min(1).max(max).required();
const uuid = Joi.string().uuid({ version: ["uuidv4", "uuidv1"] });

exports.validateClassList = (query) =>
  Joi.object({
    search: optionalText(100),
    academicYear: optionalText(30),
    status: Joi.string().valid("", "active", "inactive").default(""),
    sort: Joi.string().valid("name", "code", "status").default("name"),
    order: Joi.string().valid("asc", "desc").default("asc"),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  })
    .unknown(false)
    .validate(query, { abortEarly: false, stripUnknown: true, convert: true });

exports.validateAcademicYearQuery = (query) =>
  Joi.object({ academicYear: optionalText(30) })
    .unknown(false)
    .validate(query, { abortEarly: false, stripUnknown: true });

exports.validateCreateClass = (payload) =>
  Joi.object({
    name: requiredText(120),
    code: requiredText(30),
    description: optionalText(1000),
    isActive: Joi.boolean().default(true),
  })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validateUpdateClass = (payload) =>
  Joi.object({
    name: Joi.string().trim().min(1).max(120),
    code: Joi.string().trim().min(1).max(30),
    description: optionalText(1000),
  })
    .min(1)
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validateClassStatus = (payload) =>
  Joi.object({ isActive: Joi.boolean().required() })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validateCreateSection = (payload) =>
  Joi.object({
    name: requiredText(50),
    code: requiredText(30),
    academicYear: requiredText(30),
    capacity: Joi.number().integer().positive().allow(null),
    room: optionalText(80),
    homeroomTeacherId: uuid.allow(null, ""),
    isActive: Joi.boolean().default(true),
  })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validateUpdateSection = (payload) =>
  Joi.object({
    name: Joi.string().trim().min(1).max(50),
    code: Joi.string().trim().min(1).max(30),
    academicYear: Joi.string().trim().min(1).max(30),
    capacity: Joi.number().integer().positive().allow(null),
    room: optionalText(80),
    homeroomTeacherId: uuid.allow(null, ""),
  })
    .min(1)
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validateSectionStatus = (payload) =>
  Joi.object({ isActive: Joi.boolean().required() })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validationErrorItems = (error) =>
  (error?.details ?? []).map((detail) => ({
    field: Array.isArray(detail.path) ? detail.path.join(".") : "value",
    message: detail.message.replace(/"/g, ""),
  }));
