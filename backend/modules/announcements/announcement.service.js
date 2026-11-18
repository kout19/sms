const sanitizeHtml = require("sanitize-html");
const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");
const {
  RECIPIENT_BATCH,
  SHORT_TX,
  PUBLISH_TX,
  chunk,
  normalizeAudience,
  endOfSuppliedDay,
  expiryError,
  currentYearSectionWhere,
} = require("./announcement.policy");

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MANAGER_ROLE = "admin";
const MUTABLE_STATUSES = ["draft", "scheduled"];

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

const lifecycleSelect = {
  id: true,
  schoolId: true,
  authorId: true,
  status: true,
  scheduledFor: true,
  expiresAt: true,
  audienceRules: true,
};

const inboxListSelect = {
  id: true,
  deliveredAt: true,
  readAt: true,
  announcement: {
    select: {
      id: true,
      title: true,
      priority: true,
      status: true,
      publishedAt: true,
      expiresAt: true,
      author: { select: { id: true, firstName: true, lastName: true, role: true } },
    },
  },
};

const inboxDetailInclude = {
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
const isUuid = (value) => UUID_PATTERN.test(String(value || ""));

const sanitizeContent = (content) => {
  const sanitized = sanitizeHtml(content, allowedHtml).trim();
  const text = sanitizeHtml(sanitized, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
  if (!text) throw new AppError("Announcement content must contain readable text", 400);
  return sanitized;
};

const assertExpiry = (input) => {
  const message = expiryError(input);
  if (message) throw new AppError(message, 400);
};

const audienceRuleData = (rule, announcementId) => ({
  announcementId,
  type: rule.type,
  role: rule.role ?? null,
  classId: rule.classId ?? null,
  sectionId: rule.sectionId ?? null,
});

const toAudienceSummary = (rules = []) => ({
  allUsers: rules.some((rule) => rule.type === "all_users"),
  roles: rules.filter((rule) => rule.type === "role").map((rule) => rule.role),
  classes: rules.filter((rule) => rule.type === "class").map((rule) => rule.class).filter(Boolean),
  sections: rules.filter((rule) => rule.type === "section").map((rule) => rule.section).filter(Boolean),
});

const serializeAnnouncement = (announcement, recipient) => ({
  ...announcement,
  authorName: announcement.author ? `${announcement.author.firstName} ${announcement.author.lastName}`.trim() : "Former user",
  audience: announcement.audienceRules ? toAudienceSummary(announcement.audienceRules) : undefined,
  recipientCount: announcement._count?.recipients ?? undefined,
  ...(recipient ? { recipient } : {}),
});

const visibleAnnouncement = (now = new Date()) => ({
  status: "published",
  OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
});

const assertOwner = (actor, announcement) => {
  if (!isManager(actor) && announcement.authorId !== actor.id) {
    throw new AppError("You can manage only your own announcements", 403);
  }
};

const createAudit = (client, { announcementId, schoolId, actorId = null, action, metadata = null }) =>
  client.announcementAuditEvent.create({
    data: { announcementId, schoolId, actorId, action, metadata },
  });

const lockAnnouncement = async (client, schoolId, id) => {
  const locked = await client.$queryRaw`
    SELECT "id" FROM "announcements"
    WHERE "id" = CAST(${id} AS uuid) AND "schoolId" = CAST(${schoolId} AS uuid)
    FOR UPDATE
  `;
  return locked.length > 0;
};

const loadLocked = async (client, schoolId, id) => {
  const locked = await lockAnnouncement(client, schoolId, id);
  if (!locked) return null;
  return client.announcement.findFirst({ where: { id, schoolId }, select: lifecycleSelect });
};

const reload = (schoolId, actor, id) => exports.getAnnouncement(schoolId, actor, id);

const getTeacherAssignableSections = async (client, schoolId, userId) => {
  const profile = await client.teacherProfile.findFirst({
    where: { schoolId, userId },
    select: { subjectTeacherAssignments: { where: { schoolId }, select: { classId: true } } },
  });
  const legacyClassIds = profile
    ? profile.subjectTeacherAssignments.map((item) => item.classId).filter(Boolean)
    : [];
  return client.section.findMany({
    where: currentYearSectionWhere(schoolId, {
      OR: [
        { homeroomTeacherId: userId },
        ...(legacyClassIds.length ? [{ legacyClassId: { in: legacyClassIds } }] : []),
      ],
    }),
    select: { id: true, classId: true },
  });
};

const findCurrentSections = (client, schoolId, { sectionIds = [], classIds = [] } = {}) => {
  if (!sectionIds.length && !classIds.length) return [];
  return client.section.findMany({
    where: currentYearSectionWhere(schoolId, {
      OR: [
        ...(sectionIds.length ? [{ id: { in: sectionIds } }] : []),
        ...(classIds.length ? [{ classId: { in: classIds } }] : []),
      ],
    }),
    select: { id: true, classId: true, legacyClassId: true, homeroomTeacherId: true },
  });
};

const assertAudienceReferences = async (client, schoolId, actor, rules) => {
  const classIds = rules.filter((rule) => rule.type === "class").map((rule) => rule.classId);
  const sectionIds = rules.filter((rule) => rule.type === "section").map((rule) => rule.sectionId);
  const sections = await findCurrentSections(client, schoolId, { sectionIds, classIds });
  const foundSections = new Set(sections.map((section) => section.id));
  const foundClasses = new Set(sections.map((section) => section.classId));
  if (sectionIds.some((id) => !foundSections.has(id)) || classIds.some((id) => !foundClasses.has(id))) {
    throw new AppError("One or more selected classes or sections are not active in the current academic year", 400);
  }

  if (!isManager(actor)) {
    if (rules.some((rule) => rule.type !== "section")) {
      throw new AppError("Teachers can target only sections assigned to them", 403);
    }
    const assignable = await getTeacherAssignableSections(client, schoolId, actor.id);
    const allowedSections = new Set(assignable.map((section) => section.id));
    if (sectionIds.some((id) => !allowedSections.has(id))) {
      throw new AppError("You can target only sections assigned to you", 403);
    }
  }
};

const resolveRecipientIds = async (client, schoolId, rules) => {
  const recipientIds = new Set();
  const allUsers = rules.some((rule) => rule.type === "all_users");
  const roles = [...new Set(rules.filter((rule) => rule.type === "role").map((rule) => rule.role))];

  if (allUsers || roles.length) {
    const users = await client.user.findMany({
      where: {
        schoolId,
        isActive: true,
        role: allUsers ? { not: "super_admin" } : { in: roles },
      },
      select: { id: true },
    });
    users.forEach((user) => recipientIds.add(user.id));
  }

  const sectionIds = rules.filter((rule) => rule.type === "section").map((rule) => rule.sectionId);
  const classIds = rules.filter((rule) => rule.type === "class").map((rule) => rule.classId);
  if (!sectionIds.length && !classIds.length) return [...recipientIds];

  const selectedSections = await findCurrentSections(client, schoolId, { sectionIds, classIds });
  const foundSections = new Set(selectedSections.map((section) => section.id));
  const foundClasses = new Set(selectedSections.map((section) => section.classId));
  if (sectionIds.some((id) => !foundSections.has(id)) || classIds.some((id) => !foundClasses.has(id))) {
    throw new AppError("One or more selected classes or sections are not active in the current academic year", 409);
  }

  const resolvedSectionIds = selectedSections.map((section) => section.id);
  const enrollments = await client.enrollment.findMany({
    where: {
      schoolId,
      sectionId: { in: resolvedSectionIds },
      isActive: true,
      academicYear: { is: { schoolId, isActive: true, isCurrent: true } },
      studentProfile: { is: { user: { is: { schoolId, isActive: true, role: "student" } } } },
    },
    select: { studentProfileId: true, studentProfile: { select: { userId: true } } },
  });
  const profileIds = [...new Set(enrollments.map((enrollment) => enrollment.studentProfileId))];
  enrollments.forEach((enrollment) => recipientIds.add(enrollment.studentProfile.userId));

  if (profileIds.length) {
    const links = await client.parentStudent.findMany({
      where: {
        schoolId,
        studentProfileId: { in: profileIds },
        parent: { is: { schoolId, isActive: true, role: "parent" } },
      },
      select: { parentId: true },
    });
    links.forEach((link) => recipientIds.add(link.parentId));
  }

  const homeroomIds = [...new Set(selectedSections.map((section) => section.homeroomTeacherId).filter(Boolean))];
  if (homeroomIds.length) {
    const homeroomTeachers = await client.user.findMany({
      where: { id: { in: homeroomIds }, schoolId, isActive: true },
      select: { id: true },
    });
    homeroomTeachers.forEach((teacher) => recipientIds.add(teacher.id));
  }

  const legacyClassIds = [...new Set(selectedSections.map((section) => section.legacyClassId).filter(Boolean))];
  if (legacyClassIds.length) {
    const currentYear = await client.academicYear.findFirst({
      where: { schoolId, isActive: true, isCurrent: true },
      select: { name: true },
    });
    const assignedTeachers = await client.teacherProfile.findMany({
      where: {
        schoolId,
        user: { is: { schoolId, isActive: true } },
        subjectTeacherAssignments: {
          some: {
            schoolId,
            classId: { in: legacyClassIds },
            OR: [
              { academicYear: null },
              { academicYear: "" },
              ...(currentYear ? [{ academicYear: currentYear.name }] : []),
            ],
          },
        },
      },
      select: { userId: true },
    });
    assignedTeachers.forEach((teacher) => recipientIds.add(teacher.userId));
  }

  return [...recipientIds];
};

const insertRecipients = async (client, rows) => {
  for (const batch of chunk(rows, RECIPIENT_BATCH)) {
    await client.announcementRecipient.createMany({ data: batch, skipDuplicates: true });
  }
};

const publishLocked = async (client, announcement, actorId, { requireDue = false } = {}) => {
  const now = new Date();
  if (announcement.status === "published") return false;
  if (requireDue) {
    if (announcement.status !== "scheduled" || !announcement.scheduledFor || announcement.scheduledFor > now) return false;
  } else if (!MUTABLE_STATUSES.includes(announcement.status)) {
    throw new AppError("Only a draft or scheduled announcement can be published", 409);
  }
  if (announcement.expiresAt && announcement.expiresAt <= now) {
    throw new AppError("This announcement expires before it can be published. Update the expiry and try again.", 409);
  }

  const recipientIds = await resolveRecipientIds(client, announcement.schoolId, announcement.audienceRules);
  if (recipientIds.length) {
    await insertRecipients(client, recipientIds.map((userId) => ({
      announcementId: announcement.id,
      userId,
      schoolId: announcement.schoolId,
      deliveredAt: now,
    })));
  }

  const claimed = await client.announcement.updateMany({
    where: {
      id: announcement.id,
      schoolId: announcement.schoolId,
      ...(requireDue
        ? { status: "scheduled", scheduledFor: { lte: now } }
        : { status: { in: MUTABLE_STATUSES } }),
    },
    data: { status: "published", publishedAt: now, scheduledFor: null },
  });
  if (!claimed.count) return false;

  await createAudit(client, {
    announcementId: announcement.id,
    schoolId: announcement.schoolId,
    actorId,
    action: "published",
    metadata: { recipientCount: recipientIds.length, scheduled: announcement.status === "scheduled" },
  });
  return true;
};

const withTransaction = (options, work) => prisma.$transaction(work, options);

exports.createAnnouncement = async (schoolId, actor, payload) => {
  const rules = normalizeAudience(payload.audience);
  assertExpiry({ expiresAt: payload.expiresAt });
  const id = await withTransaction(SHORT_TX, async (tx) => {
    await assertAudienceReferences(tx, schoolId, actor, rules);
    const announcement = await tx.announcement.create({
      data: {
        schoolId,
        authorId: actor.id,
        title: normalizeText(payload.title),
        content: sanitizeContent(payload.content),
        priority: payload.priority,
        expiresAt: payload.expiresAt || null,
      },
    });
    if (rules.length) {
      await tx.announcementAudienceRule.createMany({
        data: rules.map((rule) => audienceRuleData(rule, announcement.id)),
      });
    }
    await createAudit(tx, { announcementId: announcement.id, schoolId, actorId: actor.id, action: "created" });
    return announcement.id;
  });
  return reload(schoolId, actor, id);
};

exports.updateAnnouncement = async (schoolId, actor, id, payload) => {
  if (!isUuid(id)) return null;
  if (payload.expiresAt) assertExpiry({ expiresAt: payload.expiresAt });
  const updated = await withTransaction(SHORT_TX, async (tx) => {
    const existing = await loadLocked(tx, schoolId, id);
    if (!existing) return false;
    assertOwner(actor, existing);
    if (!MUTABLE_STATUSES.includes(existing.status)) {
      throw new AppError("Published announcements are immutable; create a new announcement for corrections", 409);
    }
    if (payload.expiresAt && existing.scheduledFor) assertExpiry({ expiresAt: payload.expiresAt, scheduledFor: existing.scheduledFor });
    const data = {};
    if (payload.title !== undefined) data.title = normalizeText(payload.title);
    if (payload.content !== undefined) data.content = sanitizeContent(payload.content);
    if (payload.priority !== undefined) data.priority = payload.priority;
    if (payload.expiresAt !== undefined) data.expiresAt = payload.expiresAt || null;
    if (payload.audience !== undefined) {
      const rules = normalizeAudience(payload.audience);
      await assertAudienceReferences(tx, schoolId, actor, rules);
      await tx.announcementAudienceRule.deleteMany({ where: { announcementId: id } });
      if (rules.length) {
        await tx.announcementAudienceRule.createMany({
          data: rules.map((rule) => audienceRuleData(rule, id)),
        });
      }
    }
    await tx.announcement.update({ where: { id }, data });
    await createAudit(tx, {
      announcementId: id,
      schoolId,
      actorId: actor.id,
      action: "updated",
      metadata: { fields: [...Object.keys(data), ...(payload.audience !== undefined ? ["audience"] : [])] },
    });
    return true;
  });
  if (!updated) return null;
  return reload(schoolId, actor, id);
};

exports.publishAnnouncement = async (schoolId, actor, id) => {
  if (!isUuid(id)) return null;
  const published = await withTransaction(PUBLISH_TX, async (tx) => {
    const existing = await loadLocked(tx, schoolId, id);
    if (!existing) return false;
    assertOwner(actor, existing);
    if (existing.status !== "published") await publishLocked(tx, existing, actor.id);
    return true;
  });
  if (!published) return null;
  return reload(schoolId, actor, id);
};

exports.scheduleAnnouncement = async (schoolId, actor, id, scheduledFor) => {
  if (!isUuid(id)) return null;
  const when = new Date(scheduledFor);
  const scheduled = await withTransaction(SHORT_TX, async (tx) => {
    const existing = await loadLocked(tx, schoolId, id);
    if (!existing) return false;
    assertOwner(actor, existing);
    if (!MUTABLE_STATUSES.includes(existing.status)) {
      throw new AppError("Only a draft or scheduled announcement can be scheduled", 409);
    }
    assertExpiry({ expiresAt: existing.expiresAt, scheduledFor: when });
    await tx.announcement.update({ where: { id }, data: { status: "scheduled", scheduledFor: when } });
    await createAudit(tx, {
      announcementId: id,
      schoolId,
      actorId: actor.id,
      action: "scheduled",
      metadata: { scheduledFor: when.toISOString() },
    });
    return true;
  });
  if (!scheduled) return null;
  return reload(schoolId, actor, id);
};

exports.cancelAnnouncement = async (schoolId, actor, id) => {
  if (!isUuid(id)) return null;
  const cancelled = await withTransaction(SHORT_TX, async (tx) => {
    const existing = await loadLocked(tx, schoolId, id);
    if (!existing) return false;
    assertOwner(actor, existing);
    if (existing.status !== "scheduled") throw new AppError("Only scheduled announcements can be cancelled", 409);
    await tx.announcement.update({ where: { id }, data: { status: "cancelled", scheduledFor: null } });
    await createAudit(tx, { announcementId: id, schoolId, actorId: actor.id, action: "cancelled" });
    return true;
  });
  if (!cancelled) return null;
  return reload(schoolId, actor, id);
};

exports.revertToDraft = async (schoolId, actor, id) => {
  if (!isUuid(id)) return null;
  const reverted = await withTransaction(SHORT_TX, async (tx) => {
    const existing = await loadLocked(tx, schoolId, id);
    if (!existing) return false;
    assertOwner(actor, existing);
    if (existing.status !== "scheduled") throw new AppError("Only a scheduled announcement can be returned to draft", 409);
    await tx.announcement.update({ where: { id }, data: { status: "draft", scheduledFor: null } });
    await createAudit(tx, {
      announcementId: id,
      schoolId,
      actorId: actor.id,
      action: "updated",
      metadata: { previousStatus: "scheduled", status: "draft" },
    });
    return true;
  });
  if (!reverted) return null;
  return reload(schoolId, actor, id);
};

const transitionPublished = async (schoolId, actor, id, status, action) => {
  if (!isUuid(id)) return null;
  const changed = await withTransaction(SHORT_TX, async (tx) => {
    const existing = await loadLocked(tx, schoolId, id);
    if (!existing) return false;
    if (!isManager(actor)) throw new AppError("Only school administrators can manage published announcements", 403);
    if (existing.status !== "published") throw new AppError("Only published announcements can be changed this way", 409);
    const data = { status };
    if (status === "archived") data.archivedAt = new Date();
    await tx.announcement.update({ where: { id }, data });
    await createAudit(tx, {
      announcementId: id,
      schoolId,
      actorId: actor.id,
      action,
      metadata: { previousStatus: "published" },
    });
    return true;
  });
  if (!changed) return null;
  return reload(schoolId, actor, id);
};

exports.archiveAnnouncement = (schoolId, actor, id) => transitionPublished(schoolId, actor, id, "archived", "archived");
exports.expireAnnouncement = (schoolId, actor, id) => transitionPublished(schoolId, actor, id, "expired", "expired");

exports.listAnnouncements = async (schoolId, actor, filters) => {
  const where = { schoolId };
  if (!isManager(actor)) where.authorId = actor.id;
  if (filters.status && filters.status !== "all") where.status = filters.status;
  if (filters.priority && filters.priority !== "all") where.priority = filters.priority;
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {
      ...(filters.dateFrom ? { gte: new Date(filters.dateFrom) } : {}),
      ...(filters.dateTo ? { lte: endOfSuppliedDay(filters.dateTo) } : {}),
    };
  }
  if (filters.search) where.OR = [{ title: { contains: normalizeText(filters.search), mode: "insensitive" } }];
  const audienceMap = {
    everyone: { type: "all_users" },
    teachers: { type: "role", role: "teacher" },
    students: { type: "role", role: "student" },
    parents: { type: "role", role: "parent" },
    admins: { type: "role", role: "admin" },
    classes: { type: "class" },
    sections: { type: "section" },
  };
  if (filters.audience && filters.audience !== "all") where.audienceRules = { some: audienceMap[filters.audience] };
  const [data, total] = await Promise.all([
    prisma.announcement.findMany({
      where,
      include: announcementInclude,
      orderBy: [{ [filters.sort]: filters.order }, { id: filters.order }],
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
    prisma.announcement.count({ where }),
  ]);
  return {
    data: data.map((announcement) => serializeAnnouncement(announcement)),
    meta: { page: filters.page, limit: filters.limit, total, totalPages: Math.max(1, Math.ceil(total / filters.limit)) },
  };
};

exports.getAnnouncement = async (schoolId, actor, id) => {
  if (!isUuid(id)) return null;
  const announcement = await prisma.announcement.findFirst({ where: { id, schoolId }, include: announcementInclude });
  if (!announcement) return null;
  if (!isManager(actor) && announcement.authorId !== actor.id) throw new AppError("You can access only your own announcements", 403);
  return serializeAnnouncement(announcement);
};

exports.getAudienceOptions = async (schoolId, actor) => {
  const manager = isManager(actor);
  const sections = await prisma.section.findMany({
    where: manager
      ? currentYearSectionWhere(schoolId)
      : { id: { in: (await getTeacherAssignableSections(prisma, schoolId, actor.id)).map((section) => section.id) } },
    select: {
      id: true,
      name: true,
      code: true,
      classId: true,
      class: { select: { id: true, name: true, code: true } },
      academicYear: { select: { id: true, name: true, isCurrent: true } },
    },
    orderBy: [{ class: { name: "asc" } }, { name: "asc" }],
  });
  const classMap = new Map();
  sections.forEach((section) => {
    if (!classMap.has(section.classId)) classMap.set(section.classId, { ...section.class, sections: [] });
    classMap.get(section.classId).sections.push({
      id: section.id,
      name: section.name,
      code: section.code,
      academicYear: section.academicYear,
    });
  });
  return {
    canTargetSchoolWide: manager,
    canTargetClasses: manager,
    roles: manager ? ["admin", "teacher", "student", "parent", "department_head", "accountant"] : [],
    classes: [...classMap.values()],
  };
};

exports.listRecipients = async (schoolId, actor, id, filters) => {
  if (!isManager(actor)) throw new AppError("Only school administrators can view readership", 403);
  if (!isUuid(id)) return null;
  const announcement = await prisma.announcement.findFirst({ where: { id, schoolId }, select: { id: true } });
  if (!announcement) return null;
  const where = { announcementId: id, schoolId };
  if (filters.read === "read") where.readAt = { not: null };
  if (filters.read === "unread") where.readAt = null;
  const userFilter = {};
  if (filters.role && filters.role !== "all") userFilter.role = filters.role;
  if (filters.search) {
    const term = normalizeText(filters.search);
    userFilter.OR = [
      { firstName: { contains: term, mode: "insensitive" } },
      { lastName: { contains: term, mode: "insensitive" } },
      { email: { contains: term, mode: "insensitive" } },
    ];
  }
  if (Object.keys(userFilter).length) where.user = { is: userFilter };
  const [data, total] = await Promise.all([
    prisma.announcementRecipient.findMany({
      where,
      select: {
        id: true,
        deliveredAt: true,
        readAt: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
      },
      orderBy: [{ readAt: "asc" }, { deliveredAt: "desc" }],
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
    prisma.announcementRecipient.count({ where }),
  ]);
  return {
    data,
    meta: { page: filters.page, limit: filters.limit, total, totalPages: Math.max(1, Math.ceil(total / filters.limit)) },
  };
};

exports.getStatistics = async (schoolId, actor, id) => {
  if (!isManager(actor)) throw new AppError("Only school administrators can view readership", 403);
  if (!isUuid(id)) return null;
  const announcement = await prisma.announcement.findFirst({ where: { id, schoolId }, select: { id: true } });
  if (!announcement) return null;
  const rows = await prisma.$queryRaw`
    SELECT u."role"::text AS "role",
           COUNT(*)::int AS "total",
           COUNT(r."readAt")::int AS "read"
    FROM "announcement_recipients" r
    JOIN "users" u ON u."id" = r."userId"
    WHERE r."announcementId" = CAST(${id} AS uuid)
      AND r."schoolId" = CAST(${schoolId} AS uuid)
    GROUP BY u."role"
  `;
  const byRole = {};
  let total = 0;
  let read = 0;
  for (const row of rows) {
    const roleTotal = Number(row.total);
    const roleRead = Number(row.read);
    total += roleTotal;
    read += roleRead;
    byRole[row.role] = { total: roleTotal, read: roleRead, unread: roleTotal - roleRead };
  }
  return {
    totalRecipients: total,
    read,
    unread: total - read,
    readPercentage: total ? Number(((read / total) * 100).toFixed(1)) : 0,
    byRole,
  };
};

const serializeInboxRow = (row) => serializeAnnouncement(row.announcement, {
  id: row.id,
  deliveredAt: row.deliveredAt,
  readAt: row.readAt,
});

exports.listInbox = async (schoolId, userId, filters) => {
  const where = { schoolId, userId, announcement: { is: visibleAnnouncement() } };
  if (filters.read === "read") where.readAt = { not: null };
  if (filters.read === "unread") where.readAt = null;
  if (filters.priority && filters.priority !== "all") where.announcement.is.priority = filters.priority;
  if (filters.search) where.announcement.is.title = { contains: normalizeText(filters.search), mode: "insensitive" };
  const [rows, total] = await Promise.all([
    prisma.announcementRecipient.findMany({
      where,
      select: inboxListSelect,
      orderBy: [{ announcement: { publishedAt: "desc" } }, { id: "desc" }],
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
    prisma.announcementRecipient.count({ where }),
  ]);
  return {
    data: rows.map(serializeInboxRow),
    meta: { page: filters.page, limit: filters.limit, total, totalPages: Math.max(1, Math.ceil(total / filters.limit)) },
  };
};

exports.getInboxAnnouncement = async (schoolId, userId, id) => {
  if (!isUuid(id)) throw new AppError("Announcement not found", 404);
  const row = await prisma.announcementRecipient.findFirst({
    where: { userId, schoolId, announcementId: id, announcement: { is: visibleAnnouncement() } },
    include: inboxDetailInclude,
  });
  if (!row) throw new AppError("Announcement not found", 404);
  return serializeInboxRow(row);
};

exports.setReadState = async (schoolId, userId, id, isRead) => {
  if (!isUuid(id)) throw new AppError("Announcement not found", 404);
  const where = {
    announcementId: id,
    userId,
    schoolId,
    announcement: { is: visibleAnnouncement() },
    readAt: isRead ? null : { not: null },
  };
  await prisma.announcementRecipient.updateMany({
    where,
    data: { readAt: isRead ? new Date() : null },
  });
  return this.getInboxAnnouncement(schoolId, userId, id);
};

exports.unreadCount = (schoolId, userId) => prisma.announcementRecipient.count({
  where: { schoolId, userId, readAt: null, announcement: { is: visibleAnnouncement() } },
});

exports.processDueAnnouncements = async (limit = 25) => {
  const size = Math.min(Math.max(Number(limit) || 25, 1), 100);
  const due = await prisma.$queryRaw`
    SELECT "id", "schoolId"
    FROM "announcements"
    WHERE "status" = 'scheduled'::"AnnouncementStatus"
      AND "scheduledFor" <= NOW()
    ORDER BY "scheduledFor" ASC
    LIMIT ${size}
  `;
  let published = 0;
  for (const row of due) {
    try {
      const didPublish = await withTransaction(PUBLISH_TX, async (tx) => {
        const locked = await tx.$queryRaw`
          SELECT "id" FROM "announcements"
          WHERE "id" = CAST(${row.id} AS uuid)
            AND "schoolId" = CAST(${row.schoolId} AS uuid)
            AND "status" = 'scheduled'::"AnnouncementStatus"
            AND "scheduledFor" <= NOW()
          FOR UPDATE SKIP LOCKED
        `;
        if (!locked.length) return false;
        const announcement = await tx.announcement.findFirst({
          where: { id: row.id, schoolId: row.schoolId },
          select: lifecycleSelect,
        });
        if (!announcement) return false;
        return publishLocked(tx, announcement, null, { requireDue: true });
      });
      if (didPublish) published += 1;
    } catch (error) {
      console.error(`Announcement publication failed for ${row.id}`, error);
    }
  }
  return published;
};

exports.expireDueAnnouncements = async (limit = 100) => {
  const size = Math.min(Math.max(Number(limit) || 100, 1), 500);
  return withTransaction(SHORT_TX, async (tx) => {
    const due = await tx.$queryRaw`
      WITH due AS (
        SELECT "id"
        FROM "announcements"
        WHERE "status" = 'published'::"AnnouncementStatus"
          AND "expiresAt" IS NOT NULL
          AND "expiresAt" <= NOW()
        ORDER BY "expiresAt" ASC
        FOR UPDATE SKIP LOCKED
        LIMIT ${size}
      )
      UPDATE "announcements" AS announcement
      SET "status" = 'expired'::"AnnouncementStatus",
          "updatedAt" = NOW()
      FROM due
      WHERE announcement."id" = due."id"
      RETURNING announcement."id", announcement."schoolId"
    `;
    if (!due.length) return 0;
    await tx.announcementAuditEvent.createMany({
      data: due.map((row) => ({
        announcementId: row.id,
        schoolId: row.schoolId,
        actorId: null,
        action: "expired",
        metadata: { source: "scheduler" },
      })),
    });
    return due.length;
  });
};
