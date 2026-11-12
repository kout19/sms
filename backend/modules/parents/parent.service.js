const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");
const { hashPassword } = require("../users/user.helpers");
const { UUID_PATTERN, PARENT_SELECT, toParent } = require("./parent.model");

const parsePage = (filters) => {
  const page = Math.max(1, Math.trunc(Number(filters.page) || 1));
  const limit = Math.min(100, Math.max(1, Math.trunc(Number(filters.limit) || 20)));
  return { page, limit, skip: (page - 1) * limit };
};

const buildParentWhere = (schoolId, filters = {}) => {
  const where = { schoolId, role: "parent" };
  const search = String(filters.search || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 100);

  if (search) {
    const text = { contains: search, mode: "insensitive" };
    where.OR = [
      { firstName: text },
      { lastName: text },
      { email: text },
      { phone: text },
    ];
    const nameParts = search.split(" ");
    if (nameParts.length > 1) {
      where.OR.push({
        AND: [
          { firstName: { contains: nameParts[0], mode: "insensitive" } },
          {
            lastName: {
              contains: nameParts.slice(1).join(" "),
              mode: "insensitive",
            },
          },
        ],
      });
    }
  }

  if (filters.status === "active") where.isActive = true;
  if (filters.status === "inactive") where.isActive = false;
  return where;
};

const ensureEmailAvailable = async (client, email, excludeId) => {
  const existing = await client.user.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });
  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }
};

const assertStudentsInSchool = async (client, schoolId, students) => {
  if (!students?.length) return new Map();
  const studentIds = [...new Set(students.map(({ studentId }) => studentId))];
  const matchingProfiles = await client.studentProfile.findMany({
    where: {
      userId: { in: studentIds },
      user: { schoolId, role: "student" },
    },
    select: { id: true, userId: true },
  });
  if (matchingProfiles.length !== studentIds.length) {
    throw new AppError(
      "One or more selected students are not available in this school",
      400,
    );
  }
  return new Map(
    matchingProfiles.map((profile) => [profile.userId, profile.id]),
  );
};

const parentWhere = (schoolId, id) => ({
  id,
  schoolId,
  role: "parent",
});

const selectParent = (schoolId) => ({
  ...PARENT_SELECT,
  parentStudentLinks: {
    ...PARENT_SELECT.parentStudentLinks,
    where: { schoolId },
  },
});

const rethrowKnown = (error) => {
  if (error instanceof AppError) throw error;
  if (error?.code === "P2002") {
    throw new AppError("An account with this email already exists", 409);
  }
  if (error?.code === "P2003") {
    throw new AppError("A selected student is no longer available", 400);
  }
  throw error;
};

const replaceStudentLinks = async (client, schoolId, parentId, students) => {
  const studentProfileIds = await assertStudentsInSchool(
    client,
    schoolId,
    students,
  );
  await client.parentStudent.deleteMany({ where: { schoolId, parentId } });
  if (students.length) {
    await client.parentStudent.createMany({
      data: students.map(({ studentId, relationship }) => ({
        schoolId,
        parentId,
        studentProfileId: studentProfileIds.get(studentId),
        relationship,
      })),
    });
  }
};

