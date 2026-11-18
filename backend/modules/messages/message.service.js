const prisma = require("../../config/prisma");
const { Prisma } = require("@prisma/client");
const AppError = require("../../utils/AppError");

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SENDER_SELECT = {
  id: true, firstName: true, lastName: true, email: true, role: true,
};
const RECIPIENT_USER_SELECT = {
  id: true, firstName: true, lastName: true, email: true, role: true, phone: true,
};
const normalizeText = (value) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;
const buildFullName = (user) => (user?.firstName + " " + user?.lastName).trim();
const preview = (body, length = 140) => {
  const text = String(body ?? "").replace(/\s+/g, " ").trim();
  return text.length > length ? text.slice(0, length) + "…" : text;
};
const assertId = (id) => {
  if (!UUID_PATTERN.test(id || "")) throw new AppError("Message not found", 404);
};

const assertRecipientsInSchool = async (schoolId, recipientIds) => {
  const uniqueIds = [...new Set(recipientIds)];
  const recipients = await prisma.user.findMany({
    where: { schoolId, id: { in: uniqueIds }, isActive: true },
    select: { id: true },
  });
  if (recipients.length !== uniqueIds.length) {
    throw new AppError(
      "One or more recipients do not belong to this school or are inactive",
      400,
    );
  }
  return uniqueIds;
};

const threadStatsCte = (schoolId, userId) => Prisma.sql`
  WITH RECURSIVE thread_tree("rootId", "messageId", "path") AS (
    SELECT root."id", root."id", ARRAY[root."id"]
    FROM "messages" root
    WHERE root."schoolId" = ${schoolId} AND root."parentMessageId" IS NULL
    UNION ALL
    SELECT tree."rootId", child."id", tree."path" || child."id"
    FROM thread_tree tree
    JOIN "messages" child ON child."parentMessageId" = tree."messageId"
    WHERE child."schoolId" = ${schoolId}
      AND NOT child."id" = ANY(tree."path")
  ),
  thread_stats AS (
    SELECT
      tree."rootId",
      MAX(message."createdAt") FILTER (
        WHERE (message."senderId" = ${userId} AND message."deletedBySender" = false)
          OR viewer."id" IS NOT NULL
      ) AS "lastMessageAt",
      COUNT(viewer."id") FILTER (
        WHERE viewer."isRead" = false AND viewer."isArchived" = false
      )::int AS "unreadCount",
      COUNT(viewer."id")::int AS "viewerMessageCount",
      COALESCE(BOOL_AND(viewer."isArchived"), false) AS "isArchived"
    FROM thread_tree tree
    JOIN "messages" message ON message."id" = tree."messageId"
    LEFT JOIN "message_recipients" viewer
      ON viewer."messageId" = message."id"
      AND viewer."schoolId" = ${schoolId}
      AND viewer."recipientId" = ${userId}
      AND viewer."isDeleted" = false
    GROUP BY tree."rootId"
  )
`;

