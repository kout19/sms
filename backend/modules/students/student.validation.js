const Joi = require("joi");

const GENDERS = ["female", "male", "other"];

const optionalText = (max) =>
  Joi.string().trim().max(max).allow(null, "").empty("");

const optionalDate = Joi.date().iso().allow(null, "").empty("");

const dateOfBirth = optionalDate.max("now").min("1900-01-01").messages({
  "date.max": "Date of birth must be in the past",
  "date.min": "Date of birth is not valid",
});

const gender = Joi.string()
  .trim()
  .lowercase()
  .valid(...GENDERS)
  .allow(null, "")
  .empty("");

const classId = Joi.string().uuid().allow(null, "").empty("");
const parentLinks = Joi.array()
  .items(
    Joi.object({
      parentId: Joi.string()
        .pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
        .required(),
      relationship: Joi.string()
        .valid("mother", "father", "guardian", "other")
        .default("guardian"),
    }).unknown(false),
  )
  .unique("parentId");

const profileFields = {
  phone: optionalText(30),
  admissionNo: optionalText(50),
  dateOfBirth,
  gender,
  enrollmentDate: optionalDate,
  classId,
  previousSchool: optionalText(150),
  medicalNotes: optionalText(2000),
  address: optionalText(300),
  guardianName: optionalText(150),
  guardianPhone: optionalText(30),
  guardianEmail: Joi.string().trim().lowercase().email().allow(null, "").empty(""),
};

const nameFields = {
  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().trim().lowercase().email().max(200).required(),
};

const passwordField = Joi.string().min(8).max(72);

exports.GENDERS = GENDERS;

exports.validateCreateStudent = (payload) =>
  Joi.object({
    ...nameFields,
    password: passwordField.required(),
    isActive: Joi.boolean().default(true),
    parents: parentLinks.default([]),
    ...profileFields,
  })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validateUpdateStudent = (payload) =>
  Joi.object({
    firstName: Joi.string().trim().min(1).max(100),
    lastName: Joi.string().trim().min(1).max(100),
    email: Joi.string().trim().lowercase().email().max(200),
    password: passwordField.allow("").optional(),
    isActive: Joi.boolean(),
    parents: parentLinks,
    ...profileFields,
  })
    .min(1)
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validateImportRow = (payload) =>
  Joi.object({
    ...nameFields,
    password: passwordField.required(),
    phone: optionalText(30),
    admissionNo: optionalText(50),
    dateOfBirth,
    gender,
    enrollmentDate: optionalDate,
    grade: optionalText(30),
    section: optionalText(30),
    academicYear: optionalText(20),
    previousSchool: optionalText(150),
    medicalNotes: optionalText(2000),
    address: optionalText(300),
    guardianName: optionalText(150),
    guardianPhone: optionalText(30),
    guardianEmail: Joi.string()
      .trim()
      .lowercase()
      .email()
      .allow(null, "")
      .empty(""),
  })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true });

exports.validationErrorItems = (error) =>
  error.details.map((detail) => ({
    field: detail.path.join("."),
    message: detail.message.replaceAll('"', ""),
  }));
