const sanitizeHtml = require("sanitize-html");
const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RECIPIENT_VISIBLE_STATUS = "published";
const MANAGER_ROLE = "admin";

const allowedHtml = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "a", "h2", "h3", "blockquote"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
  },
};

const announcementInclude = {
  author: { select: { id: true, firstName: true, lastName: true, role: true } },
  audienceRules: {
    include: {
      class: { select: { id: true, name: true, code: true } },
      section: {
        select: {
          id: true,
          name: true,
          code: true,
          class: { select: { id: true, name: true, code: true } },
          academicYear: { select: { id: true, name: true, isCurrent: true } },
        },
      },
    },
  },
  _count: { select: { recipients: true } },
};

const recipientAnnouncementInclude = {
  announcement: {
    include: {
      author: { select: { id: true, firstName: true, lastName: true, role: true } },
      audienceRules: {
        include: {
          class: { select: { id: true, name: true, code: true } },
          section: { select: { id: true, name: true, code: true, class: { select: { id: true, name: true } } } },
        },
      },
    },
  },
};

const normalizeText = (value) => String(value ?? "").trim().replace(/\s+/g, " ");
const isManager = (actor) => actor?.role === MANAGER_ROLE;

const sanitizeContent = (content) => {
  const sanitized = sanitizeHtml(content, allowedHtml).trim();
  const text = sanitizeHtml(sanitized, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
  if (!text) throw new AppError("Announcement content must contain readable text", 400);
  return sanitized;
};

const normalizeAudience = (audience) => {
  const rules = [];
  if (audience.allUsers) rules.push({ type: "all_users" });
  for (const role of audience.roles || []) rules.push({ type: "role", role });
  for (const classId of audience.classIds || []) rules.push({ type: "class", classId });
  for (const sectionId of audience.sectionIds || []) rules.push({ type: "section", sectionId });
  return rules;
};

const toAudienceSummary = (rules = []) => ({
  allUsers: rules.some((rule) => rule.type === "all_users"),
  roles: rules.filter((rule) => rule.type === "role").map((rule) => rule.role),
  classes: rules.filter((rule) => rule.type === "class").map((rule) => rule.class),
  sections: rules.filter((rule) => rule.type === "section").map((rule) => rule.section),
});

const serializeAnnouncement = (announcement) => ({
  ...announcement,
  authorName: announcement.author ? `${announcement.author.firstName} ${announcement.author.lastName}`.trim() : "Former user",
  audience: toAudienceSummary(announcement.audienceRules),
  recipientCount: announcement._count?.recipients ?? undefined,
});

const assertExisting = async (client, schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;
  return client.announcement.findFirst({ where: { id, schoolId }, include: announcementInclude });
};

const getTeacherAssignableSections = async (client, schoolId, userId) => {
  const profile = await client.teacherProfile.findFirst({
    where: { schoolId, userId },
    select: { subjectTeacherAssignments: { where: { schoolId }, select: { classId: true } } },
  });
  if (!profile) return [];
  const legacyClassIds = profile.subjectTeacherAssignments.map((item) => item.classId).filter(Boolean);
  return client.section.findMany({
    where: {
      schoolId,
      isActive: true,
      academicYear: { is: { isActive: true, isCurrent: true } },
      OR: [
        { homeroomTeacherId: userId },
        ...(legacyClassIds.length ? [{ legacyClassId: { in: legacyClassIds } }] : []),
      ],
    },
    select: { id: true, classId: true },
  });
};

const assertAudienceReferences = async (client, schoolId, actor, rules) => {
  const classIds = rules.filter((rule) => rule.type === "class").map((rule) => rule.classId);
  const sectionIds = rules.filter((rule) => rule.type === "section").map((rule) => rule.sectionId);
  const [classes, sections] = await Promise.all([
    classIds.length
      ? client.class.findMany({ where: { schoolId, isActive: true, id: { in: classIds } }, select: { id: true } })
      : [],
    sectionIds.length
      ? client.section.findMany({ where: { schoolId, isActive: true, id: { in: sectionIds } }, select: { id: true, classId: true } })
      : [],
  ]);
  if (classes.length !== classIds.length || sections.length !== sectionIds.length) {
    throw new AppError("One or more selected classes or sections are not active in this school", 400);
  }

  if (!isManager(actor)) {
    if (rules.some((rule) => rule.type === "all_users" || rule.type === "role")) {
      throw new AppError("Teachers can target only assigned classes or sections", 403);
    }
    const assignable = await getTeacherAssignableSections(client, schoolId, actor.id);
    const allowedSections = new Set(assignable.map((section) => section.id));
    const allowedClasses = new Set(assignable.map((section) => section.classId));
    if (sectionIds.some((id) => !allowedSections.has(id)) || classIds.some((id) => !allowedClasses.has(id))) {
      throw new AppError("You can target only classes or sections assigned to you", 403);
    }
  }
};

const createAudit = (client, { announcementId, schoolId, actorId = null, action, metadata = null }) =>
  client.announcementAuditEvent.create({ data: { announcementId, schoolId, actorId, action, metadata } });

const resolveRecipientIds = async (client, schoolId, rules) => {
  const recipientIds = new Set();
  const addUsers = (users) => users.forEach((user) => recipientIds.add(user.id));
  const allUsers = rules.some((rule) => rule.type === "all_users");
  const roles = [...new Set(rules.filter((rule) => rule.type === "role").map((rule) => rule.role))];

  if (allUsers || roles.length) {
    addUsers(await client.user.findMany({
      where: { schoolId, isActive: true, ...(allUsers ? {} : { role: { in: roles } }) },
      select: { id: true },
    }));
  }

  const directSectionIds = rules.filter((rule) => rule.type === "section").map((rule) => rule.sectionId);
  const classIds = rules.filter((rule) => rule.type === "class").map((rule) => rule.classId);
  if (!directSectionIds.length && !classIds.length) return [...recipientIds];

  const selectedSections = await client.section.findMany({
    where: {
      schoolId,
      isActive: true,
      OR: [
        ...(directSectionIds.length ? [{ id: { in: directSectionIds } }] : []),
        ...(classIds.length ? [{ classId: { in: classIds }, academicYear: { is: { isActive: true, isCurrent: true } } }] : []),
      ],
    },
    select: { id: true, legacyClassId: true, homeroomTeacherId: true },
  });
  const sectionIds = selectedSections.map((section) => section.id);
  if (!sectionIds.length) return [...recipientIds];

  const enrollments = await client.enrollment.findMany({
    where: {
      schoolId,
      sectionId: { in: sectionIds },
      isActive: true,
      academicYear: { is: { isActive: true, isCurrent: true } },
      studentProfile: { is: { user: { is: { schoolId, isActive: true } } } },
    },
    select: {
      studentProfile: {
        select: {
          user: { select: { id: true } },
          parentLinks: {
            where: { schoolId, parent: { is: { schoolId, isActive: true } } },
            select: { parent: { select: { id: true } } },
          },
        },
      },
    },
  });
  for (const enrollment of enrollments) {
    recipientIds.add(enrollment.studentProfile.user.id);
    enrollment.studentProfile.parentLinks.forEach((link) => recipientIds.add(link.parent.id));
  }

  selectedSections.forEach((section) => {
    if (section.homeroomTeacherId) recipientIds.add(section.homeroomTeacherId);
  });
  const legacyClassIds = selectedSections.map((section) => section.legacyClassId).filter(Boolean);
  if (legacyClassIds.length) {
    const assignedTeachers = await client.teacherProfile.findMany({
      where: {
        schoolId,
        user: { is: { schoolId, isActive: true } },
        subjectTeacherAssignments: { some: { schoolId, classId: { in: legacyClassIds } } },
      },
      select: { userId: true },
    });
    assignedTeachers.forEach((teacher) => recipientIds.add(teacher.userId));
  }

  return [...recipientIds];
};

const publishLocked = async (client, schoolId, id, actorId, { requireDue = false } = {}) => {
  const announcement = await client.announcement.findFirst({
    where: { id, schoolId },
    include: { audienceRules: true },
  });
  if (!announcement) throw new AppError("Announcement not found", 404);
  if (!["draft", "scheduled"].includes(announcement.status)) {
    if (announcement.status === "published") return announcement;
    throw new AppError("Only a draft or scheduled announcement can be published", 409);
  }
  if (requireDue && (announcement.status !== "scheduled" || !announcement.scheduledFor || announcement.scheduledFor > new Date())) {
    return null;
  }
  const recipientIds = await resolveRecipientIds(client, schoolId, announcement.audienceRules);
  const now = new Date();
  await client.announcementRecipient.createMany({
    data: recipientIds.map((userId) => ({ announcementId: id, userId, schoolId, deliveredAt: now })),
    skipDuplicates: true,
  });
  const updated = await client.announcement.update({
    where: { id },
    data: { status: "published", publishedAt: now, scheduledFor: null },
    include: announcementInclude,
  });
  await createAudit(client, {
    announcementId: id,
    schoolId,
    actorId,
    action: "published",
    metadata: { recipientCount: recipientIds.length, scheduled: announcement.status === "scheduled" },
  });
  return updated;
};

const lockAnnouncement = (client, id) => client.$queryRaw`
  SELECT "id" FROM "announcements" WHERE "id" = ${id} FOR UPDATE
`;

exports.createAnnouncement = async (schoolId, actor, payload) => {
  const rules = normalizeAudience(payload.audience);
  return prisma.$transaction(async (tx) => {
    await assertAudienceReferences(tx, schoolId, actor, rules);
    const announcement = await tx.announcement.create({
      data: {
        schoolId,
        authorId: actor.id,
        title: normalizeText(payload.title),
        content: sanitizeContent(payload.content),
        priority: payload.priority,
        expiresAt: payload.expiresAt || null,
        audienceRules: { create: rules },
      },
      include: announcementInclude,
    });
    await createAudit(tx, { announcementId: announcement.id, schoolId, actorId: actor.id, action: "created" });
    return serializeAnnouncement(announcement);
  });
};

exports.updateAnnouncement = async (schoolId, actor, id, payload) => {
  return prisma.$transaction(async (tx) => {
    await lockAnnouncement(tx, id);
    const existing = await assertExisting(tx, schoolId, id);
    if (!existing) return null;
    if (!isManager(actor) && existing.authorId !== actor.id) throw new AppError("You can manage only your own announcements", 403);
    if (!["draft", "scheduled"].includes(existing.status)) throw new AppError("Published announcements are immutable; create a new announcement for corrections", 409);
    const data = {};
    if (payload.title !== undefined) data.title = normalizeText(payload.title);
    if (payload.content !== undefined) data.content = sanitizeContent(payload.content);
    if (payload.priority !== undefined) data.priority = payload.priority;
    if (payload.expiresAt !== undefined) data.expiresAt = payload.expiresAt || null;
    if (payload.audience !== undefined) {
      const rules = normalizeAudience(payload.audience);
      await assertAudienceReferences(tx, schoolId, actor, rules);
      await tx.announcementAudienceRule.deleteMany({ where: { announcementId: id } });
      data.audienceRules = { create: rules };
    }
    const updated = await tx.announcement.update({ where: { id }, data, include: announcementInclude });
    await createAudit(tx, { announcementId: id, schoolId, actorId: actor.id, action: "updated" });
    return serializeAnnouncement(updated);
  });
};

exports.publishAnnouncement = async (schoolId, actor, id) => {
  return prisma.$transaction(async (tx) => {
    await lockAnnouncement(tx, id);
    const existing = await assertExisting(tx, schoolId, id);
    if (!existing) return null;
    if (!isManager(actor) && existing.authorId !== actor.id) throw new AppError("You can manage only your own announcements", 403);
    return serializeAnnouncement(await publishLocked(tx, schoolId, id, actor.id));
  });
};

exports.scheduleAnnouncement = async (schoolId, actor, id, scheduledFor) => {
  return prisma.$transaction(async (tx) => {
    await lockAnnouncement(tx, id);
    const existing = await assertExisting(tx, schoolId, id);
    if (!existing) return null;
    if (!isManager(actor) && existing.authorId !== actor.id) throw new AppError("You can manage only your own announcements", 403);
    if (!["draft", "scheduled"].includes(existing.status)) throw new AppError("Only a draft or scheduled announcement can be scheduled", 409);
    const updated = await tx.announcement.update({
      where: { id },
      data: { status: "scheduled", scheduledFor: new Date(scheduledFor) },
      include: announcementInclude,
    });
    await createAudit(tx, { announcementId: id, schoolId, actorId: actor.id, action: "scheduled", metadata: { scheduledFor: updated.scheduledFor.toISOString() } });
    return serializeAnnouncement(updated);
  });
};

exports.cancelAnnouncement = async (schoolId, actor, id) => {
  return prisma.$transaction(async (tx) => {
    await lockAnnouncement(tx, id);
    const existing = await assertExisting(tx, schoolId, id);
    if (!existing) return null;
    if (!isManager(actor) && existing.authorId !== actor.id) throw new AppError("You can manage only your own announcements", 403);
    if (existing.status !== "scheduled") throw new AppError("Only scheduled announcements can be cancelled", 409);
    const updated = await tx.announcement.update({ where: { id }, data: { status: "cancelled", scheduledFor: null }, include: announcementInclude });
    await createAudit(tx, { announcementId: id, schoolId, actorId: actor.id, action: "cancelled" });
    return serializeAnnouncement(updated);
  });
};

const transitionPublished = async (schoolId, actor, id, status, action) => prisma.$transaction(async (tx) => {
  await lockAnnouncement(tx, id);
  const existing = await assertExisting(tx, schoolId, id);
  if (!existing) return null;
  if (!isManager(actor)) throw new AppError("Only school administrators can manage published announcements", 403);
  if (existing.status !== "published") throw new AppError("Only published announcements can be changed this way", 409);
  const data = { status };
  if (status === "archived") data.archivedAt = new Date();
  const updated = await tx.announcement.update({ where: { id }, data, include: announcementInclude });
  await createAudit(tx, { announcementId: id, schoolId, actorId: actor.id, action });
  return serializeAnnouncement(updated);
});

exports.archiveAnnouncement = (schoolId, actor, id) => transitionPublished(schoolId, actor, id, "archived", "archived");
exports.expireAnnouncement = (schoolId, actor, id) => transitionPublished(schoolId, actor, id, "expired", "expired");

exports.listAnnouncements = async (schoolId, actor, filters) => {
  const where = { schoolId };
  if (!isManager(actor)) where.authorId = actor.id;
  if (filters.status && filters.status !== "all") where.status = filters.status;
  if (filters.priority && filters.priority !== "all") where.priority = filters.priority;
  if (filters.dateFrom || filters.dateTo) where.createdAt = { ...(filters.dateFrom ? { gte: new Date(filters.dateFrom) } : {}), ...(filters.dateTo ? { lte: new Date(filters.dateTo) } : {}) };
  if (filters.search) where.OR = [{ title: { contains: normalizeText(filters.search), mode: "insensitive" } }];
  const audienceMap = { everyone: { type: "all_users" }, teachers: { type: "role", role: "teacher" }, students: { type: "role", role: "student" }, parents: { type: "role", role: "parent" }, admins: { type: "role", role: "admin" }, classes: { type: "class" }, sections: { type: "section" } };
  if (filters.audience && filters.audience !== "all") where.audienceRules = { some: audienceMap[filters.audience] };
  const [data, total] = await Promise.all([
    prisma.announcement.findMany({ where, include: announcementInclude, orderBy: [{ [filters.sort]: filters.order }, { id: filters.order }], skip: (filters.page - 1) * filters.limit, take: filters.limit }),
    prisma.announcement.count({ where }),
  ]);
  return { data: data.map(serializeAnnouncement), meta: { page: filters.page, limit: filters.limit, total, totalPages: Math.max(1, Math.ceil(total / filters.limit)) } };
};

exports.getAnnouncement = async (schoolId, actor, id) => {
  const announcement = await assertExisting(prisma, schoolId, id);
  if (!announcement) return null;
  if (!isManager(actor) && announcement.authorId !== actor.id) throw new AppError("You can access only your own announcements", 403);
  return serializeAnnouncement(announcement);
};

exports.getAudienceOptions = async (schoolId, actor) => {
  const sectionWhere = isManager(actor)
    ? { schoolId, isActive: true, academicYear: { is: { isActive: true, isCurrent: true } } }
    : { id: { in: (await getTeacherAssignableSections(prisma, schoolId, actor.id)).map((section) => section.id) } };
  const sections = await prisma.section.findMany({
    where: sectionWhere,
    select: { id: true, name: true, code: true, classId: true, class: { select: { id: true, name: true, code: true } }, academicYear: { select: { id: true, name: true, isCurrent: true } } },
    orderBy: [{ class: { name: "asc" } }, { name: "asc" }],
  });
  const classMap = new Map();
  sections.forEach((section) => {
    if (!classMap.has(section.classId)) classMap.set(section.classId, { ...section.class, sections: [] });
    classMap.get(section.classId).sections.push({ id: section.id, name: section.name, code: section.code, academicYear: section.academicYear });
  });
  return { canTargetSchoolWide: isManager(actor), roles: isManager(actor) ? ["admin", "teacher", "student", "parent", "department_head", "accountant"] : [], classes: [...classMap.values()] };
};

exports.listRecipients = async (schoolId, actor, id, filters) => {
  if (!isManager(actor)) throw new AppError("Only school administrators can view readership", 403);
  const announcement = await assertExisting(prisma, schoolId, id);
  if (!announcement) return null;
  const where = { announcementId: id, schoolId };
  if (filters.read === "read") where.readAt = { not: null };
  if (filters.read === "unread") where.readAt = null;
  if (filters.role && filters.role !== "all") where.user = { is: { role: filters.role } };
  if (filters.search) where.user = { is: { ...(where.user?.is || {}), OR: [{ firstName: { contains: normalizeText(filters.search), mode: "insensitive" } }, { lastName: { contains: normalizeText(filters.search), mode: "insensitive" } }, { email: { contains: normalizeText(filters.search), mode: "insensitive" } }] } };
  const [data, total] = await Promise.all([
    prisma.announcementRecipient.findMany({ where, select: { id: true, deliveredAt: true, readAt: true, user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } } }, orderBy: [{ readAt: "asc" }, { deliveredAt: "desc" }], skip: (filters.page - 1) * filters.limit, take: filters.limit }),
    prisma.announcementRecipient.count({ where }),
  ]);
  return { data, meta: { page: filters.page, limit: filters.limit, total, totalPages: Math.max(1, Math.ceil(total / filters.limit)) } };
};

