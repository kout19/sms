const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");
const { hashPassword } = require("../users/user.helpers");
const {
  STUDENT_SELECT,
  STUDENT_LIST_SELECT,
  CLASS_SELECT,
} = require("./student.constants");
const { validateImportRow } = require("./student.validation");

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

const profileData = (payload) => {
  const data = {
    admissionNo: emptyToNull(payload.admissionNo),
    dateOfBirth: optionalDate(payload.dateOfBirth),
    gender: emptyToNull(payload.gender),
    enrollmentDate: optionalDate(payload.enrollmentDate),
    classId: emptyToNull(payload.classId),
    previousSchool: emptyToNull(payload.previousSchool),
    medicalNotes: emptyToNull(payload.medicalNotes),
    address: emptyToNull(payload.address),
    guardianName: emptyToNull(payload.guardianName),
    guardianPhone: emptyToNull(payload.guardianPhone),
    guardianEmail: emptyToNull(payload.guardianEmail),
  };

  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );
};

const rethrowKnown = (error) => {
  if (error instanceof AppError) throw error;
  if (error?.code === "P2002") {
    const target = Array.isArray(error.meta?.target)
      ? error.meta.target.join(", ")
      : "value";
    throw new AppError(`A record with this ${target} already exists`, 409);
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

const normalizeSearch = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 100);

const textContains = (value) => ({
  contains: value,
  mode: "insensitive",
});

const buildStudentWhere = (schoolId, filters) => {
  const where = { role: "student", schoolId };
  const search = normalizeSearch(filters.search);

  if (search) {
    const matches = [
      { firstName: textContains(search) },
      { lastName: textContains(search) },
      { email: textContains(search) },
      {
        studentProfile: {
          admissionNo: textContains(search),
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
    where.studentProfile = {
      ...(where.studentProfile || {}),
      classId: filters.classId,
    };
  }

  if (typeof filters.isActive === "boolean") {
    where.isActive = filters.isActive;
  }

  return where;
};

const assertClassInSchool = async (schoolId, classId, excludeUserId) => {
  if (!classId) return;

  const schoolClass = await prisma.class.findFirst({
    where: { id: classId, schoolId },
    select: { id: true, capacity: true },
  });

  if (!schoolClass) {
    throw new AppError("Selected class does not belong to this school", 400);
  }

  if (schoolClass.capacity == null) return;

  const enrolled = await prisma.studentProfile.count({
    where: {
      classId,
      ...(excludeUserId ? { userId: { not: excludeUserId } } : {}),
    },
  });

  if (enrolled >= schoolClass.capacity) {
    throw new AppError("The selected class is already at capacity", 400);
  }
};

const classLabel = (schoolClass) => {
  if (!schoolClass) return "Unassigned";
  return `${schoolClass.grade} ${schoolClass.section} (${schoolClass.academicYear})`;
};

const placementKey = (grade, section, academicYear) =>
  `${grade}\u0000${section}\u0000${academicYear}`;

exports.listClassesForSchool = (schoolId) =>
  prisma.class.findMany({
    where: { schoolId },
    select: CLASS_SELECT,
    orderBy: [{ academicYear: "desc" }, { grade: "asc" }, { section: "asc" }],
  });

exports.listStudents = async (schoolId, filters = {}) => {
  if (filters.classId && !UUID_PATTERN.test(filters.classId)) {
    throw new AppError("Class filter is not valid", 400);
  }

  const { page, limit, skip } = parsePage(filters);
  const where = buildStudentWhere(schoolId, filters);

  const [students, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: STUDENT_LIST_SELECT,
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
    },
  };
};

exports.getStudentById = (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;
  return prisma.user.findFirst({
    where: { id, schoolId, role: "student" },
    select: STUDENT_SELECT,
  });
};

const createData = (schoolId, payload, passwordHash) => ({
  schoolId,
  role: "student",
  firstName: payload.firstName,
  lastName: payload.lastName,
  email: payload.email,
  phone: emptyToNull(payload.phone) ?? null,
  passwordHash,
  isActive: payload.isActive ?? true,
  studentProfile: {
    create: profileData(payload),
  },
});

exports.createStudent = async (schoolId, payload) => {
  try {
    await assertClassInSchool(schoolId, emptyToNull(payload.classId));
    const passwordHash = await hashPassword(payload.password);
    return await prisma.user.create({
      data: createData(schoolId, payload, passwordHash),
      select: STUDENT_SELECT,
    });
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.updateStudent = async (schoolId, id, payload) => {
  if (!UUID_PATTERN.test(id)) return null;

  const existing = await prisma.user.findFirst({
    where: { id, schoolId, role: "student" },
    select: { id: true },
  });
  if (!existing) return null;

  try {
    if (payload.classId !== undefined) {
      await assertClassInSchool(schoolId, emptyToNull(payload.classId), id);
    }

    const data = {};
    ["firstName", "lastName", "email", "isActive"].forEach((field) => {
      if (payload[field] !== undefined) data[field] = payload[field];
    });
    if (payload.phone !== undefined) data.phone = emptyToNull(payload.phone);
    if (payload.password) data.passwordHash = await hashPassword(payload.password);

    const profile = profileData(payload);
    if (Object.keys(profile).length) {
      data.studentProfile = {
        upsert: {
          create: profile,
          update: profile,
        },
      };
    }

    return await prisma.user.update({
      where: { id },
      data,
      select: STUDENT_SELECT,
    });
  } catch (error) {
    rethrowKnown(error);
  }
};

exports.deactivateStudent = async (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;

  const existing = await prisma.user.findFirst({
    where: { id, schoolId, role: "student" },
    select: { id: true },
  });
  if (!existing) return null;

  return prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: STUDENT_SELECT,
  });
};

exports.toggleStudentStatus = async (schoolId, id) => {
  if (!UUID_PATTERN.test(id)) return null;

  const student = await prisma.user.findFirst({
    where: { id, schoolId, role: "student" },
    select: { id: true, isActive: true },
  });
  if (!student) return null;

  return prisma.user.update({
    where: { id },
    data: { isActive: !student.isActive },
    select: STUDENT_SELECT,
  });
};

const classifyRows = async (schoolId, rawRows) => {
  const classes = await prisma.class.findMany({
    where: { schoolId },
    select: { ...CLASS_SELECT },
  });
  const classByPlacement = new Map(
    classes.map((schoolClass) => [
      placementKey(schoolClass.grade, schoolClass.section, schoolClass.academicYear),
      schoolClass,
    ]),
  );

  const enrollmentCounts = await prisma.studentProfile.groupBy({
    by: ["classId"],
    where: { classId: { not: null }, class: { schoolId } },
    _count: { _all: true },
  });
  const enrolledByClass = new Map(
    enrollmentCounts.map((row) => [row.classId, row._count._all]),
  );

  const emails = rawRows
    .map((row) => String(row.email || "").trim().toLowerCase())
    .filter(Boolean);
  const admissionNumbers = rawRows
    .map((row) => String(row.admissionNo || "").trim())
    .filter(Boolean);

  const [existingUsers, existingAdmissions] = await Promise.all([
    emails.length
      ? prisma.user.findMany({
          where: { email: { in: [...new Set(emails)] } },
          select: { email: true },
        })
      : [],
    admissionNumbers.length
      ? prisma.studentProfile.findMany({
          where: { admissionNo: { in: [...new Set(admissionNumbers)] } },
          select: { admissionNo: true },
        })
      : [],
  ]);

  const existingEmails = new Set(
    existingUsers.map((user) => user.email.toLowerCase()),
  );
  const existingAdmissionNos = new Set(
    existingAdmissions.map((profile) => profile.admissionNo),
  );
  const seenEmails = new Set();
  const seenAdmissionNos = new Set();
  const reservedSeats = new Map();

  const preview = [];
  const accepted = [];

  rawRows.forEach((raw) => {
    const messages = [];
    if (raw.formulaError) messages.push(raw.formulaError);

    const fields = { ...raw };
    delete fields.rowNumber;
    delete fields.formulaError;
    const { error, value } = validateImportRow(fields);
    if (error) {
      error.details.forEach((detail) => {
        messages.push(detail.message.replaceAll('"', ""));
      });
    }

    const grade = value?.grade || "";
    const section = value?.section || "";
    const academicYear = value?.academicYear || "";
    const placementProvided = Boolean(grade || section || academicYear);
    let matchedClass = null;

    if (!error && placementProvided && !(grade && section && academicYear)) {
      messages.push(
        "Grade, section, and academic year must all be provided together",
      );
    }

    if (!error && grade && section && academicYear) {
      matchedClass = classByPlacement.get(
        placementKey(grade, section, academicYear),
      );
      if (!matchedClass) {
        messages.push(
          "No class in this school matches this grade, section, and academic year",
        );
      }
    }

    const email = (value?.email || raw.email || "").toLowerCase();
    const admissionNo = value?.admissionNo || null;
    let status = "valid";

    if (messages.length) {
      status = "invalid";
    } else if (
      (email && (seenEmails.has(email) || existingEmails.has(email))) ||
      (admissionNo &&
        (seenAdmissionNos.has(admissionNo) ||
          existingAdmissionNos.has(admissionNo)))
    ) {
      status = "duplicate";
      messages.push(
        "This email or admission number is already used in the file or in the school records",
      );
    } else if (matchedClass?.capacity != null) {
      const used = reservedSeats.get(matchedClass.id) || 0;
      const enrolled = enrolledByClass.get(matchedClass.id) || 0;
      if (enrolled + used + 1 > matchedClass.capacity) {
        status = "invalid";
        messages.push("The class is at capacity");
      } else {
        reservedSeats.set(matchedClass.id, used + 1);
      }
    }

    if (status === "valid") {
      if (email) seenEmails.add(email);
      if (admissionNo) seenAdmissionNos.add(admissionNo);
      accepted.push({
        ...value,
        classId: matchedClass?.id || null,
        rowNumber: raw.rowNumber,
      });
    }

    preview.push({
      row: raw.rowNumber,
      firstName: value?.firstName || raw.firstName || "",
      lastName: value?.lastName || raw.lastName || "",
      email: email || raw.email || "",
      admissionNo: admissionNo || raw.admissionNo || "",
      classLabel: classLabel(matchedClass),
      status,
      messages,
    });
  });

  return { preview, accepted };
};

const summarize = (preview, imported, persisted) => {
  const failed = preview.filter((row) => row.status === "invalid").length;
  const skippedDuplicates = preview.filter(
    (row) => row.status === "duplicate",
  ).length;
  const validRows = preview.filter((row) => row.status === "valid").length;

  return {
    totalRows: preview.length,
    validRows,
    imported,
    failed,
    skippedDuplicates,
    persisted,
    errors: preview
      .filter((row) => row.status !== "valid")
      .map((row) => ({ row: row.row, messages: row.messages })),
    preview,
    message: persisted
      ? `Imported ${imported} students. ${failed} invalid rows and ${skippedDuplicates} duplicates were not saved.`
      : `Preview ready. ${validRows} rows can be imported. ${failed} invalid rows and ${skippedDuplicates} duplicates will not be saved.`,
  };
};

exports.previewImport = async (schoolId, rawRows) => {
  const { preview } = await classifyRows(schoolId, rawRows);
  return summarize(preview, 0, false);
};

exports.commitImport = async (schoolId, rawRows) => {
  const { preview, accepted } = await classifyRows(schoolId, rawRows);
  if (!accepted.length) {
    return summarize(preview, 0, false);
  }

  const prepared = [];
  for (const row of accepted) {
    prepared.push({
      row,
      passwordHash: await hashPassword(row.password),
    });
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        for (const item of prepared) {
          await tx.user.create({
            data: createData(
              schoolId,
              { ...item.row, isActive: true },
              item.passwordHash,
            ),
          });
        }
      },
      { timeout: 30000, maxWait: 5000 },
    );
  } catch (error) {
    if (error?.code === "P2002") {
      throw new AppError(
        "Import stopped because a record conflicted with existing data. No students from the valid rows were saved.",
        409,
      );
    }
    throw error;
  }

  return summarize(preview, prepared.length, true);
};
