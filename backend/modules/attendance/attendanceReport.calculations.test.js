const test = require("node:test");
const assert = require("node:assert/strict");
const {
  attendancePercentage,
  dateGroupKey,
} = require("./attendanceReport.calculations");

test("attendance percentage uses all recorded statuses and counts present plus late", () => {
  assert.equal(attendancePercentage({ present: 6, late: 2, absent: 1, excused: 1, total: 10 }), 80);
});

test("attendance percentage is zero when no attendance records were submitted", () => {
  assert.equal(attendancePercentage({ present: 0, late: 0, absent: 0, excused: 0, total: 0 }), 0);
});

test("weekly grouping starts on Monday while daily and monthly groupings remain calendar based", () => {
  const date = new Date("2026-11-18T00:00:00.000Z");
  assert.equal(dateGroupKey(date, "weekly"), "2026-11-16");
  assert.equal(dateGroupKey(date, "daily"), "2026-11-18");
  assert.equal(dateGroupKey(date, "monthly"), "2026-11");
});