exports.getStatistics = async (schoolId, actor, id) => {
  if (!isManager(actor)) throw new AppError("Only school administrators can view readership", 403);
  const announcement = await assertExisting(prisma, schoolId, id);
  if (!announcement) return null;
  const recipients = await prisma.announcementRecipient.findMany({ where: { announcementId: id, schoolId }, select: { readAt: true, user: { select: { role: true } } } });
  const byRole = {};
  let read = 0;
  recipients.forEach((recipient) => {
    if (recipient.readAt) read += 1;
    const role = recipient.user.role;
    if (!byRole[role]) byRole[role] = { total: 0, read: 0, unread: 0 };
    byRole[role].total += 1;
    if (recipient.readAt) byRole[role].read += 1;
    else byRole[role].unread += 1;
  });
  const total = recipients.length;
  return { totalRecipients: total, read, unread: total - read, readPercentage: total ? Number(((read / total) * 100).toFixed(1)) : 0, byRole };
};

exports.listInbox = async (schoolId, userId, filters) => {
  const where = {
    schoolId,
    userId,
    announcement: { is: { status: RECIPIENT_VISIBLE_STATUS, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } },
  };
  if (filters.read === "read") where.readAt = { not: null };
  if (filters.read === "unread") where.readAt = null;
  if (filters.priority && filters.priority !== "all") where.announcement.is.priority = filters.priority;
  if (filters.search) where.announcement.is.title = { contains: normalizeText(filters.search), mode: "insensitive" };
  const [rows, total] = await Promise.all([
    prisma.announcementRecipient.findMany({ where, include: recipientAnnouncementInclude, orderBy: [{ announcement: { publishedAt: "desc" } }, { id: "desc" }], skip: (filters.page - 1) * filters.limit, take: filters.limit }),
    prisma.announcementRecipient.count({ where }),
  ]);
  return { data: rows.map((row) => ({ ...serializeAnnouncement(row.announcement), recipient: { id: row.id, deliveredAt: row.deliveredAt, readAt: row.readAt } })), meta: { page: filters.page, limit: filters.limit, total, totalPages: Math.max(1, Math.ceil(total / filters.limit)) } };
};

