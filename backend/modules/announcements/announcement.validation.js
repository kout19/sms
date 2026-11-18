const Joi = require("joi");

const uuid = Joi.string().uuid({ version: ["uuidv4"] });
const optionalText = (max) => Joi.string().trim().max(max).allow("", null).empty("");
const roles = ["admin", "teacher", "student", "parent", "department_head", "accountant"];
const statuses = ["draft", "scheduled", "published", "expired", "archived", "cancelled"];
const priorities = ["normal", "important", "urgent"];
const validationOptions = { abortEarly: false, stripUnknown: true };

const audience = Joi.object({
  allUsers: Joi.boolean().default(false),
  roles: Joi.array().items(Joi.string().valid(...roles)).unique().default([]),
  classIds: Joi.array().items(uuid).unique().default([]),
  sectionIds: Joi.array().items(uuid).unique().default([]),
})
  .custom((value, helpers) => {
    if (!value.allUsers && !value.roles.length && !value.classIds.length && !value.sectionIds.length) {
      return helpers.error("any.custom", { message: "Select at least one announcement audience." });
    }
    return value;
  })
  .messages({ "any.custom": "{{#message}}" });

const fields = {
  title: Joi.string().trim().min(1).max(200),
  content: Joi.string().trim().min(1).max(100000),
  priority: Joi.string().valid(...priorities),
  audience,
  expiresAt: Joi.date().iso().allow(null),
};

exports.validateCreateAnnouncement = (payload) =>
  Joi.object({
    ...fields,
    title: fields.title.required(),
    content: fields.content.required(),
    audience: audience.required(),
    priority: fields.priority.default("normal"),
    expiresAt: fields.expiresAt.default(null),
  })
    .unknown(false)
    .validate(payload, validationOptions);

exports.validateUpdateAnnouncement = (payload) =>
  Joi.object(fields).min(1).unknown(false).validate(payload, validationOptions);

exports.validateScheduleAnnouncement = (payload) =>
  Joi.object({
    scheduledFor: Joi.date().iso().greater("now").required(),
  })
    .unknown(false)
    .validate(payload, validationOptions);

exports.validateAdminList = (query) =>
  Joi.object({
    search: optionalText(100),
    status: Joi.string().valid("", "all", ...statuses).default(""),
    priority: Joi.string().valid("", "all", ...priorities).default(""),
    audience: Joi.string().valid("", "all", "everyone", "teachers", "students", "parents", "admins", "classes", "sections").default(""),
    dateFrom: Joi.date().iso().allow("", null),
    dateTo: Joi.date().iso().allow("", null),
    sort: Joi.string().valid("createdAt", "publishedAt", "scheduledFor", "title", "priority", "status").default("createdAt"),
    order: Joi.string().valid("asc", "desc").default("desc"),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  })
    .unknown(false)
    .validate(query, validationOptions);

exports.validateRecipientList = (query) =>
  Joi.object({
    search: optionalText(100),
    read: Joi.string().valid("", "all", "read", "unread").default(""),
    priority: Joi.string().valid("", "all", ...priorities).default(""),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  })
    .unknown(false)
    .validate(query, validationOptions);

exports.validateRecipientListForAdmin = (query) =>
  Joi.object({
    search: optionalText(100),
    read: Joi.string().valid("", "all", "read", "unread").default(""),
    role: Joi.string().valid("", "all", ...roles).default(""),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  })
    .unknown(false)
    .validate(query, validationOptions);

exports.validationErrorItems = (error) =>
  (error?.details ?? []).map((detail) => ({
    field: detail.path.length ? detail.path.join(".") : "value",
    message: detail.message.replaceAll('"', ""),
  }));
