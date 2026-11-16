const assert = require("node:assert/strict");
const test = require("node:test");
const {
  validateCreateExam,
  validateExamList,
  validateUpdateExam,
} = require("./exam.validation");

const validExam = {
  academicYearId: "123e4567-e89b-42d3-a456-426614174000",
  sectionId: "223e4567-e89b-42d3-a456-426614174000",
  subjectId: "323e4567-e89b-42d3-a456-426614174000",
  name: "Mathematics Midterm",
  type: "Midterm",
  examDate: "2026-11-20",
  startTime: "09:00",
  endTime: "11:00",
  totalMarks: 100,
  passingMarks: 50,
};

test("exam creation accepts valid values and rejects invalid marks and times", () => {
  assert.equal(validateCreateExam(validExam).error, undefined);
  assert.ok(validateCreateExam({ ...validExam, schoolId: validExam.academicYearId }).error);
  assert.ok(
    validateCreateExam({ ...validExam, passingMarks: 101 }).error,
  );
  assert.ok(
    validateCreateExam({ ...validExam, endTime: "08:00" }).error,
  );
  assert.ok(
    validateCreateExam({ ...validExam, startTime: "09:00", endTime: undefined }).error,
  );
});

test("exam updates require a field and reject unknown input", () => {
  assert.ok(validateUpdateExam({}).error);
  assert.ok(validateUpdateExam({ schoolId: validExam.academicYearId }).error);
  assert.ok(validateUpdateExam({ totalMarks: 80 }).error);
  assert.ok(validateUpdateExam({ startTime: "08:00" }).error);
  assert.equal(validateUpdateExam({ name: "New title" }).error, undefined);
});

test("exam list validation applies bounded pagination and rejects unsafe sorting", () => {
  const parsed = validateExamList({ page: "2", limit: "50", sort: "examDate" });
  assert.equal(parsed.error, undefined);
  assert.equal(parsed.value.page, 2);
  assert.equal(parsed.value.limit, 50);
  assert.ok(validateExamList({ sort: "schoolId" }).error);
  assert.ok(validateExamList({ limit: "1000" }).error);
});
