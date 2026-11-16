const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");

const prisma = {};
const originalLoad = Module._load;
Module._load = function load(request, parent, isMain) {
  if (request === "../../config/prisma" && parent?.filename.endsWith("class.service.js")) {
    return prisma;
  }
  return originalLoad.call(this, request, parent, isMain);
};
const classService = require("./class.service");
Module._load = originalLoad;

const schoolId = "11111111-1111-4111-8111-111111111111";
const otherSchoolId = "22222222-2222-4222-8222-222222222222";
const classId = "33333333-3333-4333-8333-333333333333";
const sectionId = "44444444-4444-4444-8444-444444444444";

test("class search, year filter, pagination, and student counts are scoped to one school", async () => {
  let listWhere;
  let countWhere;
  prisma.class = {
    findMany: async ({ where }) => {
      listWhere = where;
      return [{
        id: classId,
        name: "Grade 8",
        code: "G8",
        sections: [{ id: sectionId, academicYear: { name: "2026-2027" } }],
      }];
    },
    count: async ({ where }) => {
      countWhere = where;
      return 1;
    },
  };
  prisma.enrollment = {
    groupBy: async () => [{ sectionId, _count: { _all: 4 } }],
  };

  const result = await classService.listClasses(schoolId, {
    search: "Grade 8",
    academicYear: "2026-2027",
    status: "active",
    page: 2,
    limit: 1,
  });

  assert.equal(listWhere.schoolId, schoolId);
  assert.equal(countWhere.schoolId, schoolId);
  assert.equal(listWhere.isActive, true);
  assert.deepEqual(listWhere.sections, {
    some: { academicYear: { name: "2026-2027" } },
  });
  assert.equal(result.meta.page, 2);
  assert.equal(result.data[0].studentCount, 4);
});

test("a class owned by another school is not returned", async () => {
  let query;
  prisma.class = {
    findFirst: async ({ where }) => {
      query = where;
      return where.schoolId === schoolId ? null : { id: classId };
    },
  };

  const result = await classService.getClass(schoolId, classId);
  assert.equal(result, null);
  assert.deepEqual(query, { id: classId, schoolId });
  assert.notEqual(query.schoolId, otherSchoolId);
});

test("sections cannot be created under a class from another school", async () => {
  let createdLegacyClass = false;
  prisma.$transaction = async (operation) =>
    operation({
      class: { findFirst: async ({ where }) => (where.schoolId === schoolId ? null : { id: classId }) },
      legacyClass: {
        create: async () => {
          createdLegacyClass = true;
          throw new Error("should not create");
        },
      },
    });

  const result = await classService.createSection(schoolId, classId, {
    name: "A",
    code: "A",
    academicYear: "2026-2027",
  });

  assert.equal(result, null);
  assert.equal(createdLegacyClass, false);
});

test("a section with active enrollment cannot be moved to another academic year", async () => {
  prisma.section = {
    findFirst: async () => ({
      id: sectionId,
      classId,
      name: "A",
      academicYear: { name: "2025-2026" },
      academicYearId: "55555555-5555-4555-8555-555555555555",
      legacyClassId: null,
      _count: { enrollments: 1 },
    }),
  };

  await assert.rejects(
    classService.updateSection(schoolId, sectionId, {
      academicYear: "2026-2027",
    }),
    /active enrollments/,
  );
});
