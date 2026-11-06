const prisma = require("../../config/prisma");
const { hashPassword } = require("../users/user.helpers");
const { STUDENT_SELECT } = require("./student.constants");


const buildSchoolScope = (schoolId) => {
  if (!schoolId) return {};
  return { schoolId };
};

const getStudentProfilePayload = (data = {}) => ({
  gradeLevel: data.gradeLevel ?? null,
  section: data.section ?? null,
  admissionNumber: data.admissionNumber ?? null,
  rollNumber: data.rollNumber ?? null,
  guardianName: data.guardianName ?? null,
  guardianPhone: data.guardianPhone ?? null,
  dateOfBirth: data.dateOfBirth ?? null,
});

const buildStudentWhere = (schoolId, filters = {}) => {
  const where = {
    role: "student",
    ...buildSchoolScope(schoolId),
  };

  const q = (filters.search || "").trim();
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  if (filters.gradeLevel) {
    where.studentProfile = { gradeLevel: { equals: filters.gradeLevel, mode: "insensitive" } };
  }

  if (typeof filters.isActive === "boolean") {
    where.isActive = filters.isActive;
  }

  return where;
};

exports.listStudents = async (schoolId, filters = {}) => {
  const page =Math.max(1, Number(filters.page || 1));
  const limit =Math.min(1, Number(filters.limit || 20));
  const skip = (page - 1) * limit;
  const where = buildStudentWhere(schoolId, filters);

  const [students, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: STUDENT_SELECT,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: students,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      filters,
    },
  };
};

exports.getStudentById = (schoolId, id) => {
  return prisma.user.findFirst({
    where: {
      id,
      role: "student",
      ...buildSchoolScope(schoolId),
    },
    select: STUDENT_SELECT,
  });
};

exports.createStudent = async (schoolId, payload) => {
  const password = payload.password || "Student123!";
  const passwordHash = payload.passwordHash || (await hashPassword(password));

  return prisma.user.create({
    data: {
      schoolId,
      role: "student",
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone || null,
      passwordHash,
      isActive: payload.isActive ?? true,
      studentProfile: {
        create: getStudentProfilePayload(payload),
      },
    },
    select: STUDENT_SELECT,
  });
};

exports.updateStudent = async (schoolId, id, payload) => {
  const existing = await prisma.user.findFirst({
    where: {
      id,
      role: "student",
      ...buildSchoolScope(schoolId),
    },
    select: { id: true },
  });

  if (!existing) return null;

  const data = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    isActive: payload.isActive,
    ...(payload.password
      ? { passwordHash: await hashPassword(payload.password) }
      : {}),
    studentProfile: {
      upsert: {
        create: getStudentProfilePayload(payload),
        update: getStudentProfilePayload(payload),
      },
    },
  };

  return prisma.user.update({
    where: { id },
    data,
    select: STUDENT_SELECT,
  });
};

exports.deleteStudent = async (schoolId, id) => {
  const existing = await prisma.user.findFirst({
    where: {
      id,
      role: "student",
      ...buildSchoolScope(schoolId),
    },
    select: { id: true, isActive: true },
  });

  if (!existing) return null;

  return prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: STUDENT_SELECT,
  });
};

exports.toggleStudentStatus = async (schoolId, id) => {
  const student = await prisma.user.findFirst({
    where: {
      id,
      role: "student",
      ...buildSchoolScope(schoolId),
    },
    select: { id: true, isActive: true },
  });

  if (!student) return null;

  return prisma.user.update({
    where: { id },
    data: { isActive: !student.isActive },
    select: STUDENT_SELECT,
  });
};
