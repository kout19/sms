const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");

const sameIds = (left, right) => {
  const leftIds = [...new Set(left)].sort();
  const rightIds = [...new Set(right)].sort();
  return (
    leftIds.length === rightIds.length &&
    leftIds.every((id, index) => id === rightIds[index])
  );
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

const formatTeacher = (teacherProfile) => {
  const user = teacherProfile?.user;
  if (!user) return null;

  return {
    id: teacherProfile.id,
    userId: user.id,
    employeeId: teacherProfile.employeeId ?? null,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`.trim(),
  };
};

const normalizeSubject = (subject) => {
  const classes = (subject.classLinks || []).map(({ class: classItem }) => ({
    id: classItem.id,
    name: classItem.name,
    grade: classItem.grade,
    section: classItem.section,
    academicYear: classItem.academicYear,
  }));

  const teachers = (subject.teacherAssignments || [])
    .map(({ teacherProfile }) => formatTeacher(teacherProfile))
    .filter(Boolean);

  return {
    id: subject.id,
    schoolId: subject.schoolId,
    name: subject.name,
    code: subject.code,
    description: subject.description ?? "",
    academicYear: subject.academicYear ?? null,
    isActive: subject.isActive,
    departmentId: subject.departmentId ?? null,
    department: subject.department
      ? {
          id: subject.department.id,
          name: subject.department.name,
          code: subject.department.code,
        }
      : null,
    teachers,
    teacherCount: teachers.length,
    classes,
    classCount: classes.length,
    createdAt: subject.createdAt,
    updatedAt: subject.updatedAt,
  };
};

const rethrowKnown = (error) => {
  if (error instanceof AppError) throw error;
  if (error?.code === "P2002") {
    throw new AppError(
      "A subject with this name or code already exists in this school",
      409,
    );
  }
  throw error;
};

const buildSubjectInclude = () => ({
  department: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
  classLinks: {
    select: {
      id: true,
      academicYear: true,
      class: {
        select: {
          id: true,
          name: true,
          grade: true,
          section: true,
          academicYear: true,
        },
      },
    },
  },
  teacherAssignments: {
    select: {
      id: true,
      academicYear: true,
      isPrimary: true,
      teacherProfile: {
        select: {
          id: true,
          employeeId: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  },
});

const ensureSchoolReference = async ({
  schoolId,
  departmentId,
  classIds = [],
  teacherProfileIds = [],
}) => {
  if (departmentId) {
    const department = await prisma.department.findFirst({
      where: { id: departmentId, schoolId },
      select: { id: true },
    });

    if (!department) {
      throw new AppError("Selected department is not available in this school", 400);
    }
  }

  if (classIds.length) {
    const validClasses = await prisma.class.findMany({
      where: {
        id: { in: classIds },
        schoolId,
      },
      select: { id: true },
    });

    const validIds = new Set(validClasses.map((item) => item.id));
    const invalidIds = classIds.filter((id) => !validIds.has(id));
    if (invalidIds.length) {
      throw new AppError("One or more classes do not belong to this school", 400);
    }
  }

  if (teacherProfileIds.length) {
    const validTeachers = await prisma.teacherProfile.findMany({
      where: {
        id: { in: teacherProfileIds },
        schoolId,
      },
      select: { id: true },
    });

    const validIds = new Set(validTeachers.map((item) => item.id));
    const invalidIds = teacherProfileIds.filter((id) => !validIds.has(id));
    if (invalidIds.length) {
      throw new AppError("One or more teachers do not belong to this school", 400);
    }
  }
};

const toClassLinkData = (schoolId, subjectId, classIds, academicYear) =>
  [...new Set(classIds)].map((classId) => ({
    schoolId,
    subjectId,
    classId,
    academicYear: academicYear || null,
  }));

const toTeacherAssignmentData = (schoolId, teacherProfileIds, subjectId, academicYear) =>
  [...new Set(teacherProfileIds)].map((teacherProfileId) => ({
    schoolId,
    subjectId,
    teacherProfileId,
    academicYear: academicYear || null,
    isPrimary: false,
  }));

exports.listSubjects = async (schoolId, filters = {}) => {
  const { page, limit, skip } = parsePage(filters);
  const search = normalizeText(filters.search).toLowerCase();

  const where = { schoolId };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      {
        department: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { code: { contains: search, mode: "insensitive" } },
          ],
        },
      },
    ];
  }

  if (typeof filters.isActive === "boolean") {
    where.isActive = filters.isActive;
  }

  if (filters.status === "active") {
    where.isActive = true;
  }

  if (filters.status === "inactive") {
    where.isActive = false;
  }

  if (filters.departmentId) {
    where.departmentId = filters.departmentId;
  }

  if (filters.classId) {
    where.classLinks = { some: { classId: filters.classId } };
  }

  const academicYear = normalizeText(filters.academicYear);
  if (academicYear && academicYear.toLowerCase() !== "all") {
    where.academicYear = academicYear;
  }

  const [
    subjects,
    total,
    totalSubjects,
    activeSubjects,
    assignedSubjects,
    departments,
  ] =
    await Promise.all([
      prisma.subject.findMany({
        where,
        include: buildSubjectInclude(),
        orderBy: [{ isActive: "desc" }, { name: "asc" }],
        skip,
        take: limit,
      }),
      prisma.subject.count({ where }),
      prisma.subject.count({ where: { schoolId } }),
      prisma.subject.count({ where: { schoolId, isActive: true } }),
      prisma.subjectTeacherAssignment.findMany({
        where: { schoolId },
        select: { subjectId: true },
        distinct: ["subjectId"],
      }),
      prisma.subject.findMany({
        where: { schoolId, departmentId: { not: null } },
        select: { departmentId: true },
        distinct: ["departmentId"],
      }),
    ]);

  return {
    data: subjects.map(normalizeSubject),
    stats: {
      totalSubjects,
      activeSubjects,
      assignedSubjects: assignedSubjects.length,
      departments: departments.length,
    },
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

exports.listSubjectOptions = async (schoolId) => {
  const [departments, classes, teacherProfiles] = await Promise.all([
    prisma.department.findMany({
      where: { schoolId },
      select: { id: true, name: true, code: true, isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.class.findMany({
      where: { schoolId },
      select: {
        id: true,
        name: true,
        grade: true,
        section: true,
        academicYear: true,
      },
      orderBy: [{ academicYear: "desc" }, { grade: "asc" }, { section: "asc" }],
    }),
    prisma.teacherProfile.findMany({
      where: {
        schoolId,
        user: { is: { role: "teacher" } },
      },
      select: {
        id: true,
        employeeId: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            isActive: true,
          },
        },
      },
      orderBy: [{ user: { firstName: "asc" } }, { user: { lastName: "asc" } }],
    }),
  ]);

  return {
    departments,
    classes,
    teachers: teacherProfiles.map((profile) => ({
      id: profile.id,
      employeeId: profile.employeeId,
      firstName: profile.user.firstName,
      lastName: profile.user.lastName,
      email: profile.user.email,
      isActive: profile.user.isActive,
      fullName: `${profile.user.firstName} ${profile.user.lastName}`.trim(),
    })),
  };
};

exports.getSubjectById = async (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;

  const subject = await prisma.subject.findFirst({
    where: { id, schoolId },
    include: buildSubjectInclude(),
  });

  return subject ? normalizeSubject(subject) : null;
};

exports.createSubject = async (schoolId, payload = {}) => {
  const name = normalizeText(payload.name);
  const code = normalizeText(payload.code).toUpperCase();
  const description = payload.description == null ? null : normalizeText(payload.description);
  const academicYear = payload.academicYear == null ? null : normalizeText(payload.academicYear);
  const classIds = Array.isArray(payload.classIds) ? payload.classIds.filter(Boolean) : [];
  const teacherProfileIds = Array.isArray(payload.teacherProfileIds)
    ? payload.teacherProfileIds.filter(Boolean)
    : Array.isArray(payload.teacherIds)
      ? payload.teacherIds.filter(Boolean)
      : [];

  if (!name || !code) {
    throw new AppError("Subject name and code are required", 400);
  }

  await ensureSchoolReference({
    schoolId,
    departmentId: payload.departmentId ?? null,
    classIds,
    teacherProfileIds,
  });

  try {
    const subject = await prisma.$transaction(async (tx) => {
      const created = await tx.subject.create({
        data: {
          schoolId,
          name,
          code,
          departmentId: payload.departmentId || null,
          description,
          academicYear,
          isActive: payload.isActive !== false,
        },
      });

      if (classIds.length) {
        await tx.subjectClass.createMany({
          data: toClassLinkData(schoolId, created.id, classIds, academicYear),
        });
      }

      if (teacherProfileIds.length) {
        await tx.subjectTeacherAssignment.createMany({
          data: toTeacherAssignmentData(schoolId, teacherProfileIds, created.id, academicYear),
        });
      }

      return tx.subject.findUnique({
        where: { id: created.id },
        include: buildSubjectInclude(),
      });
    });

    return subject ? normalizeSubject(subject) : null;
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.updateSubject = async (schoolId, id, payload = {}) => {
  if (!UUID_PATTERN.test(id)) return null;

  const existing = await prisma.subject.findFirst({
    where: { id, schoolId },
    select: { id: true, classLinks: { select: { classId: true } }, teacherAssignments: { select: { teacherProfileId: true } } },
  });

  if (!existing) return null;

  const classIds = Array.isArray(payload.classIds)
    ? payload.classIds.filter(Boolean)
    : existing.classLinks.map((item) => item.classId);
  const teacherProfileIds = Array.isArray(payload.teacherProfileIds)
    ? payload.teacherProfileIds.filter(Boolean)
    : Array.isArray(payload.teacherIds)
      ? payload.teacherIds.filter(Boolean)
      : existing.teacherAssignments.map((item) => item.teacherProfileId);
  const replaceClassLinks =
    payload.classIds !== undefined &&
    !sameIds(
      classIds,
      existing.classLinks.map((item) => item.classId),
    );
  const replaceTeacherAssignments =
    (payload.teacherProfileIds !== undefined || payload.teacherIds !== undefined) &&
    !sameIds(
      teacherProfileIds,
      existing.teacherAssignments.map((item) => item.teacherProfileId),
    );

  await ensureSchoolReference({
    schoolId,
    departmentId: payload.departmentId ?? undefined,
    classIds,
    teacherProfileIds,
  });

  const updates = {};

  if (payload.name !== undefined) updates.name = normalizeText(payload.name);
  if (payload.code !== undefined) updates.code = normalizeText(payload.code).toUpperCase();
  if (payload.departmentId !== undefined) updates.departmentId = payload.departmentId || null;
  if (payload.description !== undefined) {
    updates.description = payload.description == null ? null : normalizeText(payload.description);
  }
  if (payload.academicYear !== undefined) {
    updates.academicYear = payload.academicYear == null ? null : normalizeText(payload.academicYear);
  }
  if (payload.isActive !== undefined) {
    updates.isActive = Boolean(payload.isActive);
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const subject = await tx.subject.update({
        where: { id, schoolId },
        data: updates,
      });

      if (replaceClassLinks) {
        await tx.subjectClass.deleteMany({ where: { subjectId: id, schoolId } });
        if (classIds.length) {
          await tx.subjectClass.createMany({
            data: toClassLinkData(schoolId, id, classIds, subject.academicYear || null),
          });
        }
      }

      if (replaceTeacherAssignments) {
        await tx.subjectTeacherAssignment.deleteMany({ where: { subjectId: id, schoolId } });
        if (teacherProfileIds.length) {
          await tx.subjectTeacherAssignment.createMany({
            data: toTeacherAssignmentData(schoolId, teacherProfileIds, id, subject.academicYear || null),
          });
        }
      }

      return tx.subject.findUnique({
        where: { id },
        include: buildSubjectInclude(),
      });
    });

    return updated ? normalizeSubject(updated) : null;
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.toggleSubjectStatus = async (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;

  const subject = await prisma.subject.findFirst({
    where: { id, schoolId },
    include: buildSubjectInclude(),
  });

  if (!subject) return null;

  const updated = await prisma.subject.update({
    where: { id },
    data: { isActive: !subject.isActive },
    include: buildSubjectInclude(),
  });

  return normalizeSubject(updated);
};

exports.deactivateSubject = async (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;

  const subject = await prisma.subject.findFirst({
    where: { id, schoolId },
    include: buildSubjectInclude(),
  });

  if (!subject) return null;

  const updated = await prisma.subject.update({
    where: { id },
    data: { isActive: false },
    include: buildSubjectInclude(),
  });

  return normalizeSubject(updated);
};
