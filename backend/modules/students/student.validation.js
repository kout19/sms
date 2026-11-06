const Joi = require("joi");

const studentProfileSchema = Joi.object({
  gradeLevel: Joi.string().trim().allow("").optional(),
  section: Joi.string().trim().allow("").optional(),
  admissionNumber: Joi.string().trim().allow("").optional(),
  rollNumber: Joi.string().trim().allow("").optional(),
  guardianName: Joi.string().trim().allow("").optional(),
  guardianPhone: Joi.string().trim().allow("").optional(),
  dateOfBirth: Joi.date().iso().allow(null).optional(),
});

const baseStudentSchema = {
  firstName: Joi.string().trim().min(1).required(),
  lastName: Joi.string().trim().min(1).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().allow("").optional(),
  isActive: Joi.boolean().optional(),
  password: Joi.string().min(6).allow("").optional(),
};

exports.validateCreateStudent = (payload) =>
  Joi.object({
    ...baseStudentSchema,
    ...studentProfileSchema.keys(),
  })
    .unknown(false)
    .validate(payload, { abortEarly: false });

exports.validateUpdateStudent = (payload) =>
  Joi.object({
    firstName: Joi.string().trim().min(1).optional(),
    lastName: Joi.string().trim().min(1).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().trim().allow("").optional(),
    isActive: Joi.boolean().optional(),
    password: Joi.string().min(6).allow("").optional(),
    gradeLevel: Joi.string().trim().allow("").optional(),
    section: Joi.string().trim().allow("").optional(),
    admissionNumber: Joi.string().trim().allow("").optional(),
    rollNumber: Joi.string().trim().allow("").optional(),
    guardianName: Joi.string().trim().allow("").optional(),
    guardianPhone: Joi.string().trim().allow("").optional(),
    dateOfBirth: Joi.date().iso().allow(null).optional(),
  })
    .unknown(false)
    .validate(payload, { abortEarly: false });
