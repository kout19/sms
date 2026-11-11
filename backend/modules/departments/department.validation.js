const Joi = require("joi");

const textField = (maxLength) =>
  Joi.string().trim().min(1).max(maxLength).required();

const optionalText = (maxLength) =>
  Joi.string().trim().max(maxLength).allow(null, "").empty("");

const uuidField = Joi.string()
  .guid({ version: ["uuidv4", "uuidv1"] })
  .allow(null, "")
  .empty("");

exports.validateCreateDepartment = (payload) =>
  Joi.object({
    name: textField(120),
    code: textField(30),
    description: optionalText(1000),
    icon: optionalText(50),
    headTeacherId: uuidField,
    isActive: Joi.boolean().default(true),
  })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validateUpdateDepartment = (payload) =>
  Joi.object({
    name: textField(120),
    code: textField(30),
    description: optionalText(1000),
    icon: optionalText(50),
    headTeacherId: uuidField,
    isActive: Joi.boolean(),
  })
    .min(1)
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validationErrorItems = (error) =>
  error.details.map((detail) => ({
    field: detail.path.join("."),
    message: detail.message.replaceAll('"', ""),
  }));
