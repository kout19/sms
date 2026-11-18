const Joi = require("joi");

// Permissive UUID check: accepts any canonical 8-4-4-4-12 hex string.
// Prisma's `@db.Uuid` columns accept these, including seeded ids whose
// variant nibble is not RFC-4122 compliant.
const uuid = Joi.string()
  .pattern(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  )
  .messages({ "string.pattern.base": "{{#label}} must be a valid id" });

const optionalText = (max) =>
  Joi.string().trim().max(max).allow("", null).empty("");

const FOLDER_TABS = ["all", "unread", "read", "archived"];
const RECIPIENT_ROLES = [
  "super_admin",
  "admin",
  "teacher",
  "student",
  "parent",
  "department_head",
  "accountant",
];

exports.validateListQuery = (query = {}) =>
  Joi.object({
    search: optionalText(120),
    role: Joi.string().valid(...RECIPIENT_ROLES).allow("", null).empty(""),
    tab: Joi.string()
      .valid(...FOLDER_TABS)
      .default("all"),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  })
    .unknown(false)
    .validate(query, { abortEarly: false, stripUnknown: true, convert: true });

exports.validateRecipientQuery = (query = {}) =>
  Joi.object({
    search: optionalText(120),
    role: Joi.string().valid(...RECIPIENT_ROLES).allow("", null).empty(""),
    limit: Joi.number().integer().min(1).max(50).default(20),
  })
    .unknown(false)
    .validate(query, { abortEarly: false, stripUnknown: true, convert: true });

exports.validateSendMessage = (payload = {}) =>
  Joi.object({
    recipientIds: Joi.array().items(uuid).min(1).max(100).required(),
    subject: Joi.string().trim().min(1).max(200).required(),
    body: Joi.string().trim().min(1).max(20000).required(),
    parentMessageId: uuid.allow(null).empty(""),
  })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true, convert: true });

exports.validateReply = (payload = {}) =>
  Joi.object({
    body: Joi.string().trim().min(1).max(20000).required(),
  })
    .unknown(false)
    .validate(payload, { abortEarly: false, stripUnknown: true, convert: true });

exports.RECIPIENT_ROLES = RECIPIENT_ROLES;

exports.validationErrorItems = (error) =>
  (error?.details ?? []).map((detail) => ({
    field: Array.isArray(detail.path) ? detail.path.join(".") : "value",
    message: detail.message.replace(/"/g, ""),
  }));