exports.getInboxAnnouncement = async (schoolId, userId, id) => {
  if (!UUID_PATTERN.test(id)) throw new AppError("Announcement not found", 404);
  const row = await prisma.announcementRecipient.findFirst({
    where: { id: { not: "" }, userId, schoolId, announcementId: id, announcement: { is: { status: RECIPIENT_VISIBLE_STATUS, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } } },
    include: recipientAnnouncementInclude,
  });
  if (!row) throw new AppError("Announcement not found", 404);
  return { ...serializeAnnouncement(row.announcement), recipient: { id: row.id, deliveredAt: row.deliveredAt, readAt: row.readAt } };
};

exports.setReadState = async (schoolId, userId, id, isRead) => {
  if (!UUID_PATTERN.test(id)) throw new AppError("Announcement not found", 404);
  const result = await prisma.announcementRecipient.updateMany({
    where: { announcementId: id, userId, schoolId, announcement: { is: { status: RECIPIENT_VISIBLE_STATUS, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } } },
    data: { readAt: isRead ? new Date() : null },
  });
  if (!result.count) throw new AppError("Announcement not found", 404);
  return this.getInboxAnnouncement(schoolId, userId, id);
};

exports.unreadCount = (schoolId, userId) => prisma.announcementRecipient.count({
  where: { schoolId, userId, readAt: null, announcement: { is: { status: RECIPIENT_VISIBLE_STATUS, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } } },
});

