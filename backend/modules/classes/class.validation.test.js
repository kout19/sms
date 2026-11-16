const test = require("node:test");
const assert = require("node:assert/strict");
const {
  validateCreateClass,
  validateCreateSection,
  validateClassStatus,
  validateClassList,
} = require("./class.validation");

test("class payloads cannot select a school tenant", () => {
  const { error } = validateCreateClass({
    name: "Grade 8",
    code: "G8",
    schoolId: "11111111-1111-4111-8111-111111111111",
  });
  assert.ok(error);
  const section = validateCreateSection({
    name: "Section A",
    code: "A",
    academicYear: "2026-2027",
    schoolId: "11111111-1111-4111-8111-111111111111",
  });
  assert.ok(section.error);
});

test("section payloads require a year and positive capacity", () => {
  const missingYear = validateCreateSection({
    name: "Section A",
    code: "A",
    capacity: 20,
  });
  const invalidCapacity = validateCreateSection({
    name: "Section A",
    code: "A",
    academicYear: "2026-2027",
    capacity: 0,
  });
  assert.ok(missingYear.error);
  assert.ok(invalidCapacity.error);
});

test("status updates require an explicit boolean", () => {
  assert.ok(validateClassStatus({}).error);
  assert.equal(validateClassStatus({ isActive: false }).error, undefined);
});

test("class listing validates pagination and filters", () => {
  const invalid = validateClassList({ page: "0", limit: "200", extra: "ignored" });
  const valid = validateClassList({ search: "  grade 8  ", page: "2", limit: "7" });
  assert.ok(invalid.error);
  assert.equal(valid.error, undefined);
  assert.equal(valid.value.page, 2);
  assert.equal(valid.value.limit, 7);
});
