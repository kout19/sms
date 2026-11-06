const Joi = require("joi");

const optionalText = (max) =>
  Joi.string().trim().max(max).allow(null, "").empty("");

const optionalDate = Joi.date().iso().allow(null, "").empty("");

const passwordField = Joi.string().min(8).max(72);

const profileFields = {
  phone: optionalText(30),
  employeeId: optionalText(50),
  qualifications: optionalText(2000),
  hireDate: optionalDate,
};

exports.validateCreateTeacher = (payload) =>
  Joi.object({
    firstName: Joi.string().trim().min(1).max(100).required(),
    lastName: Joi.string().trim().min(1).max(100).required(),
    email: Joi.string().trim().lowercase().email().max(200).required(),
    password: passwordField.required(),
    isActive: Joi.boolean().default(true),
    ...profileFields,
  })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validateUpdateTeacher = (payload) =>
  Joi.object({
    firstName: Joi.string().trim().min(1).max(100),
    lastName: Joi.string().trim().min(1).max(100),
    email: Joi.string().trim().lowercase().email().max(200),
    password: passwordField.allow("").optional(),
    isActive: Joi.boolean(),
    ...profileFields,
  })
    .min(1)
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validationErrorItems = (error) =>
  error.details.map((detail) => ({
    field: detail.path.join("."),
    message: detail.message.replaceAll('"', ""),
  }));
