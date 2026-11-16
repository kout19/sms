const Joi = require("joi");

const optionalText = (max) =>
  Joi.string().trim().max(max).allow("", null).empty("");

const uuid = Joi.string().uuid({ version: ["uuidv4", "uuidv1"] });
const attendanceStatus = Joi.string().valid("present", "absent", "late", "excused");

exports.validateAttendanceQuery = (query = {}) =>
  Joi.object({
    search: optionalText(100),
    status: attendanceStatus.allow("", null).empty(""),
    classFilter: optionalText(80),
    date: Joi.date().iso().allow("", null).empty(""),
    academicYearId: uuid.allow("", null).empty(""),
    sectionId: uuid.allow("", null).empty(""),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  })
    .unknown(false)
    .validate(query, { abortEarly: false, stripUnknown: true, convert: true });

exports.validateBulkStatus = (payload = {}) =>
  Joi.object({
    ids: Joi.array().items(uuid).min(1).required(),
    status: attendanceStatus.required(),
  })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true, convert: true });

exports.validateBulkMark = (payload = {}) =>
  Joi.object({
    date: Joi.date().iso().required(),
    entries: Joi.array()
      .items(
        Joi.object({
          id: uuid.required(),
          status: attendanceStatus.required(),
          remarks: optionalText(500),
        }).unknown(false),
      )
      .min(1)
      .required(),
  })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true, convert: true });

exports.validateStatusUpdate = (payload = {}) =>
  Joi.object({
    status: attendanceStatus.required(),
    remarks: optionalText(500),
  })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true, convert: true });

exports.validateRegisterQuery = (query = {}) =>
  Joi.object({
    sectionId: uuid.required(),
    academicYearId: uuid.required(),
    date: Joi.date().iso().required(),
  })
    .unknown(false)
    .validate(query, { abortEarly: false, stripUnknown: true, convert: true });

exports.validateSaveSession = (payload = {}) =>
  Joi.object({
    sectionId: uuid.required(),
    academicYearId: uuid.required(),
    attendanceDate: Joi.date().iso().required(),
    subjectId: uuid.allow(null).empty(""),
    teacherId: uuid.allow(null).empty(""),
    type: Joi.string().valid("daily", "subject", "period").default("daily"),
    records: Joi.array()
      .items(
        Joi.object({
          studentProfileId: uuid.required(),
          status: attendanceStatus.required(),
          remarks: optionalText(500),
        }).unknown(false),
      )
      .min(1)
      .required(),
  })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true, convert: true });

exports.validationErrorItems = (error) =>
  (error?.details ?? []).map((detail) => ({
    field: Array.isArray(detail.path) ? detail.path.join(".") : "value",
    message: detail.message.replace(/"/g, ""),
  }));
