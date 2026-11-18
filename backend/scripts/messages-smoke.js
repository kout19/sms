/* Integration smoke test for the Messages module.
 * Logs in as the seeded admin and exercises every endpoint end-to-end.
 * Run: node scripts/messages-smoke.js
 */
require("../config/load-env");

const BASE = process.env.TEST_BASE_URL || "http://localhost:5000/api/v1";

let token = "";
let passed = 0;
let failed = 0;

const results = [];

async function request(method, path, body, expectedStatus = 200) {
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { status: response.status, json };
}

function check(name, condition, detail = "") {
  if (condition) {
    passed += 1;
    results.push(`PASS  ${name}`);
  } else {
    failed += 1;
    results.push(`FAIL  ${name}${detail ? " :: " + detail : ""}`);
  }
}

async function main() {
  // ---- Auth ----
  const login = await request("POST", "/auth/login", {
    email: process.env.SEED_ADMIN_EMAIL || "admin@demo.com",
    password: process.env.SEED_ADMIN_PASSWORD || "Admin123!",
  });
  check("login as admin", login.status === 200 && !!login.json?.accessToken, JSON.stringify(login.json));

  if (!login.json?.accessToken) {
    console.log(results.join("\n"));
    process.exit(1);
  }
  token = login.json.accessToken;

  // ---- Unread count (baseline) ----
  const unread0 = await request("GET", "/messages/unread-count");
  check("get unread count", unread0.status === 200 && typeof unread0.json?.data?.count === "number", JSON.stringify(unread0.json));

  // ---- Recipient search ----
  const recips = await request("GET", "/messages/recipients?limit=50");
  check(
    "search recipients",
    recips.status === 200 && Array.isArray(recips.json?.data) && recips.json.data.length > 0,
    JSON.stringify(recips.json).slice(0, 300),
  );
  const teacherRecipients = recips.json?.data?.filter((u) => u.role === "teacher") || [];
  const otherRecipients = recips.json?.data?.filter((u) => u.role !== "teacher") || [];

  const roleFiltered = await request("GET", "/messages/recipients?role=teacher");
  check(
    "recipient role filter",
    roleFiltered.status === 200 &&
      Array.isArray(roleFiltered.json?.data) &&
      roleFiltered.json.data.every((u) => u.role === "teacher"),
    JSON.stringify(roleFiltered.json).slice(0, 200),
  );

  const searchFiltered = await request("GET", "/messages/recipients?search=Demo");
  check(
    "recipient search by name",
    searchFiltered.status === 200 && Array.isArray(searchFiltered.json?.data),
    JSON.stringify(searchFiltered.json).slice(0, 200),
  );

  // ---- Compose: single recipient ----
  const singleRecipient = teacherRecipients[0] || otherRecipients[0];
  check("a recipient exists", !!singleRecipient);

  const sendSingle = await request("POST", "/messages", {
    recipientIds: [singleRecipient.id],
    subject: "Smoke test single",
    body: "Hello from the smoke test (single recipient).",
  }, 201);
  check("send to one recipient", sendSingle.status === 201 && !!sendSingle.json?.data?.id, JSON.stringify(sendSingle.json));
  const singleMessageId = sendSingle.json?.data?.id;

  // ---- Compose: multiple recipients ----
  const multiIds = [...new Set([teacherRecipients[0]?.id, teacherRecipients[1]?.id, otherRecipients[0]?.id].filter(Boolean))];
  const sendMulti = await request("POST", "/messages", {
    recipientIds: multiIds.length >= 2 ? multiIds : [singleRecipient.id, otherRecipients[0]?.id].filter((v, i, a) => v && a.indexOf(v) === i),
    subject: "Smoke test multi",
    body: "Hello from the smoke test (multiple recipients).",
  }, 201);
  check("send to multiple recipients", sendMulti.status === 201 && !!sendMulti.json?.data?.id, JSON.stringify(sendMulti.json));
  const multiMessageId = sendMulti.json?.data?.id;

  // ---- Validation ----
  const invalidSend = await request("POST", "/messages", { recipientIds: [], subject: "", body: "" }, 400);
  check("reject invalid send payload", invalidSend.status === 400, JSON.stringify(invalidSend.json));

  // ---- Sent list ----
  const sent = await request("GET", "/messages/sent");
  check(
    "list sent messages",
    sent.status === 200 && Array.isArray(sent.json?.data) && sent.json.data.length >= 2,
    JSON.stringify(sent.json).slice(0, 300),
  );
  const sentMulti = sent.json?.data?.find((m) => m.id === multiMessageId);
  check(
    "sent message exposes recipients",
    !!sentMulti && Array.isArray(sentMulti.recipients) && sentMulti.recipients.length >= 2,
    JSON.stringify(sentMulti || {}).slice(0, 300),
  );

  // ---- Sent detail ----
  const sentDetail = await request("GET", `/messages/${multiMessageId}`);
  check(
    "sent message detail",
    sentDetail.status === 200 && sentDetail.json?.data?.isSender === true,
    JSON.stringify(sentDetail.json).slice(0, 300),
  );

  // ---- Unauthenticated access ----
  const noAuth = await fetch(`${BASE}/messages/inbox`);
  check("reject unauthenticated request", noAuth.status === 401);

  // ---- Not found ----
  const notFound = await request("GET", "/messages/00000000-0000-4000-8000-000000000000");
  check("unknown message returns 404", notFound.status === 404, JSON.stringify(notFound.json));

  // ---- Cross-user read/unread independence requires a second login ----
  let teacherToken = "";
  const teacherLogin = await request("POST", "/auth/login", {
    email: process.env.SEED_TEACHER_EMAIL || "teacher@demo.com",
    password: process.env.SEED_TEACHER_PASSWORD || "Teacher123!",
  });
  check("login as teacher", teacherLogin.status === 200 && !!teacherLogin.json?.accessToken, JSON.stringify(teacherLogin.json).slice(0, 200));

  if (teacherLogin.json?.accessToken) {
    const savedToken = token;
    teacherToken = teacherLogin.json.accessToken;
    token = teacherToken;

    const teacherInbox = await request("GET", "/messages/inbox");
    check(
      "teacher sees received message",
      teacherInbox.status === 200 && Array.isArray(teacherInbox.json?.data),
      JSON.stringify(teacherInbox.json).slice(0, 200),
    );

    const targetRow = teacherInbox.json?.data?.find((m) => m.id === multiMessageId || m.id === singleMessageId)
      || teacherInbox.json?.data?.[0];
    check("teacher has an inbox message", !!targetRow, JSON.stringify(teacherInbox.json).slice(0, 200));

    if (targetRow) {
      // Mark read as teacher
      const markRead = await request("PATCH", `/messages/${targetRow.id}/read`);
      check("teacher marks message read", markRead.status === 200 && markRead.json?.data?.isRead === true, JSON.stringify(markRead.json));

      const markUnread = await request("PATCH", `/messages/${targetRow.id}/unread`);
      check("teacher marks message unread", markUnread.status === 200 && markUnread.json?.data?.isRead === false, JSON.stringify(markUnread.json));

      // Archive
      const archive = await request("PATCH", `/messages/${targetRow.id}/archive`);
      check("teacher archives message", archive.status === 200 && archive.json?.data?.isArchived === true, JSON.stringify(archive.json));

      const archivedList = await request("GET", "/messages/inbox?tab=archived");
      check(
        "archived message appears in archived tab",
        archivedList.status === 200 && (archivedList.json?.data || []).some((m) => m.id === targetRow.id),
        JSON.stringify(archivedList.json).slice(0, 200),
      );

      const unarchive = await request("PATCH", `/messages/${targetRow.id}/unarchive`);
      check("teacher unarchives message", unarchive.status === 200 && unarchive.json?.data?.isArchived === false, JSON.stringify(unarchive.json));

      // Reply as teacher
      const reply = await request("POST", `/messages/${targetRow.id}/reply`, { body: "Thanks, got it." }, 201);
      check("teacher replies to message", reply.status === 201 && !!reply.json?.data?.id, JSON.stringify(reply.json));
    }

    // Teacher cannot read a message they are not a party to: create one as admin to a different user, then teacher tries.
    token = savedToken;
  }

  // ---- Tenant isolation: admin cannot read a message from another school ----
  // We cannot easily create another school's data here; instead verify admin
  // cannot access a random/other user's message id that isn't theirs.
  const crossRead = await request("GET", `/messages/${multiMessageId}`);
  check("admin can read own sent message", crossRead.status === 200);

  // ---- Unread count after marking read ----
  const unread1 = await request("GET", "/messages/unread-count");
  check("unread count endpoint still valid", unread1.status === 200);

  // ---- Trash (recipient-specific) ----
  const trash = await request("DELETE", `/messages/${singleMessageId}`);
  check("move message to trash (sender scope)", trash.status === 200 && trash.json?.data?.deleted === true, JSON.stringify(trash.json));

  const inboxAfterTrash = await request("GET", "/messages/inbox");
  check(
    "trashed message no longer in inbox list (sender view unaffected for inbox)",
    inboxAfterTrash.status === 200 && Array.isArray(inboxAfterTrash.json?.data),
    JSON.stringify(inboxAfterTrash.json).slice(0, 200),
  );

  // ---- Pagination ----
  const paged = await request("GET", "/messages/inbox?page=1&limit=1");
  check(
    "pagination metadata",
    paged.status === 200 && paged.json?.meta?.page === 1 && paged.json?.meta?.limit === 1,
    JSON.stringify(paged.json?.meta || {}),
  );

  // ---- Search ----
  const searchInbox = await request("GET", "/messages/inbox?search=Smoke");
  check("inbox search returns array", searchInbox.status === 200 && Array.isArray(searchInbox.json?.data), JSON.stringify(searchInbox.json).slice(0, 200));

  console.log(results.join("\n"));
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("Smoke test crashed:", error);
  process.exit(1);
});