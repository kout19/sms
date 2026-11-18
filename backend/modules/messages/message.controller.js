const messageService = require("./message.service");
const {
  validateListQuery,
  validateRecipientQuery,
  validateSendMessage,
  validateReply,
  validationErrorItems,
} = require("./message.validation");
const AppError = require("../../utils/AppError");

const requireSchoolId = (req) => {
  if (!req.tenant?.schoolId) {
    throw new AppError("Your account is not assigned to a school", 403);
  }
  return req.tenant.schoolId;
};

const requireUserId = (req) => {
  if (!req.user?.id) {
    throw new AppError("Authentication required", 401);
  }
  return req.user.id;
};

const rejectValidation = (error) => {
  throw new AppError("Validation failed", 400, validationErrorItems(error));
};

exports.listInbox = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const userId = requireUserId(req);
    const { error, value } = validateListQuery(req.query);
    if (error) rejectValidation(error);
    const result = await messageService.listInbox(schoolId, userId, value);
    res.json({ success: true, message: "Inbox retrieved", ...result });
  } catch (error) {
    next(error);
  }
};

exports.listSent = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const userId = requireUserId(req);
    const { error, value } = validateListQuery(req.query);
    if (error) rejectValidation(error);
    const result = await messageService.listSent(schoolId, userId, value);
    res.json({ success: true, message: "Sent messages retrieved", ...result });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const userId = requireUserId(req);
    const message = await messageService.getMessage(
      schoolId,
      userId,
      req.params.id,
    );
    res.json({ success: true, message: "Message retrieved", data: message });
  } catch (error) {
    next(error);
  }
};

exports.getThread = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const userId = requireUserId(req);
    const thread = await messageService.getConversationThread(
      schoolId,
      userId,
      req.params.id,
    );
    res.json({ success: true, message: "Conversation retrieved", data: thread });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const userId = requireUserId(req);
    const { error, value } = validateSendMessage(req.body);
    if (error) rejectValidation(error);
    const result = await messageService.sendMessage(schoolId, userId, value);
    res.status(201).json({ success: true, message: "Message sent", data: result });
  } catch (error) {
    next(error);
  }
};

exports.reply = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const userId = requireUserId(req);
    const { error, value } = validateReply(req.body);
    if (error) rejectValidation(error);
    const result = await messageService.replyToMessage(
      schoolId,
      userId,
      req.params.id,
      value.body,
    );
    res.status(201).json({ success: true, message: "Reply sent", data: result });
  } catch (error) {
    next(error);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const userId = requireUserId(req);
    const result = await messageService.setReadState(
      schoolId,
      userId,
      req.params.id,
      true,
    );
    res.json({ success: true, message: "Message marked as read", data: result });
  } catch (error) {
    next(error);
  }
};

exports.markUnread = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const userId = requireUserId(req);
    const result = await messageService.setReadState(
      schoolId,
      userId,
      req.params.id,
      false,
    );
    res.json({ success: true, message: "Message marked as unread", data: result });
  } catch (error) {
    next(error);
  }
};

exports.archive = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const userId = requireUserId(req);
    const result = await messageService.setArchiveState(
      schoolId,
      userId,
      req.params.id,
      true,
    );
    res.json({ success: true, message: "Message archived", data: result });
  } catch (error) {
    next(error);
  }
};

exports.unarchive = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const userId = requireUserId(req);
    const result = await messageService.setArchiveState(
      schoolId,
      userId,
      req.params.id,
      false,
    );
    res.json({ success: true, message: "Message unarchived", data: result });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const userId = requireUserId(req);
    const result = await messageService.moveToTrash(
      schoolId,
      userId,
      req.params.id,
    );
    res.json({
      success: true,
      message: "Message moved to trash",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.unreadCount = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const userId = requireUserId(req);
    const result = await messageService.getUnreadCount(schoolId, userId);
    res.json({ success: true, message: "Unread count retrieved", data: result });
  } catch (error) {
    next(error);
  }
};

exports.recipients = async (req, res, next) => {
  try {
    const schoolId = requireSchoolId(req);
    const userId = requireUserId(req);
    const { error, value } = validateRecipientQuery(req.query);
    if (error) rejectValidation(error);
    const result = await messageService.searchRecipients(schoolId, userId, value);
    res.json({ success: true, message: "Recipients retrieved", data: result });
  } catch (error) {
    next(error);
  }
};