const conversationWhere = ({ schoolId, userId, tab, search, role, sent }) => {
  const clauses = [];
  if (sent) {
    clauses.push(Prisma.sql`
      EXISTS (
        SELECT 1 FROM thread_tree tree
        JOIN "messages" sent_message ON sent_message."id" = tree."messageId"
        WHERE tree."rootId" = stats."rootId"
          AND sent_message."senderId" = ${userId}
          AND sent_message."deletedBySender" = false
      )
    `);
  } else {
    clauses.push(Prisma.sql`
      EXISTS (
        SELECT 1 FROM thread_tree tree
        JOIN "message_recipients" inbox_row
          ON inbox_row."messageId" = tree."messageId"
        WHERE tree."rootId" = stats."rootId"
          AND inbox_row."schoolId" = ${schoolId}
          AND inbox_row."recipientId" = ${userId}
          AND inbox_row."isDeleted" = false
      )
    `);
    if (tab === "unread") clauses.push(Prisma.sql`stats."unreadCount" > 0`);
    else if (tab === "read") clauses.push(Prisma.sql`stats."unreadCount" = 0`);
    if (tab === "archived") clauses.push(Prisma.sql`stats."isArchived" = true`);
    else clauses.push(Prisma.sql`stats."isArchived" = false`);
  }
  if (search) {
    const pattern = "%" + search + "%";
    clauses.push(Prisma.sql`
      EXISTS (
        SELECT 1 FROM thread_tree tree
        JOIN "messages" searched_message ON searched_message."id" = tree."messageId"
        JOIN "users" message_sender ON message_sender."id" = searched_message."senderId"
        WHERE tree."rootId" = stats."rootId"
          AND (
            (searched_message."senderId" = ${userId} AND searched_message."deletedBySender" = false)
            OR EXISTS (
              SELECT 1
              FROM "message_recipients" visible_row
              WHERE visible_row."messageId" = searched_message."id"
                AND visible_row."schoolId" = ${schoolId}
                AND visible_row."recipientId" = ${userId}
                AND visible_row."isDeleted" = false
            )
          )
          AND (
            searched_message."subject" ILIKE ${pattern}
            OR searched_message."body" ILIKE ${pattern}
            OR message_sender."firstName" ILIKE ${pattern}
            OR message_sender."lastName" ILIKE ${pattern}
            OR message_sender."email" ILIKE ${pattern}
            OR EXISTS (
              SELECT 1
              FROM "message_recipients" search_recipient
              JOIN "users" recipient_user ON recipient_user."id" = search_recipient."recipientId"
              WHERE search_recipient."messageId" = searched_message."id"
                AND search_recipient."schoolId" = ${schoolId}
                AND (
                  recipient_user."firstName" ILIKE ${pattern}
                  OR recipient_user."lastName" ILIKE ${pattern}
                  OR recipient_user."email" ILIKE ${pattern}
                )
            )
          )
      )
    `);
  }
  if (role) {
    clauses.push(Prisma.sql`
      EXISTS (
        SELECT 1 FROM thread_tree tree
        JOIN "messages" role_message ON role_message."id" = tree."messageId"
        JOIN "users" role_sender ON role_sender."id" = role_message."senderId"
        WHERE tree."rootId" = stats."rootId"
          AND (
            role_sender."role"::text = ${role}
            OR EXISTS (
              SELECT 1
              FROM "message_recipients" role_recipient
              JOIN "users" role_user ON role_user."id" = role_recipient."recipientId"
              WHERE role_recipient."messageId" = role_message."id"
                AND role_recipient."schoolId" = ${schoolId}
                AND role_user."role"::text = ${role}
            )
          )
      )
    `);
  }
  return Prisma.join(clauses, " AND ");
};

const conversationMessageIds = async (schoolId, rootIds) => {
  if (!rootIds.length) return [];
  const rows = await prisma.$queryRaw(Prisma.sql`
    WITH RECURSIVE thread_tree("rootId", "messageId", "path") AS (
      SELECT root."id", root."id", ARRAY[root."id"]
      FROM "messages" root
      WHERE root."schoolId" = ${schoolId}
        AND root."id" IN (${Prisma.join(rootIds)})
      UNION ALL
      SELECT tree."rootId", child."id", tree."path" || child."id"
      FROM thread_tree tree
      JOIN "messages" child ON child."parentMessageId" = tree."messageId"
      WHERE child."schoolId" = ${schoolId}
        AND NOT child."id" = ANY(tree."path")
    )
    SELECT DISTINCT tree."messageId" AS "messageId" FROM thread_tree tree
  `);
  return rows.map((row) => row.messageId);
};

