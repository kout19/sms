// backend/modules/teachers/teacher.validation.js
const Joi = require("joi");

const createSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow(null, ""),
  departmentId: Joi.string().allow(null, ""),
  hireDate: Joi.date().allow(null),
  qualifications: Joi.string().allow(null, ""),
  employeeId: Joi.string().allow(null, ""),
  // deliberately no schoolId, no role field accepted from client -
  // both are set server-side in teacher.service.js
});

const updateSchema = Joi.object({
  firstName: Joi.string().min(1).max(100),
  lastName: Joi.string().min(1).max(100),
  phone: Joi.string().allow(null, ""),
  departmentId: Joi.string().allow(null, ""),
  hireDate: Joi.date().allow(null),
  qualifications: Joi.string().allow(null, ""),
  employeeId: Joi.string().allow(null, ""),
}).min(1); // reject an empty update body

exports.validateCreateTeacher = (data) => createSchema.validate(data);
exports.validateUpdateTeacher = (data) => updateSchema.validate(data);
