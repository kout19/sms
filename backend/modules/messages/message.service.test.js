const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");

const prisma = {};
const originalLoad = Module._load;
Module._load = function load(request, parent, isMain) {
  if (
    request === "../../config/prisma" &&
    parent?.filename.endsWith("message.service.js")
  ) {
    return prisma;
  }
  return originalLoad.call(this, request, parent, isMain);
};
const messageService = require("./message.service");
Module._load = originalLoad;

const schoolId = "11111111-1111-4111-8111-111111111111";
const adminId = "22222222-2222-4222-8222-222222222222";
const teacherId = "33333333-3333-4333-8333-333333333333";
const parentId = "44444444-4444-4444-8444-444444444444";
const trashedUserId = "55555555-5555-4555-8555-555555555555";
const rootId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const replyId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const nestedReplyId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

const user = (id, firstName, role) => ({
  id, firstName, lastName: "User", email: firstName.toLowerCase() + "@school.test", role,
});
const recipientRow = (id, recipient, state = {}) => ({
  id: id + "-row",
  recipientId: recipient.id,
  recipient,
  isRead: false,
  readAt: null,
  isArchived: false,
  isDeleted: false,
  ...state,
});
const messageRow = ({
  id,
  parentMessageId = null,
  sender = user(adminId, "Admin", "admin"),
  body,
  createdAt,
  recipients = [],
  deletedBySender = false,
}) => ({
  id,
  parentMessageId,
  schoolId,
  senderId: sender.id,
  sender,
  subject: "School update",
  body,
  createdAt: new Date(createdAt),
  deletedBySender,
  recipients,
});
const setThreadQuery = (ids = [rootId]) => {
  prisma.$queryRaw = async () => [{ rootId, messageIds: ids }];
};

test("conversation list batches thread data and clamps pagination metadata", async () => {
  const seen = [];
  prisma.$queryRaw = async (query) => {
    seen.push(query);
    if (query.sql.includes('COUNT(*)::int')) return [{ total: 21 }];
    if (query.sql.includes('SELECT DISTINCT tree."messageId"')) {
      return [{ messageId: rootId }];
    }
    if (query.sql.includes('LIMIT')) {
      return [{
        rootId,
        lastMessageAt: new Date("2026-11-16T09:30:00Z"),
        unreadCount: 2,
        viewerMessageCount: 3,
        isArchived: false,
      }];
    }
    return [];
  };
  prisma.message = {
    findMany: async () => [
      messageRow({
        id: rootId,
        body: "A new school update",
        createdAt: "2026-11-16T09:00:00Z",
        recipients: [recipientRow("r1", user(teacherId, "Teacher", "teacher"))],
      }),
    ],
  };

  const result = await messageService.listInbox(schoolId, teacherId, {
    tab: "unread",
    role: "teacher",
    search: "update",
    page: 99,
    limit: 10,
  });

  assert.equal(result.meta.page, 3);
  assert.equal(result.meta.total, 21);
  assert.equal(result.meta.totalPages, 3);
  assert.equal(result.data[0].id, rootId);
  assert.equal(result.data[0].unreadCount, 2);
  assert.equal(result.data[0].canManageInbox, true);
  assert.ok(seen.some((query) => query.values.includes("%update%")));
  assert.ok(seen.some((query) => query.values.includes("teacher")));
  assert.ok(seen.some((query) => query.values.includes(20)));
});

test("thread retrieval resolves nested replies and returns chronological messages", async () => {
  setThreadQuery([rootId, replyId, nestedReplyId]);
  prisma.messageRecipient = {
    findMany: async () => [{ isDeleted: false }],
  };
  prisma.message = {
    findMany: async () => [
      messageRow({
        id: rootId,
        body: "Root",
        createdAt: "2026-11-16T09:00:00Z",
        recipients: [recipientRow("r1", user(teacherId, "Teacher", "teacher"))],
      }),
      messageRow({
        id: replyId,
        parentMessageId: rootId,
        sender: user(teacherId, "Teacher", "teacher"),
        body: "First reply",
        createdAt: "2026-11-16T09:01:00Z",
        recipients: [recipientRow("r2", user(adminId, "Admin", "admin"))],
      }),
      messageRow({
        id: nestedReplyId,
        parentMessageId: replyId,
        body: "Nested reply",
        createdAt: "2026-11-16T09:02:00Z",
        recipients: [recipientRow("r3", user(teacherId, "Teacher", "teacher"))],
      }),
    ],
  };

  const result = await messageService.getConversationThread(
    schoolId,
    teacherId,
    nestedReplyId,
  );

  assert.equal(result.conversation.id, rootId);
  assert.equal(result.conversation.unreadCount, 2);
  assert.deepEqual(result.messages.map((message) => message.id), [
    rootId,
    replyId,
    nestedReplyId,
  ]);
  assert.equal(result.messages[2].parentMessageId, replyId);
});

test("thread retrieval rejects a trashed conversation even through another thread id", async () => {
  setThreadQuery([rootId, replyId]);
  prisma.messageRecipient = {
    findMany: async () => [{ isDeleted: true }, { isDeleted: true }],
  };
  await assert.rejects(
    messageService.getConversationThread(schoolId, teacherId, replyId),
    /Message not found/,
  );
});

test("cross-school thread ids resolve to not found", async () => {
  prisma.$queryRaw = async (query) => {
    assert.ok(query.values.includes(schoolId));
    return [{ rootId: null, messageIds: [] }];
  };
  await assert.rejects(
    messageService.getConversationThread(schoolId, teacherId, rootId),
    /Message not found/,
  );
});