const mapConversationRows = (roots, messages, stats, userId, sent) => {
  const byRoot = new Map(roots.map((row) => [row.rootId, []]));
  const rootIds = new Set(roots.map((row) => row.rootId));
  const index = new Map(messages.map((message) => [message.id, message]));
  const rootByMessage = new Map(roots.map((row) => [row.rootId, row.rootId]));
  const findRoot = (message, visited = new Set()) => {
    if (rootIds.has(message.id)) return message.id;
    if (rootByMessage.has(message.id)) return rootByMessage.get(message.id);
    if (!message.parentMessageId || visited.has(message.id)) return null;
    visited.add(message.id);
    const parent = index.get(message.parentMessageId);
    if (!parent) return null;
    const rootId = findRoot(parent, visited);
    if (rootId) rootByMessage.set(message.id, rootId);
    return rootId;
  };
  for (const message of messages) {
    const rootId = findRoot(message);
    if (rootId && byRoot.has(rootId)) byRoot.get(rootId).push(message);
  }

  return roots.map((row) => {
    const thread = byRoot.get(row.rootId) || [];
    thread.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const root = thread.find((message) => message.id === row.rootId) || thread[0];
    const latest = thread[thread.length - 1] || root;
    const participants = new Map();
    for (const message of thread) {
      participants.set(message.sender.id, {
        id: message.sender.id,
        name: buildFullName(message.sender),
        role: message.sender.role,
      });
      for (const recipient of message.recipients) {
        participants.set(recipient.recipient.id, {
          id: recipient.recipient.id,
          name: buildFullName(recipient.recipient),
          role: recipient.recipient.role,
        });
      }
    }
    const recipients = (root?.recipients || []).map((recipient) => ({
      id: recipient.recipient.id,
      name: buildFullName(recipient.recipient),
      firstName: recipient.recipient.firstName,
      lastName: recipient.recipient.lastName,
      email: recipient.recipient.email,
      role: recipient.recipient.role,
      ...(sent ? { isRead: recipient.isRead, readAt: recipient.readAt } : {}),
    }));
    const state = stats.get(row.rootId);
    return {
      id: row.rootId,
      subject: root?.subject || "",
      preview: preview(latest?.body),
      body: latest?.body || "",
      sender: root?.sender || null,
      recipients,
      participants: [...participants.values()],
      latestMessage: latest
        ? { id: latest.id, senderId: latest.senderId, sender: latest.sender, body: latest.body, createdAt: latest.createdAt }
        : null,
      lastMessageAt: state.lastMessageAt,
      unreadCount: Number(state.unreadCount || 0),
      canManageInbox: Number(state.viewerMessageCount || 0) > 0,
      isRead: Number(state.unreadCount || 0) === 0,
      isArchived: Boolean(state.isArchived),
      messageCount: thread.length,
      createdAt: root?.createdAt || row.lastMessageAt,
      isSender: root?.senderId === userId,
    };
  });
};

