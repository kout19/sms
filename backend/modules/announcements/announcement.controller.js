const service = require("./announcement.service");
const {
  validateCreateAnnouncement,
  validateUpdateAnnouncement,
  validateScheduleAnnouncement,
  validateAdminList,
  validateRecipientList,
  validateRecipientListForAdmin,
  validationErrorItems,
} = require("./announcement.validation");
const AppError = require("../../utils/AppError");

const schoolIdFor = (req) => {
  if (!req.tenant?.schoolId) throw new AppError("Your account is not assigned to a school", 403);
  return req.tenant.schoolId;
};
const actorFor = (req) => {
  if (!req.user?.id) throw new AppError("Authentication required", 401);
  return { id: req.user.id, role: req.user.role };
};
const rejectValidation = (error) => { throw new AppError("Validation failed", 400, validationErrorItems(error)); };
const validate = (fn, payload) => { const { error, value } = fn(payload); if (error) rejectValidation(error); return value; };
const respondNotFound = (res, next, value, label = "Announcement") => { if (!value) return next(new AppError(`${label} not found`, 404)); res.json({ success: true, message: `${label} retrieved`, data: value }); };

exports.listAdmin = async (req, res, next) => {
   try {
     const result = await service.listAnnouncements(schoolIdFor(req), actorFor(req), validate(validateAdminList, req.query)); 
     res.json({ success: true, message: "Announcements retrieved", ...result });
     }
      catch (error) { next(error);
       }
       };
exports.getAdmin = async (req, res, next) => { try { respondNotFound(res, next, await service.getAnnouncement(schoolIdFor(req), actorFor(req), req.params.id)); } catch (error) { next(error); } };
exports.create = async (req, res, next) => { try { const item = await service.createAnnouncement(schoolIdFor(req), actorFor(req), validate(validateCreateAnnouncement, req.body)); res.status(201).json({ success: true, message: "Announcement draft created", data: item }); } catch (error) { next(error); } };
exports.update = async (req, res, next) => { try { const item = await service.updateAnnouncement(schoolIdFor(req), actorFor(req), req.params.id, validate(validateUpdateAnnouncement, req.body)); if (!item) return next(new AppError("Announcement not found", 404)); res.json({ success: true, message: "Announcement updated", data: item }); } catch (error) { next(error); } };
exports.publish = async (req, res, next) => { try { const item = await service.publishAnnouncement(schoolIdFor(req), actorFor(req), req.params.id); if (!item) return next(new AppError("Announcement not found", 404)); res.json({ success: true, message: "Announcement published", data: item }); } catch (error) { next(error); } };
exports.schedule = async (req, res, next) => { try { const value = validate(validateScheduleAnnouncement, req.body); const item = await service.scheduleAnnouncement(schoolIdFor(req), actorFor(req), req.params.id, value.scheduledFor); if (!item) return next(new AppError("Announcement not found", 404)); res.json({ success: true, message: "Announcement scheduled", data: item }); } catch (error) { next(error); } };
exports.cancel = async (req, res, next) => { try { const item = await service.cancelAnnouncement(schoolIdFor(req), actorFor(req), req.params.id); if (!item) return next(new AppError("Announcement not found", 404)); res.json({ success: true, message: "Scheduled announcement cancelled", data: item }); } catch (error) { next(error); } };
exports.revertToDraft = async (req, res, next) => { try { const item = await service.revertToDraft(schoolIdFor(req), actorFor(req), req.params.id); if (!item) return next(new AppError("Announcement not found", 404)); res.json({ success: true, message: "Announcement returned to draft", data: item }); } catch (error) { next(error); } };
exports.archive = async (req, res, next) => { try { const item = await service.archiveAnnouncement(schoolIdFor(req), actorFor(req), req.params.id); if (!item) return next(new AppError("Announcement not found", 404)); res.json({ success: true, message: "Announcement archived", data: item }); } catch (error) { next(error); } };
exports.expire = async (req, res, next) => { try { const item = await service.expireAnnouncement(schoolIdFor(req), actorFor(req), req.params.id); if (!item) return next(new AppError("Announcement not found", 404)); res.json({ success: true, message: "Announcement expired", data: item }); } catch (error) { next(error); } };
exports.audienceOptions = async (req, res, next) => { try { const data = await service.getAudienceOptions(schoolIdFor(req), actorFor(req)); res.json({ success: true, message: "Announcement audience options retrieved", data }); } catch (error) { next(error); } };
exports.recipients = async (req, res, next) => { try { const data = await service.listRecipients(schoolIdFor(req), actorFor(req), req.params.id, validate(validateRecipientListForAdmin, req.query)); if (!data) return next(new AppError("Announcement not found", 404)); res.json({ success: true, message: "Announcement recipients retrieved", ...data }); } catch (error) { next(error); } };
exports.statistics = async (req, res, next) => { try { const data = await service.getStatistics(schoolIdFor(req), actorFor(req), req.params.id); if (!data) return next(new AppError("Announcement not found", 404)); res.json({ success: true, message: "Announcement statistics retrieved", data }); } catch (error) { next(error); } };
exports.listInbox = async (req, res, next) => { try { const data = await service.listInbox(schoolIdFor(req), actorFor(req).id, validate(validateRecipientList, req.query)); res.json({ success: true, message: "Announcement inbox retrieved", ...data }); } catch (error) { next(error); } };
exports.getInbox = async (req, res, next) => { try { const data = await service.getInboxAnnouncement(schoolIdFor(req), actorFor(req).id, req.params.id); res.json({ success: true, message: "Announcement retrieved", data }); } catch (error) { next(error); } };
exports.markRead = async (req, res, next) => { try { const data = await service.setReadState(schoolIdFor(req), actorFor(req).id, req.params.id, true); res.json({ success: true, message: "Announcement marked as read", data }); } catch (error) { next(error); } };
exports.markUnread = async (req, res, next) => { try { const data = await service.setReadState(schoolIdFor(req), actorFor(req).id, req.params.id, false); res.json({ success: true, message: "Announcement marked as unread", data }); } catch (error) { next(error); } };
exports.unreadCount = async (req, res, next) => { try { const data = await service.unreadCount(schoolIdFor(req), actorFor(req).id); res.json({ success: true, message: "Unread announcement count retrieved", data: { count: data } }); } catch (error) { next(error); } };