test("direct detail denies a recipient whose message was trashed", async () => {
  prisma.message = {
    findFirst: async ({ where }) => {
      assert.equal(where.schoolId, schoolId);
      return {
        id: rootId,
        schoolId,
        senderId: adminId,
        deletedBySender: false,
        subject: "Private",
        body: "Private content",
        parentMessageId: null,
        createdAt: new Date(),
        sender: user(adminId, "Admin", "admin"),
        recipients: [
          recipientRow("r1", user(teacherId, "Teacher", "teacher"), {
            isDeleted: true,
          }),
        ],
      };
    },
  };
  setThreadQuery([rootId]);
  prisma.messageRecipient = {
    findMany: async () => [{ isDeleted: true }],
  };
  await assert.rejects(
    messageService.getMessage(schoolId, teacherId, rootId),
    /Message not found/,
  );
});

test("an unrelated user cannot reply to a private thread", async () => {
  setThreadQuery([rootId]);
  prisma.messageRecipient = { findMany: async () => [] };
  prisma.message = {
    findMany: async () => [
      messageRow({
        id: rootId,
        body: "Private",
        createdAt: "2026-11-16T09:00:00Z",
        recipients: [recipientRow("r1", user(parentId, "Parent", "parent"))],
      }),
    ],
  };
  prisma.user = { findMany: async () => assert.fail("outsider must be rejected first") };

  await assert.rejects(
    messageService.replyToMessage(schoolId, teacherId, rootId, "Intrusion"),
    /Message not found/,
  );
});

test("reply to a participant thread targets only active, non-trashed school participants", async () => {
  setThreadQuery([rootId, replyId]);
  const admin = user(adminId, "Admin", "admin");
  const teacher = user(teacherId, "Teacher", "teacher");
  const parent = user(parentId, "Parent", "parent");
  const trashed = user(trashedUserId, "Trashed", "parent");
  prisma.messageRecipient = {
    findMany: async () => [{ isDeleted: false }],
  };
  prisma.message = {
    findMany: async () => [
      messageRow({
        id: rootId,
        body: "Root",
        createdAt: "2026-11-16T09:00:00Z",
        recipients: [
          recipientRow("r1", teacher),
          recipientRow("r2", parent, { isArchived: true }),
          recipientRow("r3", trashed, { isDeleted: true }),
        ],
      }),
      messageRow({
        id: replyId,
        parentMessageId: rootId,
        sender: teacher,
        body: "Reply",
        createdAt: "2026-11-16T09:01:00Z",
        recipients: [recipientRow("r4", admin)],
      }),
    ],
  };
  let userWhere;
  prisma.user = {
    findMany: async ({ where }) => {
      userWhere = where;
      return [{ id: adminId }, { id: parentId }];
    },
  };
  let createdRecipients;
  prisma.$transaction = async (callback) =>
    callback({
      message: {
        create: async ({ data }) => {
          assert.equal(data.parentMessageId, replyId);
          return { id: nestedReplyId };
        },
      },
      messageRecipient: {
        createMany: async ({ data }) => {
          createdRecipients = data;
        },
      },
    });

  const result = await messageService.replyToMessage(
    schoolId,
    teacherId,
    replyId,
    "A nested response",
  );

  assert.equal(result.id, nestedReplyId);
  assert.equal(userWhere.schoolId, schoolId);
  assert.equal(userWhere.isActive, true);
  assert.deepEqual(createdRecipients.map((row) => row.recipientId), [
    adminId,
    parentId,
  ]);
  assert.equal(createdRecipients[1].isArchived, true);
});

test("read and archive changes only update the caller's active recipient rows", async () => {
  setThreadQuery([rootId, replyId]);
  let updates = [];
  prisma.messageRecipient = {
    updateMany: async (args) => {
      updates.push(args);
      return { count: 2 };
    },
  };

  const read = await messageService.setReadState(schoolId, teacherId, replyId, true);
  const archived = await messageService.setArchiveState(
    schoolId,
    teacherId,
    rootId,
    true,
  );

  assert.equal(read.id, rootId);
  assert.equal(read.isRead, true);
  assert.equal(archived.isArchived, true);
  for (const update of updates) {
    assert.equal(update.where.schoolId, schoolId);
    assert.equal(update.where.recipientId, teacherId);
    assert.deepEqual(update.where.messageId.in, [rootId, replyId]);
    assert.equal(update.where.isDeleted, false);
  }
  assert.equal(updates[0].data.isRead, true);
  assert.equal(updates[1].data.isArchived, true);
});

test("recipient trash soft-deletes only the caller's thread recipient rows", async () => {
  setThreadQuery([rootId, replyId]);
  let update;
  prisma.messageRecipient = {
    findMany: async () => [{ isDeleted: false }],
    updateMany: async (args) => {
      update = args;
      return { count: 2 };
    },
  };
  prisma.message = {
    findFirst: async () => ({
      senderId: adminId,
      deletedBySender: false,
      recipients: [{ isDeleted: false }],
    }),
  };

  const result = await messageService.moveToTrash(schoolId, teacherId, rootId);
  assert.equal(result.scope, "recipient");
  assert.equal(result.deleted, true);
  assert.equal(update.where.recipientId, teacherId);
  assert.equal(update.where.schoolId, schoolId);
  assert.equal(update.where.isDeleted, false);
  assert.equal(update.data.isDeleted, true);
});

test("unread count excludes read, deleted, archived, other-user, and other-school rows", async () => {
  let where;
  prisma.messageRecipient = {
    count: async (args) => {
      where = args.where;
      return 4;
    },
  };
  const result = await messageService.getUnreadCount(schoolId, teacherId);
  assert.deepEqual(result, { count: 4 });
  assert.deepEqual(where, {
    schoolId,
    recipientId: teacherId,
    isRead: false,
    isDeleted: false,
    isArchived: false,
  });
});
