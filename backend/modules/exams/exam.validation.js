const Joi = require("joi");

const uuid = Joi.string().uuid({ version: ["uuidv4"] });
const optionalText = (max) => Joi.string().trim().max(max).allow(null, "").empty("");
const requiredText = (max) => Joi.string().trim().min(1).max(max).required();
const time = Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).allow(null, "").empty("");
const marks = Joi.number().min(0).precision(2);

const examFields = {
  academicYearId: uuid,
  sectionId: uuid,
  subjectId: uuid,
  name: Joi.string().trim().min(1).max(120),
  description: optionalText(1000),
  type: Joi.string().trim().min(1).max(50),
  term: optionalText(50),
  examDate: Joi.date().iso(),
  startTime: time,
  endTime: time,
  durationMinutes: Joi.number().integer().min(1).max(1440).allow(null),
  totalMarks: Joi.number().greater(0).precision(2),
  passingMarks: marks,
  status: Joi.string().valid("draft", "scheduled", "ongoing", "completed", "cancelled"),
};

const validateMarksAndTimes = (value, helpers) => {
  if (
    value.totalMarks !== undefined &&
    value.passingMarks !== undefined &&
    value.passingMarks > value.totalMarks
  ) {
    return helpers.error("any.custom", { message: "Passing marks cannot exceed total marks." });
  }
  if (Boolean(value.startTime) !== Boolean(value.endTime)) {
    return helpers.error("any.custom", { message: "Start time and end time must be provided together." });
  }
  if (value.startTime && value.endTime && value.startTime >= value.endTime) {
    return helpers.error("any.custom", { message: "End time must be later than start time." });
  }
  return value;
};

const validationOptions = { abortEarly: false, stripUnknown: true };

exports.validateCreateExam = (payload) =>
  Joi.object({
    ...examFields,
    academicYearId: uuid.required(),
    sectionId: uuid.required(),
    subjectId: uuid.required(),
    name: requiredText(120),
    type: requiredText(50),
    examDate: Joi.date().iso().required(),
    totalMarks: Joi.number().greater(0).precision(2).required(),
    passingMarks: marks.required(),
  })
    .custom(validateMarksAndTimes)
    .unknown(false)
    .validate(payload, validationOptions);

exports.validateUpdateExam = (payload) =>
  Joi.object(examFields)
    .with("totalMarks", "passingMarks")
    .custom(validateMarksAndTimes)
    .min(1)
    .unknown(false)
    .validate(payload, validationOptions);

exports.validateExamList = (query) =>
  Joi.object({
    search: optionalText(100),
    academicYearId: uuid.allow(""),
    classId: uuid.allow(""),
    subjectId: uuid.allow(""),
    type: optionalText(50),
    status: Joi.string()
      .valid("", "draft", "scheduled", "ongoing", "completed", "cancelled", "archived")
      .default(""),
    sort: Joi.string().valid("name", "type", "examDate", "status", "createdAt").default("examDate"),
    order: Joi.string().valid("asc", "desc").default("asc"),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  })
    .unknown(false)
    .validate(query, validationOptions);

exports.validateStatsQuery = (query) =>
  Joi.object({ academicYearId: uuid.allow("") })
    .unknown(false)
    .validate(query, validationOptions);

exports.validationErrorItems = (error) =>
  (error?.details ?? []).map((detail) => ({
    field: detail.path.length ? detail.path.join(".") : "value",
    message: (detail.context?.message || detail.message).replace(/"/g, ""),
  }));
