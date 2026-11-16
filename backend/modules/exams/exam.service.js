const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const examInclude = {
  academicYear: { select: { id: true, name: true } },
  section: {
    select: {
      id: true,
      name: true,
      code: true,
      academicYearId: true,
      legacyClassId: true,
      class: { select: { id: true, name: true, code: true } },
    },
  },
  subject: { select: { id: true, name: true, code: true } },
};

const normalizeText = (value) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;

const rethrowKnown = (error) => {
  if (error instanceof AppError) throw error;
  if (error?.code === "P2002") {
    throw new AppError("An exam with these details already exists", 409);
  }
  if (error?.code === "P2003") {
    throw new AppError("This exam is still referenced by academic records", 409);
  }
  throw error;
};

const assertReferences = async (client, schoolId, values) => {
  const [academicYear, section, subject] = await Promise.all([
    client.academicYear.findFirst({
      where: { id: values.academicYearId, schoolId, isActive: true },
      select: { id: true, name: true },
    }),
    client.section.findFirst({
      where: { id: values.sectionId, schoolId, isActive: true },
      select: {
        id: true,
        academicYearId: true,
        legacyClassId: true,
        class: { select: { id: true, isActive: true } },
      },
    }),
    client.subject.findFirst({
      where: { id: values.subjectId, schoolId, isActive: true },
      select: { id: true },
    }),
  ]);

  if (!academicYear) {
    throw new AppError("The selected academic year is not active in this school", 400);
  }
  if (!section || !section.class.isActive) {
    throw new AppError("The selected class section is not active in this school", 400);
  }
  if (!subject) {
    throw new AppError("The selected subject is not active in this school", 400);
  }
  if (section.academicYearId !== academicYear.id) {
    throw new AppError("The selected section does not belong to the selected academic year", 400);
  }
  if (!section.legacyClassId) {
    throw new AppError("The selected section has no subject-offering link", 400);
  }

  const offering = await client.subjectClass.findFirst({
    where: {
      schoolId,
      subjectId: subject.id,
      classId: section.legacyClassId,
      OR: [{ academicYear: null }, { academicYear: academicYear.name }],
    },
    select: { id: true },
  });
  if (!offering) {
    throw new AppError("The selected subject is not offered for this section and academic year", 400);
  }
};

const buildWhere = (schoolId, filters) => {
  const where = { schoolId };

  if (filters.status === "archived") {
    where.archivedAt = { not: null };
  } else {
    where.archivedAt = null;
    if (filters.status) where.status = filters.status;
  }
  if (filters.academicYearId) where.academicYearId = filters.academicYearId;
  if (filters.subjectId) where.subjectId = filters.subjectId;
  if (filters.classId) {
    where.section = { is: { classId: filters.classId } };
  }
  if (filters.type) where.type = filters.type;

  const search = normalizeText(filters.search);
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { subject: { is: { name: { contains: search, mode: "insensitive" } } } },
      { section: { is: { name: { contains: search, mode: "insensitive" } } } },
      {
        section: {
          is: {
            class: { is: { name: { contains: search, mode: "insensitive" } } },
          },
        },
      },
    ];
  }

  return where;
};

