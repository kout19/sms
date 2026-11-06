const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");
const { hashPassword } = require("../users/user.helpers");
const { CLASS_BRIEF_SELECT, TEACHER_SELECT } = require("./teacher.constants");

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const emptyToNull = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  return typeof value === "string" ? value.trim() : value;
};

const optionalDate = (value) => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return value instanceof Date ? value : new Date(value);
};

const normalizeSearch = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 100);

const textContains = (value) => ({
  contains: value,
  mode: "insensitive",
});

const rethrowKnown = (error) => {
  if (error instanceof AppError) throw error;
  if (error?.code === "P2002") {
    const target = Array.isArray(error.meta?.target)
      ? error.meta.target.join(", ")
      : "";
    if (target.includes("employeeId")) {
      throw new AppError("A teacher with this employee ID already exists", 409);
    }
    if (target.includes("email")) {
      throw new AppError("A user with this email already exists", 409);
    }
    throw new AppError("A record with this value already exists", 409);
  }
  throw error;
};

const parsePage = (filters) => {
  const pageNumber = Number(filters.page);
  const limitNumber = Number(filters.limit);
  const page = Number.isFinite(pageNumber)
    ? Math.max(1, Math.trunc(pageNumber))
    : 1;
  const limit = Number.isFinite(limitNumber)
    ? Math.min(100, Math.max(1, Math.trunc(limitNumber)))
    : 20;
  return { page, limit, skip: (page - 1) * limit };
};

const buildTeacherWhere = (schoolId, filters) => {
  const where = { role: "teacher", schoolId };
  const search = normalizeSearch(filters.search);

  if (search) {
    const matches = [
      { firstName: textContains(search) },
      { lastName: textContains(search) },
      { email: textContains(search) },
      { phone: textContains(search) },
      {
        teacherProfile: {
          employeeId: textContains(search),
        },
      },
    ];
    const parts = search.split(" ");
    if (parts.length > 1) {
      matches.push({
        AND: [
          { firstName: textContains(parts[0]) },
          { lastName: textContains(parts.slice(1).join(" ")) },
        ],
      });
      matches.push({
        AND: [
          { firstName: textContains(parts.slice(0, -1).join(" ")) },
          { lastName: textContains(parts[parts.length - 1]) },
        ],
      });
    }
    where.OR = matches;
  }

  if (filters.classId) {
    where.homeroomClasses = {
      some: { id: filters.classId, schoolId },
    };
  }

  if (typeof filters.isActive === "boolean") {
    where.isActive = filters.isActive;
  }

  return where;
};

const profileData = (schoolId, payload) => {
  const data = {
    schoolId,
    employeeId: emptyToNull(payload.employeeId),
    qualifications: emptyToNull(payload.qualifications),
    hireDate: optionalDate(payload.hireDate),
  };

  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );
};

const assertEmployeeIdAvailable = async (schoolId, employeeId, excludeUserId) => {
  if (!employeeId) return;

  const duplicate = await prisma.teacherProfile.findFirst({
    where: {
      schoolId,
      employeeId: { equals: employeeId, mode: "insensitive" },
      ...(excludeUserId ? { userId: { not: excludeUserId } } : {}),
    },
    select: { id: true },
  });

  if (duplicate) {
    throw new AppError("A teacher with this employee ID already exists", 409);
  }
};

exports.listClassesForSchool = (schoolId) =>
  prisma.class.findMany({
    where: { schoolId },
    select: CLASS_BRIEF_SELECT,
    orderBy: [{ academicYear: "desc" }, { grade: "asc" }, { section: "asc" }],
  });

exports.listTeachers = async (schoolId, filters = {}) => {
  if (filters.classId && !UUID_PATTERN.test(filters.classId)) {
    throw new AppError("Class filter is not valid", 400);
  }

  const { page, limit, skip } = parsePage(filters);
  const where = buildTeacherWhere(schoolId, filters);
  const [teachers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: TEACHER_SELECT,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: teachers,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

exports.getTeacherById = (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;
  return prisma.user.findFirst({
    where: { id, schoolId, role: "teacher" },
    select: TEACHER_SELECT,
  });
};

exports.createTeacher = async (schoolId, payload) => {
  const employeeId = emptyToNull(payload.employeeId);
  try {
    await assertEmployeeIdAvailable(schoolId, employeeId);
    const passwordHash = await hashPassword(payload.password);
    return await prisma.user.create({
      data: {
        schoolId,
        role: "teacher",
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: emptyToNull(payload.phone) ?? null,
        passwordHash,
        isActive: payload.isActive ?? true,
        teacherProfile: {
          create: profileData(schoolId, payload),
        },
      },
      select: TEACHER_SELECT,
    });
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.updateTeacher = async (schoolId, id, payload) => {
  if (!UUID_PATTERN.test(id)) return null;

  const existing = await prisma.user.findFirst({
    where: { id, schoolId, role: "teacher" },
    select: { id: true },
  });
  if (!existing) return null;

  try {
    if (payload.employeeId !== undefined) {
      await assertEmployeeIdAvailable(
        schoolId,
        emptyToNull(payload.employeeId),
        id,
      );
    }

    const data = {};
    ["firstName", "lastName", "email", "isActive"].forEach((field) => {
      if (payload[field] !== undefined) data[field] = payload[field];
    });
    if (payload.phone !== undefined) data.phone = emptyToNull(payload.phone);
    if (payload.password) data.passwordHash = await hashPassword(payload.password);

    const profile = profileData(schoolId, payload);
    const profileFields = Object.keys(profile).filter((key) => key !== "schoolId");
    if (profileFields.length) {
      data.teacherProfile = {
        upsert: {
          update: profile,
          create: profile,
        },
      };
    }

    return await prisma.user.update({
      where: { id },
      data,
      select: TEACHER_SELECT,
    });
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.deactivateTeacher = async (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;

  const existing = await prisma.user.findFirst({
    where: { id, schoolId, role: "teacher" },
    select: { id: true },
  });
  if (!existing) return null;

  return prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: TEACHER_SELECT,
  });
};

exports.toggleTeacherStatus = async (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;

  const teacher = await prisma.user.findFirst({
    where: { id, schoolId, role: "teacher" },
    select: { id: true, isActive: true },
  });
  if (!teacher) return null;

  return prisma.user.update({
    where: { id },
    data: { isActive: !teacher.isActive },
    select: TEACHER_SELECT,
  });
};
