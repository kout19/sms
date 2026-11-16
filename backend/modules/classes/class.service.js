const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");

const gradeFromName = (value) =>
  normalizeText(value).replace(/^grade\s+/i, "");

const rethrowKnown = (error) => {
  if (error instanceof AppError) throw error;
  if (error?.code === "P2002") {
    throw new AppError("A class or section with this code already exists", 409);
  }
  if (error?.code === "P2003") {
    throw new AppError("This record is still referenced by academic records", 409);
  }
  throw error;
};

const normalizeSection = (section) => ({
  ...section,
  academicYear: section.academicYear?.name || "",
});

const enrollmentCounts = async (schoolId, sectionIds, academicYear) => {
  if (!sectionIds.length) return new Map();
  const grouped = await prisma.enrollment.groupBy({
    by: ["sectionId"],
    where: {
      schoolId,
      sectionId: { in: sectionIds },
      isActive: true,
      ...(academicYear ? { academicYear: { name: academicYear } } : {}),
      studentProfile: { user: { is: { isActive: true } } },
      section: { is: { isActive: true } },
    },
    _count: { _all: true },
  });
  return new Map(grouped.map((row) => [row.sectionId, row._count._all]));
};

const withClassCounts = async (schoolId, records, year) => {
  const sectionCounts = await enrollmentCounts(
    schoolId,
    records.flatMap((item) => item.sections.map((section) => section.id)),
    year,
  );
  return records.map(({ sections, ...schoolClass }) => ({
    ...schoolClass,
    academicYears: [...new Set(sections.map((section) => section.academicYear.name))],
    sectionCount: sections.length,
    studentCount: sections.reduce(
      (total, section) => total + (sectionCounts.get(section.id) || 0),
      0,
    ),
  }));
};

const sectionSelect = {
  id: true,
  schoolId: true,
  classId: true,
  name: true,
  code: true,
  academicYearId: true,
  academicYear: { select: { name: true } },
  capacity: true,
  room: true,
  isActive: true,
  homeroomTeacherId: true,
  legacyClassId: true,
  createdAt: true,
  updatedAt: true,
  homeroomTeacher: {
    select: { id: true, firstName: true, lastName: true, email: true },
  },
};

const getSectionStudentCounts = async (schoolId, sections) => {
  const counts = await enrollmentCounts(
    schoolId,
    sections.map((section) => section.id),
  );
  return sections.map((section) => ({
    ...normalizeSection(section),
    studentCount: counts.get(section.id) || 0,
  }));
};