exports.listExams = async (schoolId, filters) => {
  const where = buildWhere(schoolId, filters);
  const { page, limit, sort, order } = filters;
  const [data, total] = await Promise.all([
    prisma.exam.findMany({
      where,
      include: examInclude,
      orderBy: [{ [sort]: order }, { id: order }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.exam.count({ where }),
  ]);

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

exports.getExam = async (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;
  return prisma.exam.findFirst({
    where: { id, schoolId },
    include: examInclude,
  });
};

exports.getExamOptions = async (schoolId) => {
  const [academicYears, classes, subjects, examTypes] = await Promise.all([
    prisma.academicYear.findMany({
      where: { schoolId, isActive: true },
      select: { id: true, name: true, isCurrent: true },
      orderBy: [{ isCurrent: "desc" }, { name: "desc" }],
    }),
    prisma.class.findMany({
      where: { schoolId, isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
        sections: {
          where: {
            schoolId,
            isActive: true,
            academicYear: { is: { schoolId, isActive: true } },
          },
          select: {
            id: true,
            name: true,
            code: true,
            legacyClassId: true,
            academicYearId: true,
            academicYear: { select: { id: true, name: true, isCurrent: true } },
          },
          orderBy: [{ academicYear: { name: "desc" } }, { name: "asc" }],
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.subject.findMany({
      where: { schoolId, isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
        classLinks: {
          where: { schoolId },
          select: { classId: true, academicYear: true },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.exam.findMany({
      where: { schoolId, archivedAt: null },
      select: { type: true },
      distinct: ["type"],
      orderBy: { type: "asc" },
    }),
  ]);

  return {
    academicYears,
    classes: classes.map((schoolClass) => ({
      ...schoolClass,
      sections: schoolClass.sections.map((section) => ({
        ...section,
        subjects: section.legacyClassId
          ? subjects
              .filter((subject) =>
                subject.classLinks.some(
                  (link) =>
                    link.classId === section.legacyClassId &&
                    (!link.academicYear ||
                      link.academicYear === section.academicYear.name),
                ),
              )
              .map(({ classLinks, ...subject }) => subject)
          : [],
      })),
    })),
    subjects: subjects.map(({ classLinks, ...subject }) => subject),
    types: examTypes.map((exam) => exam.type),
  };
};

exports.getExamStats = async (schoolId, academicYearId) => {
  const where = { schoolId, archivedAt: null };
  if (academicYearId) where.academicYearId = academicYearId;
  const groups = await prisma.exam.groupBy({
    by: ["status"],
    where,
    _count: { _all: true },
  });
  const counts = Object.fromEntries(
    groups.map((group) => [group.status, group._count._all]),
  );
  return {
    scheduled: counts.scheduled || 0,
    ongoing: counts.ongoing || 0,
    completed: counts.completed || 0,
    total: groups.reduce((sum, group) => sum + group._count._all, 0),
  };
};

exports.createExam = async (schoolId, payload) => {
  await assertReferences(prisma, schoolId, payload);
  try {
    return await prisma.exam.create({
      data: {
        schoolId,
        ...payload,
        name: normalizeText(payload.name),
        description: normalizeText(payload.description) || null,
        type: normalizeText(payload.type),
        term: normalizeText(payload.term) || null,
      },
      include: examInclude,
    });
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.updateExam = async (schoolId, id, payload) => {
  if (!UUID_PATTERN.test(id)) return null;
  const existing = await prisma.exam.findFirst({
    where: { id, schoolId },
    select: {
      id: true,
      archivedAt: true,
      academicYearId: true,
      sectionId: true,
      subjectId: true,
    },
  });
  if (!existing) return null;
  if (existing.archivedAt) {
    throw new AppError("Archived exams cannot be changed", 409);
  }

  const referenceValues = {
    academicYearId: payload.academicYearId ?? existing.academicYearId,
    sectionId: payload.sectionId ?? existing.sectionId,
    subjectId: payload.subjectId ?? existing.subjectId,
  };
  if (
    payload.academicYearId !== undefined ||
    payload.sectionId !== undefined ||
    payload.subjectId !== undefined
  ) {
    await assertReferences(prisma, schoolId, referenceValues);
  }

  const data = { ...payload };
  if (payload.name !== undefined) data.name = normalizeText(payload.name);
  if (payload.description !== undefined) {
    data.description = normalizeText(payload.description) || null;
  }
  if (payload.type !== undefined) data.type = normalizeText(payload.type);
  if (payload.term !== undefined) data.term = normalizeText(payload.term) || null;

  try {
    return await prisma.exam.update({
      where: { id, schoolId },
      data,
      include: examInclude,
    });
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.archiveExam = async (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;
  const existing = await prisma.exam.findFirst({
    where: { id, schoolId },
    select: { id: true, archivedAt: true },
  });
  if (!existing) return null;
  if (existing.archivedAt) return existing;

  return prisma.exam.update({
    where: { id, schoolId },
    data: { archivedAt: new Date() },
    select: { id: true, archivedAt: true },
  });
};