const listConversations = async (schoolId, userId, filters, sent) => {
  const search = normalizeText(filters.search);
  const role = filters.role || undefined;
  const tab = sent ? "all" : filters.tab;
  const cte = threadStatsCte(schoolId, userId);
  const where = conversationWhere({ schoolId, userId, tab, search, role, sent });
  const countRows = await prisma.$queryRaw(Prisma.sql`
    ${cte}
    SELECT COUNT(*)::int AS "total"
    FROM thread_stats stats
    JOIN "messages" root ON root."id" = stats."rootId"
    WHERE ${where}
  `);
  const total = Number(countRows[0]?.total || 0);
  const totalPages = Math.ceil(total / filters.limit);
  const page = total ? Math.min(filters.page, totalPages) : 1;
  const rootRows = await prisma.$queryRaw(Prisma.sql`
    ${cte}
    SELECT stats."rootId", stats."lastMessageAt", stats."unreadCount", stats."isArchived", stats."viewerMessageCount"
    FROM thread_stats stats
    JOIN "messages" root ON root."id" = stats."rootId"
    WHERE ${where}
    ORDER BY stats."lastMessageAt" DESC, stats."rootId" DESC
    LIMIT ${filters.limit} OFFSET ${(page - 1) * filters.limit}
  `);
  const ids = await conversationMessageIds(schoolId, rootRows.map((row) => row.rootId));
  const messages = ids.length
    ? await prisma.message.findMany({
        where: {
          schoolId,
          id: { in: ids },
          OR: [
            { senderId: userId, deletedBySender: false },
            { recipients: { some: { schoolId, recipientId: userId, isDeleted: false } } },
          ],
        },
        include: {
          sender: { select: SENDER_SELECT },
          recipients: {
            where: { schoolId },
            include: { recipient: { select: RECIPIENT_USER_SELECT } },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      })
    : [];
  const stats = new Map(rootRows.map((row) => [row.rootId, row]));
  return {
    data: mapConversationRows(rootRows, messages, stats, userId, sent),
    meta: { page, limit: filters.limit, total, totalPages },
  };
};

exports.listInbox = (schoolId, userId, filters = {}) =>
  listConversations(schoolId, userId, filters, false);
exports.listSent = (schoolId, userId, filters = {}) =>
  listConversations(schoolId, userId, filters, true);

const resolveThreadIds = async (schoolId, messageId) => {
  assertId(messageId);
  const rows = await prisma.$queryRaw(Prisma.sql`
    WITH RECURSIVE ancestors("id", "parentMessageId", "path", "depth") AS (
      SELECT message."id", message."parentMessageId", ARRAY[message."id"], 0
      FROM "messages" message
      WHERE message."id" = ${messageId} AND message."schoolId" = ${schoolId}
      UNION ALL
      SELECT parent."id", parent."parentMessageId",
        ancestors."path" || parent."id", ancestors."depth" + 1
      FROM "messages" parent
      JOIN ancestors ON parent."id" = ancestors."parentMessageId"
      WHERE parent."schoolId" = ${schoolId}
        AND NOT parent."id" = ANY(ancestors."path")
    ),
    root AS (
      SELECT "id" FROM ancestors
      WHERE "parentMessageId" IS NULL
      ORDER BY "depth" DESC LIMIT 1
    ),
    thread_tree("rootId", "messageId", "path") AS (
      SELECT root."id", root."id", ARRAY[root."id"] FROM root
      UNION ALL
      SELECT tree."rootId", child."id", tree."path" || child."id"
      FROM thread_tree tree
      JOIN "messages" child ON child."parentMessageId" = tree."messageId"
      WHERE child."schoolId" = ${schoolId}
        AND NOT child."id" = ANY(tree."path")
    )
    SELECT (SELECT "id" FROM root) AS "rootId",
      ARRAY(SELECT "messageId" FROM thread_tree) AS "messageIds"
  `);
  const row = rows[0];
  if (!row?.rootId || !Array.isArray(row.messageIds) || !row.messageIds.length) {
    throw new AppError("Message not found", 404);
  }
  return { rootId: row.rootId, messageIds: row.messageIds };
};

const loadThreadMessages = (schoolId, userId, thread) =>
  prisma.message.findMany({
    where: {
      schoolId,
      id: { in: thread.messageIds },
      OR: [
        { senderId: userId, deletedBySender: false },
        { recipients: { some: { schoolId, recipientId: userId, isDeleted: false } } },
      ],
    },
    include: {
      sender: { select: SENDER_SELECT },
      recipients: {
        where: { schoolId },
        include: { recipient: { select: RECIPIENT_USER_SELECT } },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });

exports.getConversationThread = async (schoolId, userId, messageId) => {
  const thread = await resolveThreadIds(schoolId, messageId);
  const viewerThreadRows = await prisma.messageRecipient.findMany({
    where: { schoolId, recipientId: userId, messageId: { in: thread.messageIds } },
    select: { isDeleted: true },
  });
  if (viewerThreadRows.length && viewerThreadRows.every((row) => row.isDeleted)) {
    throw new AppError("Message not found", 404);
  }
  const messages = await loadThreadMessages(schoolId, userId, thread);
  if (!messages.some((message) => message.id === messageId)) {
    throw new AppError("Message not found", 404);
  }
  const participants = new Map();
  for (const message of messages) {
    participants.set(message.sender.id, {
      id: message.sender.id, name: buildFullName(message.sender),
      firstName: message.sender.firstName, lastName: message.sender.lastName, role: message.sender.role,
    });
    for (const recipient of message.recipients) {
      participants.set(recipient.recipient.id, {
        id: recipient.recipient.id, name: buildFullName(recipient.recipient),
        firstName: recipient.recipient.firstName, lastName: recipient.recipient.lastName,
        role: recipient.recipient.role,
      });
    }
  }
  const root = messages.find((message) => message.id === thread.rootId);
  const last = messages[messages.length - 1];
  const viewerRows = messages.flatMap((message) =>
    message.recipients.filter(
      (recipient) => recipient.recipientId === userId && !recipient.isDeleted,
    ),
  );
  const unreadCount = viewerRows.filter(
    (recipient) => !recipient.isRead && !recipient.isArchived,
  ).length;
  const otherParticipants = [...participants.values()].filter(
    (participant) => participant.id !== userId,
  );
  return {
    conversation: {
      id: thread.rootId,
      subject: root?.subject || messages[0].subject,
      participantName: otherParticipants.map((participant) => participant.name).join(", "),
      participants: [...participants.values()],
      role: otherParticipants.length === 1 ? otherParticipants[0].role : null,
      preview: preview(last.body),
      lastMessageAt: last.createdAt,
      unreadCount,
      canManageInbox: viewerRows.length > 0,
      isRead: unreadCount === 0,
      isArchived: viewerRows.length > 0 && viewerRows.every((row) => row.isArchived),
      isSender: messages.some((message) => message.senderId === userId),
    },
    messages: messages.map((message) => ({
      id: message.id,
      parentMessageId: message.parentMessageId,
      subject: message.subject,
      body: message.body,
      senderId: message.senderId,
      sender: {
        id: message.sender.id, name: buildFullName(message.sender), role: message.sender.role,
      },
      createdAt: message.createdAt,
      isRead:
        message.recipients.find((recipient) => recipient.recipientId === userId)?.isRead ?? null,
    })),
  };
};

exports.getMessage = async (schoolId, userId, messageId) => {
  assertId(messageId);
  const message = await prisma.message.findFirst({
    where: { id: messageId, schoolId },
    include: {
      sender: { select: SENDER_SELECT },
      recipients: {
        where: { schoolId },
        include: { recipient: { select: RECIPIENT_USER_SELECT } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!message) throw new AppError("Message not found", 404);
  const thread = await resolveThreadIds(schoolId, messageId);
  const threadViewerRows = await prisma.messageRecipient.findMany({
    where: { schoolId, recipientId: userId, messageId: { in: thread.messageIds } },
    select: { isDeleted: true },
  });
  if (threadViewerRows.length && threadViewerRows.every((row) => row.isDeleted)) {
    throw new AppError("Message not found", 404);
  }
  const viewerRecipient = message.recipients.find(
    (recipient) => recipient.recipientId === userId,
  );
  const isSender = message.senderId === userId;
  if (isSender && message.deletedBySender) throw new AppError("Message not found", 404);
  if (!isSender && (!viewerRecipient || viewerRecipient.isDeleted)) {
    throw new AppError("Message not found", 404);
  }
  return {
    id: message.id, subject: message.subject, body: message.body,
    parentMessageId: message.parentMessageId, isSender,
    sender: {
      id: message.sender.id, name: buildFullName(message.sender),
      firstName: message.sender.firstName, lastName: message.sender.lastName,
      email: message.sender.email, role: message.sender.role,
    },
    recipients: message.recipients.map((recipient) => ({
      id: recipient.recipient.id, name: buildFullName(recipient.recipient),
      firstName: recipient.recipient.firstName, lastName: recipient.recipient.lastName,
      email: recipient.recipient.email, role: recipient.recipient.role,
      ...(isSender ? { isRead: recipient.isRead, readAt: recipient.readAt } : {}),
    })),
    viewer: isSender
      ? null
      : {
          isRead: viewerRecipient.isRead, readAt: viewerRecipient.readAt,
          isArchived: viewerRecipient.isArchived, isDeleted: viewerRecipient.isDeleted,
        },
    createdAt: message.createdAt,
  };
};

exports.sendMessage = async (schoolId, senderId, payload) => {
  if (payload.parentMessageId) {
    return exports.replyToMessage(schoolId, senderId, payload.parentMessageId, payload.body);
  }
  const recipientIds = await assertRecipientsInSchool(schoolId, payload.recipientIds);
  const sendableIds = recipientIds.filter((id) => id !== senderId);
  if (!sendableIds.length) {
    throw new AppError("Select at least one recipient other than yourself", 400);
  }
  const message = await prisma.$transaction(async (tx) => {
    const created = await tx.message.create({
      data: { schoolId, senderId, subject: payload.subject, body: payload.body },
      select: { id: true },
    });
    await tx.messageRecipient.createMany({
      data: sendableIds.map((recipientId) => ({ messageId: created.id, recipientId, schoolId })),
    });
    return created;
  });
  return { id: message.id, recipientCount: sendableIds.length };
};

exports.replyToMessage = async (schoolId, userId, messageId, body) => {
  assertId(messageId);
  const thread = await resolveThreadIds(schoolId, messageId);
  const threadViewerRows = await prisma.messageRecipient.findMany({
    where: { schoolId, recipientId: userId, messageId: { in: thread.messageIds } },
    select: { isDeleted: true },
  });
  if (threadViewerRows.length && threadViewerRows.every((row) => row.isDeleted)) {
    throw new AppError("Message not found", 404);
  }
  const messages = await prisma.message.findMany({
    where: { schoolId, id: { in: thread.messageIds } },
    include: {
      sender: { select: SENDER_SELECT },
      recipients: {
        where: { schoolId },
        include: { recipient: { select: RECIPIENT_USER_SELECT } },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  const parent = messages.find((message) => message.id === messageId);
  if (!parent) throw new AppError("Message not found", 404);
  const parentReceipt = parent.recipients.find(
    (recipient) => recipient.recipientId === userId,
  );
  if (
    (parent.senderId === userId && parent.deletedBySender) ||
    (parent.senderId !== userId && (!parentReceipt || parentReceipt.isDeleted))
  ) {
    throw new AppError("Message not found", 404);
  }
  const isParticipant = messages.some(
    (message) =>
      (message.senderId === userId && !message.deletedBySender) ||
      message.recipients.some(
        (recipient) => recipient.recipientId === userId && !recipient.isDeleted,
      ),
  );
  if (!isParticipant) {
    throw new AppError("You are not allowed to reply to this conversation", 403);
  }

  const participantIds = new Set();
  const states = new Map();
  for (const message of messages) {
    participantIds.add(message.senderId);
    for (const recipient of message.recipients) {
      participantIds.add(recipient.recipientId);
      const rows = states.get(recipient.recipientId) || [];
      rows.push(recipient);
      states.set(recipient.recipientId, rows);
    }
  }
  const candidateIds = [...participantIds].filter((id) => {
    if (id === userId) return false;
    const rows = states.get(id) || [];
    return !rows.length || rows.some((row) => !row.isDeleted);
  });
  const activeUsers = await prisma.user.findMany({
    where: { schoolId, isActive: true, id: { in: candidateIds } },
    select: { id: true },
  });
  const sendableIds = activeUsers.map((user) => user.id);
  if (!sendableIds.length) {
    throw new AppError("There is no active participant to receive this reply", 400);
  }
  const root = messages.find((message) => message.id === thread.rootId) || parent;
  const subject = root.subject?.startsWith("Re:") ? root.subject : "Re: " + root.subject;
  const created = await prisma.$transaction(async (tx) => {
    const reply = await tx.message.create({
      data: {
        schoolId, senderId: userId, subject: subject.slice(0, 200),
        body, parentMessageId: parent.id,
      },
      select: { id: true },
    });
    await tx.messageRecipient.createMany({
      data: sendableIds.map((recipientId) => {
        const rows = (states.get(recipientId) || []).filter((row) => !row.isDeleted);
        const isArchived = rows.length > 0 && rows.every((row) => row.isArchived);
        return {
          messageId: reply.id, recipientId, schoolId, isArchived,
          archivedAt: isArchived ? new Date() : null,
        };
      }),
    });
    return reply;
  });
  return { id: created.id, recipientCount: sendableIds.length };
};

const setThreadRecipientState = async (schoolId, userId, messageId, field, value) => {
  const thread = await resolveThreadIds(schoolId, messageId);
  const data =
    field === "isRead"
      ? { isRead: value, readAt: value ? new Date() : null }
      : { isArchived: value, archivedAt: value ? new Date() : null };
  const updated = await prisma.messageRecipient.updateMany({
    where: {
      schoolId, messageId: { in: thread.messageIds }, recipientId: userId, isDeleted: false,
    },
    data,
  });
  if (!updated.count) throw new AppError("Message not found in your inbox", 404);
  return { id: thread.rootId, [field]: value };
};
exports.setReadState = (schoolId, userId, messageId, value) =>
  setThreadRecipientState(schoolId, userId, messageId, "isRead", value);
exports.setArchiveState = (schoolId, userId, messageId, value) =>
  setThreadRecipientState(schoolId, userId, messageId, "isArchived", value);

exports.moveToTrash = async (schoolId, userId, messageId) => {
  const thread = await resolveThreadIds(schoolId, messageId);
  const threadViewerRows = await prisma.messageRecipient.findMany({
    where: { schoolId, recipientId: userId, messageId: { in: thread.messageIds } },
    select: { isDeleted: true },
  });
  if (threadViewerRows.length && threadViewerRows.every((row) => row.isDeleted)) {
    throw new AppError("Message not found", 404);
  }
  const target = await prisma.message.findFirst({
    where: { id: messageId, schoolId },
    select: {
      senderId: true, deletedBySender: true,
      recipients: { where: { schoolId, recipientId: userId }, select: { isDeleted: true } },
    },
  });
  if (!target) throw new AppError("Message not found", 404);
  if (target.senderId === userId) {
    if (target.deletedBySender) throw new AppError("Message not found", 404);
    const updated = await prisma.message.updateMany({
      where: {
        schoolId, id: { in: thread.messageIds }, senderId: userId, deletedBySender: false,
      },
      data: { deletedBySender: true },
    });
    if (!updated.count) throw new AppError("Message not found", 404);
    return { id: thread.rootId, deleted: true, scope: "sender" };
  }
  if (!target.recipients.length || target.recipients[0].isDeleted) {
    throw new AppError("Message not found in your inbox", 404);
  }
  const updated = await prisma.messageRecipient.updateMany({
    where: {
      schoolId, messageId: { in: thread.messageIds }, recipientId: userId, isDeleted: false,
    },
    data: { isDeleted: true, deletedAt: new Date() },
  });
  if (!updated.count) throw new AppError("Message not found in your inbox", 404);
  return { id: thread.rootId, deleted: true, scope: "recipient" };
};

exports.getUnreadCount = async (schoolId, userId) => {
  const count = await prisma.messageRecipient.count({
    where: {
      schoolId, recipientId: userId, isRead: false, isDeleted: false, isArchived: false,
    },
  });
  return { count };
};

exports.searchRecipients = async (schoolId, userId, filters = {}) => {
  const search = normalizeText(filters.search);
  const where = { schoolId, isActive: true, id: { not: userId } };
  if (filters.role) where.role = filters.role;
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  const users = await prisma.user.findMany({
    where,
    select: {
      id: true, firstName: true, lastName: true, email: true, role: true, phone: true,
      teacherProfile: { select: { employeeId: true } },
      studentProfile: { select: { admissionNo: true } },
    },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    take: filters.limit,
  });
  return users.map((user) => ({
    id: user.id, name: buildFullName(user), firstName: user.firstName,
    lastName: user.lastName, email: user.email, role: user.role, phone: user.phone,
    staffNumber: user.teacherProfile?.employeeId ?? null,
    studentNumber: user.studentProfile?.admissionNo ?? null,
  }));
};