exports.listClasses = async (schoolId, filters) => {
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 20;
  const search = normalizeText(filters.search);
  const year = normalizeText(filters.academicYear);
  const where = { schoolId };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
    ];
  }
  if (year) where.sections = { some: { academicYear: { name: year } } };
  if (filters.status === "active") where.isActive = true;
  if (filters.status === "inactive") where.isActive = false;

  const [records, total] = await Promise.all([
    prisma.class.findMany({
      where,
      include: {
        sections: {
          where: year ? { academicYear: { name: year } } : undefined,
          select: { id: true, academicYear: { select: { name: true } } },
        },
      },
      orderBy: { [filters.sort || "name"]: filters.order || "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.class.count({ where }),
  ]);
  const data = await withClassCounts(schoolId, records, year || undefined);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

exports.getClass = async (schoolId, id, academicYear) => {
  if (!UUID_PATTERN.test(id)) return null;
  const classRecord = await prisma.class.findFirst({
    where: { id, schoolId },
    include: {
      sections: {
        where: academicYear ? { academicYear: { name: academicYear } } : undefined,
        select: sectionSelect,
        orderBy: [{ academicYear: { name: "desc" } }, { name: "asc" }],
      },
    },
  });
  if (!classRecord) return null;
  const sections = await getSectionStudentCounts(schoolId, classRecord.sections);
  return {
    ...classRecord,
    academicYears: [...new Set(sections.map((item) => item.academicYear))],
    sectionCount: sections.length,
    studentCount: sections.reduce((total, item) => total + item.studentCount, 0),
    sections,
  };
};

exports.createClass = async (schoolId, payload) => {
  try {
    return await prisma.class.create({
      data: {
        schoolId,
        name: normalizeText(payload.name),
        code: normalizeText(payload.code).toUpperCase(),
        grade: gradeFromName(payload.name),
        description: payload.description == null
          ? null
          : normalizeText(payload.description),
        isActive: payload.isActive !== false,
      },
    });
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.updateClass = async (schoolId, id, payload) => {
  if (!UUID_PATTERN.test(id)) return null;
  const existing = await prisma.class.findFirst({
    where: { id, schoolId },
    select: { id: true },
  });
  if (!existing) return null;
  const data = {};
  if (payload.name !== undefined) data.name = normalizeText(payload.name);
  if (payload.code !== undefined) data.code = normalizeText(payload.code).toUpperCase();
  if (payload.description !== undefined) {
    data.description = payload.description == null
      ? null
      : normalizeText(payload.description);
  }
  try {
    return await prisma.class.update({ where: { id, schoolId }, data });
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.updateClassStatus = async (schoolId, id, isActive) => {
  if (!UUID_PATTERN.test(id)) return null;
  try {
    return await prisma.class.updateMany({
      where: { id, schoolId },
      data: { isActive },
    }).then(async ({ count }) =>
      count
        ? prisma.class.findFirst({ where: { id, schoolId } })
        : null,
    );
  } catch (error) {
    rethrowKnown(error);
  }
};

const assertTeacherInSchool = async (client, schoolId, teacherId) => {
  if (!teacherId) return;
  const teacher = await client.user.findFirst({
    where: { id: teacherId, schoolId, role: "teacher", isActive: true },
    select: { id: true },
  });
  if (!teacher) {
    throw new AppError("Selected homeroom teacher is not active in this school", 400);
  }
};

const findOrCreateAcademicYear = async (client, schoolId, name) => {
  const academicYear = await client.academicYear.upsert({
    where: { schoolId_name: { schoolId, name } },
    create: { schoolId, name },
    update: {},
  });
  if (!academicYear.isActive) {
    throw new AppError("The selected academic year is inactive", 400);
  }
  return academicYear;
};

exports.listSections = async (schoolId, classId, academicYear) => {
  if (!UUID_PATTERN.test(classId)) return null;
  const parentClass = await prisma.class.findFirst({
    where: { id: classId, schoolId },
    select: { id: true },
  });
  if (!parentClass) return null;
  const sections = await prisma.section.findMany({
    where: {
      schoolId,
      classId,
      ...(academicYear ? { academicYear: { name: academicYear } } : {}),
    },
    select: sectionSelect,
    orderBy: [{ academicYear: { name: "desc" } }, { name: "asc" }],
  });
  return getSectionStudentCounts(schoolId, sections);
};

exports.getSection = async (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;
  const section = await prisma.section.findFirst({
    where: { id, schoolId },
    select: {
      ...sectionSelect,
      class: { select: { id: true, name: true, code: true, isActive: true } },
    },
  });
  if (!section) return null;
  const [withCounts] = await getSectionStudentCounts(schoolId, [section]);
  return withCounts;
};

exports.createSection = async (schoolId, classId, payload) => {
  if (!UUID_PATTERN.test(classId)) return null;
  try {
    const section = await prisma.$transaction(async (tx) => {
      const parentClass = await tx.class.findFirst({
        where: { id: classId, schoolId, isActive: true },
        select: { id: true, name: true, grade: true },
      });
      if (!parentClass) return null;
      const academicYear = await findOrCreateAcademicYear(
        tx,
        schoolId,
        normalizeText(payload.academicYear),
      );
      await assertTeacherInSchool(tx, schoolId, payload.homeroomTeacherId);
      const legacyClass = await tx.legacyClass.create({
        data: {
          schoolId,
          name: `${parentClass.name} ${normalizeText(payload.name)}`,
          grade: parentClass.grade,
          section: normalizeText(payload.name),
          academicYear: normalizeText(payload.academicYear),
          capacity: payload.capacity ?? null,
          homeroomTeacherId: payload.homeroomTeacherId || null,
        },
      });
      return tx.section.create({
        data: {
          schoolId,
          classId,
          name: normalizeText(payload.name),
          code: normalizeText(payload.code).toUpperCase(),
          academicYearId: academicYear.id,
          capacity: payload.capacity ?? null,
          room: payload.room == null ? null : normalizeText(payload.room),
          homeroomTeacherId: payload.homeroomTeacherId || null,
          legacyClassId: legacyClass.id,
          isActive: payload.isActive !== false,
        },
        select: sectionSelect,
      });
    });
    return section ? normalizeSection(section) : null;
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.updateSection = async (schoolId, id, payload) => {
  if (!UUID_PATTERN.test(id)) return null;
  const existing = await prisma.section.findFirst({
    where: { id, schoolId },
    select: {
      id: true,
      classId: true,
      name: true,
      academicYearId: true,
      academicYear: { select: { name: true } },
      legacyClassId: true,
      _count: { select: { enrollments: { where: { isActive: true } } } },
    },
  });
  if (!existing) return null;
  if (
    payload.academicYear !== undefined &&
    payload.academicYear !== existing.academicYear.name &&
    existing._count.enrollments > 0
  ) {
    throw new AppError("A section with active enrollments cannot be moved to another academic year", 409);
  }
  if (payload.capacity !== undefined && payload.capacity !== null) {
    const enrolled = await prisma.enrollment.count({
      where: { schoolId, sectionId: id, isActive: true },
    });
    if (payload.capacity < enrolled) {
      throw new AppError("Capacity cannot be lower than the current active enrollment", 409);
    }
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      await assertTeacherInSchool(tx, schoolId, payload.homeroomTeacherId);
      const data = {};
      if (payload.name !== undefined) data.name = normalizeText(payload.name);
      if (payload.code !== undefined) data.code = normalizeText(payload.code).toUpperCase();
      if (payload.academicYear !== undefined) {
        const academicYear = await findOrCreateAcademicYear(
          tx,
          schoolId,
          normalizeText(payload.academicYear),
        );
        data.academicYearId = academicYear.id;
      }
      if (payload.capacity !== undefined) data.capacity = payload.capacity;
      if (payload.room !== undefined) {
        data.room = payload.room == null ? null : normalizeText(payload.room);
      }
      if (payload.homeroomTeacherId !== undefined) {
        data.homeroomTeacherId = payload.homeroomTeacherId || null;
      }

      const updated = await tx.section.update({
        where: { id, schoolId },
        data,
        select: sectionSelect,
      });
      if (existing.legacyClassId) {
        const legacyData = {};
        if (payload.name !== undefined) {
          legacyData.section = normalizeText(payload.name);
          const parentClass = await tx.class.findFirst({
            where: { id: existing.classId, schoolId },
            select: { name: true },
          });
          legacyData.name = `${parentClass.name} ${normalizeText(payload.name)}`;
        }
        if (payload.academicYear !== undefined) {
          legacyData.academicYear = normalizeText(payload.academicYear);
        }
        if (payload.capacity !== undefined) legacyData.capacity = payload.capacity;
        if (payload.homeroomTeacherId !== undefined) {
          legacyData.homeroomTeacherId = payload.homeroomTeacherId || null;
        }
        if (Object.keys(legacyData).length) {
          await tx.legacyClass.update({
            where: { id: existing.legacyClassId },
            data: legacyData,
          });
        }
      }
      return updated;
    });
    return normalizeSection(updated);
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.updateSectionStatus = async (schoolId, id, isActive) => {
  if (!UUID_PATTERN.test(id)) return null;
  try {
    return await prisma.section.updateMany({
      where: { id, schoolId },
      data: { isActive },
    }).then(async ({ count }) =>
      count
        ? prisma.section.findFirst({ where: { id, schoolId }, select: sectionSelect })
        : null,
    );
  } catch (error) {
    rethrowKnown(error);
  }
};
