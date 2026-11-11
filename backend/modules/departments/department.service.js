const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 200);

const emptyToNull = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  return typeof value === "string" ? value.trim() : value;
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

const normalizeDepartment = (department) => {
  const headTeacher = department.headTeacher
    ? {
        id: department.headTeacher.id,
        firstName: department.headTeacher.firstName,
        lastName: department.headTeacher.lastName,
        email: department.headTeacher.email,
        role: department.headTeacher.role,
      }
    : null;

  return {
    id: department.id,
    schoolId: department.schoolId,
    name: department.name,
    code: department.code,
    description: department.description ?? "",
    icon: department.icon ?? "book-open",
    isActive: department.isActive,
    headTeacherId: department.headTeacherId ?? headTeacher?.id ?? null,
    headTeacher,
    head: headTeacher
      ? `${headTeacher.firstName} ${headTeacher.lastName}`.trim()
      : null,
    teacherCount: department.teacherProfiles?.length ?? 0,
    studentCount: 0,
    subjects: [],
    createdAt: department.createdAt,
    updatedAt: department.updatedAt,
  };
};

const rethrowKnown = (error) => {
  if (error instanceof AppError) throw error;
  if (error?.code === "P2002") {
    throw new AppError(
      "A department with this name or code already exists",
      409,
    );
  }
  throw error;
};

const departmentSelect = {
  id: true,
  schoolId: true,
  name: true,
  code: true,
  description: true,
  icon: true,
  isActive: true,
  headTeacherId: true,
  headTeacher: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
  },
  teacherProfiles: {
    select: {
      id: true,
      userId: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};

const validateHeadTeacher = async (schoolId, headTeacherId) => {
  if (!headTeacherId) return null;

  const teacher = await prisma.user.findFirst({
    where: {
      id: headTeacherId,
      schoolId,
      isActive: true,
      role: { in: ["teacher", "department_head"] },
    },
    select: { id: true },
  });

  if (!teacher) {
    throw new AppError(
      "Selected department head is not active in this school",
      400,
    );
  }

  return teacher.id;
};

exports.listDepartments = async (schoolId, filters = {}) => {
  const { page, limit, skip } = parsePage(filters);
  const search = normalizeText(filters.search).toLowerCase();

  const where = { schoolId };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      {
        headTeacher: {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
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

  const [departments, total] = await Promise.all([
    prisma.department.findMany({
      where,
      include: {
        headTeacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        teacherProfiles: {
          select: { id: true },
        },
      },
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
      skip,
      take: limit,
    }),
    prisma.department.count({ where }),
  ]);

  return {
    data: departments.map(normalizeDepartment),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

exports.getDepartmentById = async (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;

  const department = await prisma.department.findFirst({
    where: { id, schoolId },
    include: {
      headTeacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      teacherProfiles: {
        select: {
          id: true,
          userId: true,
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
  });

  return department ? normalizeDepartment(department) : null;
};

exports.listHeadTeachers = async (schoolId) =>
  prisma.user.findMany({
    where: {
      schoolId,
      isActive: true,
      role: { in: ["teacher", "department_head"] },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      teacherProfile: {
        select: {
          id: true,
          departmentId: true,
        },
      },
    },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });

exports.createDepartment = async (schoolId, payload) => {
  const name = normalizeText(payload.name);
  const code = normalizeText(payload.code).toUpperCase();
  const description = emptyToNull(payload.description);
  const icon = emptyToNull(payload.icon) ?? "book-open";
  const headTeacherId = payload.headTeacherId
    ? await validateHeadTeacher(schoolId, payload.headTeacherId)
    : null;

  try {
    const department = await prisma.department.create({
      data: {
        schoolId,
        name,
        code,
        description,
        icon,
        isActive: payload.isActive ?? true,
        headTeacherId,
      },
      include: {
        headTeacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        teacherProfiles: { select: { id: true } },
      },
    });

    if (headTeacherId) {
      await prisma.teacherProfile.upsert({
        where: { userId: headTeacherId },
        update: { departmentId: department.id },
        create: {
          userId: headTeacherId,
          schoolId,
          departmentId: department.id,
        },
      });
    }

    return normalizeDepartment(department);
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.updateDepartment = async (schoolId, id, payload) => {
  if (!UUID_PATTERN.test(id)) return null;

  const existing = await prisma.department.findFirst({
    where: { id, schoolId },
    select: { id: true, headTeacherId: true },
  });
  if (!existing) return null;

  const data = {};
  if (payload.name !== undefined) data.name = normalizeText(payload.name);
  if (payload.code !== undefined)
    data.code = normalizeText(payload.code).toUpperCase();
  if (payload.description !== undefined)
    data.description = emptyToNull(payload.description);
  if (payload.icon !== undefined)
    data.icon = emptyToNull(payload.icon) ?? "book-open";
  if (payload.isActive !== undefined) data.isActive = payload.isActive;

  if (payload.headTeacherId !== undefined) {
    data.headTeacherId = payload.headTeacherId
      ? await validateHeadTeacher(schoolId, payload.headTeacherId)
      : null;
  }

  try {
    const updated = await prisma.department.update({
      where: { id },
      data,
      include: {
        headTeacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        teacherProfiles: { select: { id: true } },
      },
    });

    if (data.headTeacherId) {
      await prisma.teacherProfile.upsert({
        where: { userId: data.headTeacherId },
        update: { departmentId: id },
        create: {
          userId: data.headTeacherId,
          schoolId,
          departmentId: id,
        },
      });
    }

    return normalizeDepartment(updated);
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.deactivateDepartment = async (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;

  const existing = await prisma.department.findFirst({
    where: { id, schoolId },
    select: { id: true },
  });
  if (!existing) return null;

  return prisma.department
    .update({
      where: { id },
      data: { isActive: false },
      include: {
        headTeacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        teacherProfiles: { select: { id: true } },
      },
    })
    .then(normalizeDepartment);
};

exports.toggleDepartmentStatus = async (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;

  const department = await prisma.department.findFirst({
    where: { id, schoolId },
    select: { id: true, isActive: true },
  });
  if (!department) return null;

  return prisma.department
    .update({
      where: { id },
      data: { isActive: !department.isActive },
      include: {
        headTeacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        teacherProfiles: { select: { id: true } },
      },
    })
    .then(normalizeDepartment);
};