exports.processDueAnnouncements = async (limit = 50) => prisma.$transaction(async (tx) => {
  const due = await tx.$queryRaw`
    SELECT "id" FROM "announcements"
    WHERE "status" = 'scheduled'::"AnnouncementStatus" AND "scheduledFor" <= NOW()
    ORDER BY "scheduledFor" ASC
    FOR UPDATE SKIP LOCKED
    LIMIT ${limit}
  `;
  let published = 0;
  for (const row of due) {
    const result = await publishLocked(tx, (await tx.announcement.findUnique({ where: { id: row.id }, select: { schoolId: true } })).schoolId, row.id, null, { requireDue: true });
    if (result) published += 1;
  }
  return published;
});

exports.expireDueAnnouncements = async (limit = 50) => prisma.$transaction(async (tx) => {
  const due = await tx.$queryRaw`
    SELECT "id", "schoolId" FROM "announcements"
    WHERE "status" = 'published'::"AnnouncementStatus" AND "expiresAt" <= NOW()
    ORDER BY "expiresAt" ASC
    FOR UPDATE SKIP LOCKED
    LIMIT ${limit}
  `;
  for (const row of due) {
    await tx.announcement.update({ where: { id: row.id }, data: { status: "expired" } });
    await createAudit(tx, { announcementId: row.id, schoolId: row.schoolId, action: "expired" });
  }
  return due.length;
});
