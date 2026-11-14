const Joi = require("joi");

const textField = (maxLength) =>
  Joi.string().trim().min(1).max(maxLength).required();

const optionalText = (maxLength) =>
  Joi.string().trim().max(maxLength).allow(null, "").empty("");

const uuidField = Joi.string()
  .guid({ version: ["uuidv4", "uuidv1"] })
  .allow(null, "")
  .empty("");

const uuidList = Joi.array().items(uuidField).unique().default([]);
const optionalUuidList = Joi.array().items(uuidField).unique();

exports.validateCreateSubject = (payload) =>
  Joi.object({
    name: textField(120),
    code: textField(40),
    departmentId: uuidField,
    description: optionalText(1000),
    academicYear: optionalText(30),
    isActive: Joi.boolean().default(true),
    classIds: uuidList,
    teacherIds: uuidList,
    teacherProfileIds: uuidList,
  })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validateUpdateSubject = (payload) =>
  Joi.object({
    name: Joi.string().trim().min(1).max(120),
    code: Joi.string().trim().min(1).max(40),
    departmentId: uuidField,
    description: optionalText(1000),
    academicYear: optionalText(30),
    isActive: Joi.boolean(),
    classIds: optionalUuidList,
    teacherIds: optionalUuidList,
    teacherProfileIds: optionalUuidList,
  })
    .min(1)
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validationErrorItems = (error) =>
  error.details.map((detail) => ({
    field: detail.path.join("."),
    message: detail.message.replaceAll('"', ""),
  }));