exports.listParents = async (schoolId, filters = {}) => {
  const { page, limit, skip } = parsePage(filters);
  const where = buildParentWhere(schoolId, filters);
  const schoolParents = { schoolId, role: "parent" };

  const [parents, total, activeParents, inactiveParents, linkedProfiles] =
    await Promise.all([
      prisma.user.findMany({
        where,
        select: selectParent(schoolId),
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
      prisma.user.count({ where: { ...schoolParents, isActive: true } }),
      prisma.user.count({ where: { ...schoolParents, isActive: false } }),
      prisma.parentStudent.findMany({
        where: { schoolId },
        select: { studentProfileId: true },
        distinct: ["studentProfileId"],
      }),
    ]);

  return {
    data: parents.map(toParent),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
    summary: {
      totalParents: activeParents + inactiveParents,
      activeParents,
      inactiveParents,
      activePercentage: activeParents + inactiveParents
        ? Math.round((activeParents / (activeParents + inactiveParents)) * 100)
        : 0,
      linkedStudents: linkedProfiles.length,
    },
  };
};

exports.getParentById = async (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;
  const parent = await prisma.user.findFirst({
    where: parentWhere(schoolId, id),
    select: selectParent(schoolId),
  });
  return toParent(parent);
};

exports.listStudentOptions = async (schoolId, filters = {}) => {
  const { page, limit, skip } = parsePage(filters);
  const where = {
    schoolId,
    role: "student",
    isActive: true,
    studentProfile: { isNot: null },
  };
  const search = String(filters.search || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 100);

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      {
        studentProfile: {
          is: { admissionNo: { contains: search, mode: "insensitive" } },
        },
      },
    ];
    const nameParts = search.split(" ");
    if (nameParts.length > 1) {
      where.OR.push({
        AND: [
          { firstName: { contains: nameParts[0], mode: "insensitive" } },
          {
            lastName: {
              contains: nameParts.slice(1).join(" "),
              mode: "insensitive",
            },
          },
        ],
      });
      where.OR.push({
        AND: [
          {
            firstName: {
              contains: nameParts.slice(1).join(" "),
              mode: "insensitive",
            },
          },
          { lastName: { contains: nameParts[0], mode: "insensitive" } },
        ],
      });
    }
  }

  const [students, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        studentProfile: {
          select: {
            admissionNo: true,
            class: {
              select: { grade: true, section: true, academicYear: true },
            },
          },
        },
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: students.map((student) => ({
      id: student.id,
      name: `${student.firstName} ${student.lastName}`.trim(),
      email: student.email,
      admissionNo: student.studentProfile.admissionNo,
      grade: student.studentProfile.class
        ? `${student.studentProfile.class.grade}${student.studentProfile.class.section}`
        : "Unassigned",
      academicYear: student.studentProfile.class?.academicYear || null,
    })),
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
};

exports.createParent = async (schoolId, payload) => {
  try {
    const passwordHash = await hashPassword(payload.password);
    const parentId = await prisma.$transaction(async (transaction) => {
      await ensureEmailAvailable(transaction, payload.email);
      const studentProfileIds = await assertStudentsInSchool(
        transaction,
        schoolId,
        payload.students,
      );
      const parent = await transaction.user.create({
        data: {
          schoolId,
          role: "parent",
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          phone: payload.phone || null,
          passwordHash,
        },
        select: { id: true },
      });
      if (payload.students.length) {
        await transaction.parentStudent.createMany({
          data: payload.students.map(({ studentId, relationship }) => ({
            schoolId,
            parentId: parent.id,
            studentProfileId: studentProfileIds.get(studentId),
            relationship,
          })),
        });
      }
      return parent.id;
    });
    return exports.getParentById(schoolId, parentId);
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.updateParent = async (schoolId, id, payload) => {
  if (!UUID_PATTERN.test(id)) return null;
  try {
    const exists = await prisma.user.findFirst({
      where: parentWhere(schoolId, id),
      select: { id: true },
    });
    if (!exists) return null;

    await prisma.$transaction(async (transaction) => {
      if (payload.email !== undefined) {
        await ensureEmailAvailable(transaction, payload.email, id);
      }
      const data = {};
      for (const field of ["firstName", "lastName", "email", "phone"]) {
        if (payload[field] !== undefined) {
          data[field] = field === "phone" ? payload[field] || null : payload[field];
        }
      }
      if (Object.keys(data).length) {
        await transaction.user.update({
          where: { id },
          data,
          select: { id: true },
        });
      }
      if (payload.students !== undefined) {
        await replaceStudentLinks(
          transaction,
          schoolId,
          id,
          payload.students,
        );
      }
    });

    return exports.getParentById(schoolId, id);
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.setParentStatus = async (schoolId, id, isActive) => {
  if (!UUID_PATTERN.test(id)) return null;
  const existing = await prisma.user.findFirst({
    where: parentWhere(schoolId, id),
    select: { id: true },
  });
  if (!existing) return null;
  await prisma.user.update({
    where: { id },
    data: { isActive },
    select: { id: true },
  });
  return exports.getParentById(schoolId, id);
};

exports.replaceParentStudents = async (schoolId, id, students) => {
  if (!UUID_PATTERN.test(id)) return null;
  const existing = await prisma.user.findFirst({
    where: parentWhere(schoolId, id),
    select: { id: true },
  });
  if (!existing) return null;
  try {
    await prisma.$transaction((transaction) =>
      replaceStudentLinks(transaction, schoolId, id, students),
    );
    return exports.getParentById(schoolId, id);
  } catch (error) {
    rethrowKnown(error);
  }
};