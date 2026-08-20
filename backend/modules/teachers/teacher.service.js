// backend/modules/teachers/teacher.service.js
const prisma = require("../../config/prisma");

const TEACHER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  isActive: true,
  createdAt: true,
  teacherProfile: {
    select: {
      departmentId: true,
      hireDate: true,
      qualifications: true,
      employeeId: true,
    },
  },
};

exports.listTeachers = (schoolId) => {
  return prisma.user.findMany({
    where: { schoolId, role: "teacher" },
    select: TEACHER_SELECT,
    orderBy: { createdAt: "desc" },
  });
};

exports.getTeacherById = (schoolId, id) => {
  return prisma.user.findFirst({
    where: { id, schoolId, role: "teacher" }, // schoolId here is what blocks cross-tenant reads
    select: TEACHER_SELECT,
  });
};

exports.createTeacher = (schoolId, data) => {
  // Single atomic write - User and TeacherProfile created together.
  // If TeacherProfile creation fails, the User row is rolled back too -
  // you never end up with a "teacher" user that has no profile.
  return prisma.user.create({
    data: {
      schoolId,
      role: "teacher",
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      passwordHash: data.passwordHash, // set by your invite/onboarding flow
      teacherProfile: {
        create: {
          departmentId: data.departmentId ?? null,
          hireDate: data.hireDate ?? null,
          qualifications: data.qualifications ?? null,
          employeeId: data.employeeId ?? null,
        },
      },
    },
    select: TEACHER_SELECT,
  });
};

exports.updateTeacher = async (schoolId, id, data) => {
  // updateMany can't do nested-relation writes (TeacherProfile fields), so
  // the tenant check happens as an explicit findFirst FIRST - if it returns
  // null, we stop before touching anything. Only once ownership is confirmed
  // do we call update() by bare id, which is safe at that point because we
  // already proved this teacher belongs to this school.
  const existing = await prisma.user.findFirst({
    where: { id, schoolId, role: "teacher" },
    select: { id: true },
  });
  if (!existing) return null;

  return prisma.user.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      teacherProfile: {
        upsert: {
          update: {
            departmentId: data.departmentId,
            hireDate: data.hireDate,
            qualifications: data.qualifications,
            employeeId: data.employeeId,
          },
          create: {
            departmentId: data.departmentId ?? null,
            hireDate: data.hireDate ?? null,
            qualifications: data.qualifications ?? null,
            employeeId: data.employeeId ?? null,
          },
        },
      },
    },
    select: TEACHER_SELECT,
  });
};

exports.deleteTeacher = async (schoolId, id) => {
  // TeacherProfile has onDelete: Cascade, so deleting the User row
  // automatically deletes the linked TeacherProfile row - no separate delete needed.
  const result = await prisma.user.deleteMany({
    where: { id, schoolId, role: "teacher" },
  });
  return result.count > 0;
};

exports.toggleTeacherStatus = async (schoolId, id) => {
  const teacher = await prisma.user.findFirst({
    where: { id, schoolId, role: "teacher" },
    select: { id: true, isActive: true },
  });
  if (!teacher) return null;

  return prisma.user.update({
    where: { id }, // safe: ownership already confirmed above
    data: { isActive: !teacher.isActive },
    select: TEACHER_SELECT,
  });
};
