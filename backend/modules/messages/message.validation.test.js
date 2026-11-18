const assert = require("node:assert/strict");
const test = require("node:test");
const {
  validateListQuery,
  validateRecipientQuery,
  validateSendMessage,
  validateReply,
} = require("./message.validation");

const recipientId = "44444444-4444-4444-8444-444444444444";

test("send validation requires recipients, subject and body", () => {
  const ok = validateSendMessage({
    recipientIds: [recipientId],
    subject: "Hello",
    body: "World",
  });
  assert.equal(ok.error, undefined);
  assert.equal(ok.value.recipientIds.length, 1);

  assert.ok(validateSendMessage({ recipientIds: [], subject: "x", body: "y" }).error);
  assert.ok(validateSendMessage({ recipientIds: [recipientId], subject: "", body: "y" }).error);
  assert.ok(validateSendMessage({ recipientIds: [recipientId], subject: "x", body: "" }).error);
});

test("send validation rejects an unknown field and a malformed id", () => {
  assert.ok(
    validateSendMessage({
      recipientIds: [recipientId],
      subject: "x",
      body: "y",
      schoolId: "spoofed",
    }).error,
  );
  assert.ok(
    validateSendMessage({
      recipientIds: ["not-a-uuid"],
      subject: "x",
      body: "y",
    }).error,
  );
});

test("send validation accepts a seeded non-RFC variant id", () => {
  const result = validateSendMessage({
    recipientIds: ["44444444-4444-4444-4444-444444444444"],
    subject: "Hi",
    body: "There",
  });
  assert.equal(result.error, undefined);
});

test("list validation applies bounded pagination and a tab whitelist", () => {
  const parsed = validateListQuery({ page: "2", limit: "50", tab: "unread" });
  assert.equal(parsed.error, undefined);
  assert.equal(parsed.value.page, 2);
  assert.equal(parsed.value.limit, 50);
  assert.equal(parsed.value.tab, "unread");

  assert.ok(validateListQuery({ tab: "bogus" }).error);
  assert.ok(validateListQuery({ limit: "1000" }).error);
  assert.equal(validateListQuery({ role: "teacher" }).error, undefined);
  assert.ok(validateListQuery({ role: "wizard" }).error);
});

test("recipient validation restricts role to known values", () => {
  assert.equal(validateRecipientQuery({ role: "teacher" }).error, undefined);
  assert.ok(validateRecipientQuery({ role: "wizard" }).error);
});

test("reply validation requires a body", () => {
  assert.equal(validateReply({ body: "Thanks" }).error, undefined);
  assert.ok(validateReply({}).error);
  assert.ok(validateReply({ body: "   " }).error);
});
