const test = require("node:test");
const assert = require("node:assert/strict");
const {
  validateReportFilters,
  validateReportListQuery,
} = require("./attendanceReport.validation");

test("report filters accept valid date ranges and default the trend grouping", () => {
  const { error, value } = validateReportFilters({
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  });
  assert.equal(error, undefined);
  assert.equal(value.groupBy, "weekly");
});

test("report filters reject missing, reversed, impossible, and oversized date ranges", () => {
  for (const query of [
    { startDate: "2026-01-01" },
    { startDate: "2026-02-01", endDate: "2026-01-31" },
    { startDate: "2026-02-30", endDate: "2026-03-01" },
    { startDate: "2025-01-01", endDate: "2026-01-03" },
  ]) {
    assert.ok(validateReportFilters(query).error, JSON.stringify(query));
  }
});

test("student report pagination is bounded and status values are validated", () => {
  assert.ok(validateReportListQuery({ kind: "absences", page: "0" }, ["absences", "late"]).error);
  assert.ok(validateReportListQuery({ kind: "absences", status: "unmarked" }, ["absences", "late"]).error);
  const { error, value } = validateReportListQuery({ kind: "late", page: "2", limit: "50" }, ["absences", "late"]);
  assert.equal(error, undefined);
  assert.equal(value.page, 2);
  assert.equal(value.limit, 50);
  assert.equal(value.minAbsent, 3);
  assert.equal(value.minLate, 2);
  assert.ok(validateReportListQuery({ kind: "late", minLate: "1" }, ["absences", "late"]).error);
});
