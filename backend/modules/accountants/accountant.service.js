const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");
const { hashPassword } = require("../users/user.helpers");

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ACCOUNTANT_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  phone: true,
  isActive: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
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

const buildWhere = (schoolId, filters = {}) => {
  const where = { schoolId, role: "accountant" };
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

const rethrowKnown = (error) => {
  if (error instanceof AppError) throw error;
  if (error?.code === "P2002") {
    throw new AppError("An account with this email already exists", 409);
  }
  throw error;
};

const ensureEmailAvailable = async (email, excludeId) => {
  const existing = await prisma.user.findFirst({
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

exports.listAccountants = async (schoolId, filters = {}) => {
  const { page, limit, skip } = parsePage(filters);
  const where = buildWhere(schoolId, filters);
  const [accountants, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: ACCOUNTANT_SELECT,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: accountants,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

exports.getAccountantById = (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;

  return prisma.user.findFirst({
    where: { id, schoolId, role: "accountant" },
    select: ACCOUNTANT_SELECT,
  });
};

exports.getAccountantOverview = async (schoolId) => {
  const where = { schoolId, role: "accountant" };
  const [totalAccountants, activeAccountants] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.count({ where: { ...where, isActive: true } }),
  ]);

  return {
    totalAccountants,
    activeAccountants,
    inactiveAccountants: totalAccountants - activeAccountants,
  };
};

exports.createAccountant = async (schoolId, payload) => {
  try {
    await ensureEmailAvailable(payload.email);
    const passwordHash = await hashPassword(payload.password);

    return await prisma.user.create({
      data: {
        schoolId,
        role: "accountant",
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone || null,
        passwordHash,
        isActive: payload.isActive ?? true,
      },
      select: ACCOUNTANT_SELECT,
    });
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.updateAccountant = async (schoolId, id, payload) => {
  if (!UUID_PATTERN.test(id)) return null;

  const existing = await prisma.user.findFirst({
    where: { id, schoolId, role: "accountant" },
    select: { id: true },
  });
  if (!existing) return null;

  try {
    const data = {};
    for (const field of ["firstName", "lastName", "phone"]) {
      if (payload[field] !== undefined) data[field] = payload[field] || null;
    }
    if (payload.email !== undefined) {
      await ensureEmailAvailable(payload.email, id);
      data.email = payload.email;
    }
    if (payload.password) data.passwordHash = await hashPassword(payload.password);

    return await prisma.user.update({
      where: { id },
      data,
      select: ACCOUNTANT_SELECT,
    });
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.setAccountantStatus = async (schoolId, id, isActive) => {
  if (!UUID_PATTERN.test(id)) return null;

  const existing = await prisma.user.findFirst({
    where: { id, schoolId, role: "accountant" },
    select: { id: true },
  });
  if (!existing) return null;

  return prisma.user.update({
    where: { id },
    data: { isActive },
    select: ACCOUNTANT_SELECT,
  });
};
