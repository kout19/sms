const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");

const VALID_STATUSES = new Set(["present", "absent", "late", "excused"]);

const normalizeStatus = (status) => {
  const value = String(status ?? "").trim().toLowerCase();
  if (!VALID_STATUSES.has(value)) {
    throw new AppError("Attendance status must be present, absent, late, or excused", 400);
  }
  return value;
};

const buildStudentName = (user) => `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

const buildClassName = (section) => {
  if (!section) return "Unassigned";
  const className = section.class?.name || section.class?.code || "Class";
  const sectionName = section.name ? ` ${section.name}` : "";
  return `${className}${sectionName}`;
};

const buildRecordResponse = (record) => {
  const student = record.studentProfile?.user;
  const section = record.session?.section;
  return {
    id: record.id,
    sessionId: record.sessionId,
    studentId: record.studentProfileId,
    studentName: buildStudentName(student),
    studentCode: record.studentProfile?.admissionNo || student?.email || "N/A",
    className: buildClassName(section),
    status: record.status,
    remarks: record.remarks || null,
    checkIn: record.createdAt ? record.createdAt.toISOString().slice(11, 16) : null,
    date: record.session?.attendanceDate ? record.session.attendanceDate.toISOString().slice(0, 10) : null,
  };
};

const ensureSchoolScope = async (schoolId, sectionId, academicYearId) => {
  const section = await prisma.section.findFirst({
    where: { id: sectionId, schoolId, academicYearId, isActive: true },
    include: { class: true, academicYear: true },
  });

  if (!section) {
    throw new AppError("The selected class section is not available in this school", 404);
  }

  return section;
};

exports.getSummary = async (schoolId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalStudents, todayRecords, trend] = await Promise.all([
    prisma.enrollment.count({
      where: { schoolId, isActive: true, section: { isActive: true }, academicYear: { isActive: true } },
    }),
    prisma.attendanceRecord.groupBy({
      by: ["status"],
      where: {
        schoolId,
        session: { schoolId, attendanceDate: { gte: today, lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) } },
      },
      _count: { status: true },
    }),
    prisma.attendanceSession.findMany({
      where: { schoolId, attendanceDate: { gte: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) } },
      select: {
        attendanceDate: true,
        records: { select: { status: true } },
      },
      orderBy: { attendanceDate: "asc" },
    }),
  ]);

  const counters = { present: 0, absent: 0, late: 0, excused: 0 };
  for (const row of todayRecords) {
    if (row.status && counters[row.status] !== undefined) {
      counters[row.status] = row._count.status;
    }
  }

  const totalMarked = Object.values(counters).reduce((sum, value) => sum + value, 0);
  const attendanceRate = totalMarked > 0 ? Math.round(((counters.present + counters.late) / totalMarked) * 100) : 0;

  const lastSevenDays = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const target = date.toISOString().slice(0, 10);
    const allRows = trend.filter((row) => row.attendanceDate.toISOString().slice(0, 10) === target);
    if (!allRows.length) {
      lastSevenDays.push({ date: target, rate: 0, present: 0, absent: 0, late: 0, excused: 0 });
      continue;
    }
    const dayCounters = { present: 0, absent: 0, late: 0, excused: 0 };
    for (const session of allRows) {
      for (const record of session.records) {
        if (dayCounters[record.status] !== undefined) {
          dayCounters[record.status] += 1;
        }
      }
    }
    const dayTotal = Object.values(dayCounters).reduce((sum, value) => sum + value, 0);
    const dayRate = dayTotal > 0 ? Math.round(((dayCounters.present + dayCounters.late) / dayTotal) * 100) : 0;
    lastSevenDays.push({ date: target, rate: dayRate, ...dayCounters });
  }

  return {
    presentToday: counters.present,
    absentToday: counters.absent,
    lateArrivals: counters.late,
    excusedToday: counters.excused,
    totalStudents,
    attendanceRate,
    absentRate: totalMarked > 0 ? Math.round((counters.absent / totalMarked) * 100) : 0,
    trend: lastSevenDays,
  };
};

exports.getTodayBreakdown = async (schoolId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const rows = await prisma.attendanceRecord.groupBy({
    by: ["status"],
    where: {
      schoolId,
      session: { schoolId, attendanceDate: { gte: today, lt: end } },
    },
    _count: { status: true },
  });

  const counters = { present: 0, absent: 0, late: 0, excused: 0 };
  for (const row of rows) {
    if (counters[row.status] !== undefined) {
      counters[row.status] = row._count.status;
    }
  }

  return {
    present: counters.present,
    absent: counters.absent,
    late: counters.late,
    excused: counters.excused,
    total: Object.values(counters).reduce((sum, value) => sum + value, 0),
    byGrade: [],
  };
};

exports.getTrend = async (schoolId) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);

  const sessions = await prisma.attendanceSession.findMany({
    where: { schoolId, attendanceDate: { gte: start } },
    select: {
      attendanceDate: true,
      records: { select: { status: true } },
    },
    orderBy: { attendanceDate: "asc" },
  });

  const map = new Map();
  for (const session of sessions) {
    const day = session.attendanceDate.toISOString().slice(0, 10);
    const counters = map.get(day) || { present: 0, absent: 0, late: 0, excused: 0, total: 0 };
    for (const record of session.records) {
      if (counters[record.status] !== undefined) {
        counters[record.status] += 1;
      }
      counters.total += 1;
    }
    map.set(day, counters);
  }

  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    const counters = map.get(key) || { present: 0, absent: 0, late: 0, excused: 0, total: 0 };
    const rate = counters.total > 0 ? Math.round(((counters.present + counters.late) / counters.total) * 100) : 0;
    days.push({ label: date.toLocaleDateString("en-US", { weekday: "short" }), date: key, rate, isToday: key === new Date().toISOString().slice(0, 10) });
  }

  const rates = days.map((day) => day.rate);
  return {
    days,
    avgRate: rates.length ? Math.round(rates.reduce((sum, value) => sum + value, 0) / rates.length) : 0,
    bestDayRate: rates.length ? Math.max(...rates) : 0,
    lowestRate: rates.length ? Math.min(...rates) : 0,
    daysTracked: days.length,
    weekTrend: "+0.0%",
  };
};

exports.getAttendanceRecords = async (schoolId, filters = {}) => {
  const search = String(filters.search || "").trim().toLowerCase();
  const status = filters.status ? String(filters.status).trim().toLowerCase() : "";
  const classFilter = filters.classFilter ? String(filters.classFilter).trim() : "";
  const date = filters.date ? new Date(filters.date) : null;

  const records = await prisma.attendanceRecord.findMany({
    where: {
      schoolId,
      ...(status ? { status: status.toLowerCase() } : {}),
      ...(date ? { session: { attendanceDate: { equals: date } } } : {}),
      ...(classFilter && classFilter !== "all"
        ? { session: { section: { class: { name: { contains: classFilter, mode: "insensitive" } } } } }
        : {}),
      ...(search
        ? {
            OR: [
              { studentProfile: { user: { firstName: { contains: search, mode: "insensitive" } } } },
              { studentProfile: { user: { lastName: { contains: search, mode: "insensitive" } } } },
              { studentProfile: { admissionNo: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      studentProfile: { include: { user: true } },
      session: {
        include: {
          section: { include: { class: true } },
          academicYear: true,
        },
      },
    },
    orderBy: [{ session: { attendanceDate: "desc" } }, { createdAt: "desc" }],
  });

  return records.map(buildRecordResponse);
};

exports.getRegisterForSection = async (schoolId, query) => {
  const section = await ensureSchoolScope(schoolId, query.sectionId, query.academicYearId);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      schoolId,
      sectionId: query.sectionId,
      academicYearId: query.academicYearId,
      isActive: true,
    },
    include: {
      studentProfile: { include: { user: true } },
    },
    orderBy: [{ studentProfile: { user: { lastName: "asc" } } }, { studentProfile: { user: { firstName: "asc" } } }],
  });

  const session = await prisma.attendanceSession.findUnique({
    where: {
      schoolId_sectionId_academicYearId_attendanceDate_type: {
        schoolId,
        sectionId: query.sectionId,
        academicYearId: query.academicYearId,
        attendanceDate: new Date(query.date),
        type: "daily",
      },
    },
    include: {
      records: true,
    },
  });

  const recordMap = new Map((session?.records ?? []).map((record) => [record.studentProfileId, record]));

  return {
    section: { id: section.id, name: buildClassName(section), academicYear: section.academicYear.name },
    students: enrollments.map((enrollment) => {
      const record = recordMap.get(enrollment.studentProfileId);
      return {
        id: enrollment.studentProfileId,
        studentName: buildStudentName(enrollment.studentProfile.user),
        studentCode: enrollment.studentProfile.admissionNo || enrollment.studentProfile.user.email || "N/A",
        status: record?.status || "absent",
        remarks: record?.remarks || null,
      };
    }),
  };
};

exports.createOrUpdateSession = async (schoolId, payload) => {
  const section = await ensureSchoolScope(schoolId, payload.sectionId, payload.academicYearId);

  const dateValue = new Date(payload.attendanceDate);
  dateValue.setHours(0, 0, 0, 0);

  const session = await prisma.attendanceSession.upsert({
    where: {
      schoolId_sectionId_academicYearId_attendanceDate_type: {
        schoolId,
        sectionId: payload.sectionId,
        academicYearId: payload.academicYearId,
        attendanceDate: dateValue,
        type: payload.type || "daily",
      },
    },
    create: {
      schoolId,
      sectionId: payload.sectionId,
      academicYearId: payload.academicYearId,
      attendanceDate: dateValue,
      type: payload.type || "daily",
      subjectId: payload.subjectId || null,
      teacherId: payload.teacherId || null,
    },
    update: {
      subjectId: payload.subjectId || null,
      teacherId: payload.teacherId || null,
    },
    include: { records: true },
  });

  const values = await Promise.all(
    payload.records.map(async (entry) => {
      const normalizedStatus = normalizeStatus(entry.status);
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          schoolId,
          studentProfileId: entry.studentProfileId,
          sectionId: payload.sectionId,
          academicYearId: payload.academicYearId,
          isActive: true,
        },
        select: { id: true },
      });

      if (!enrollment) {
        throw new AppError("One or more students are not enrolled in the selected section", 400);
      }

      return prisma.attendanceRecord.upsert({
        where: {
          sessionId_studentProfileId: {
            sessionId: session.id,
            studentProfileId: entry.studentProfileId,
          },
        },
        create: {
          schoolId,
          sessionId: session.id,
          studentProfileId: entry.studentProfileId,
          status: normalizedStatus,
          remarks: entry.remarks || null,
        },
        update: {
          status: normalizedStatus,
          remarks: entry.remarks ?? undefined,
        },
      });
    }),
  );

  return {
    sessionId: session.id,
    section: { id: section.id, name: buildClassName(section) },
    records: values,
  };
};

exports.updateStatus = async (schoolId, recordId, payload) => {
  if (!recordId) {
    throw new AppError("Attendance record is required", 400);
  }

  const status = normalizeStatus(payload.status);
  const record = await prisma.attendanceRecord.findFirst({
    where: { id: recordId, schoolId },
    include: { studentProfile: { include: { user: true } }, session: { include: { section: { include: { class: true } } } } },
  });

  if (!record) {
    throw new AppError("Attendance record not found", 404);
  }

  const updated = await prisma.attendanceRecord.update({
    where: { id: recordId },
    data: {
      status,
      remarks: payload.remarks ?? record.remarks,
    },
  });

  return buildRecordResponse({ ...record, status: updated.status, remarks: updated.remarks });
};

exports.bulkUpdateStatus = async (schoolId, ids, status) => {
  const normalized = normalizeStatus(status);
  const rows = await prisma.attendanceRecord.updateMany({
    where: {
      id: { in: ids },
      schoolId,
    },
    data: { status: normalized },
  });

  return { updated: rows.count, status: normalized };
};

exports.bulkMarkAttendance = async (schoolId, payload) => {
  const entries = payload.entries || [];
  const updates = await Promise.all(
    entries.map(async ({ id, status, remarks }) => {
      const normalizedStatus = normalizeStatus(status);
      const record = await prisma.attendanceRecord.findFirst({ where: { id, schoolId } });
      if (!record) {
        throw new AppError("One or more attendance records were not found", 404);
      }
      return prisma.attendanceRecord.update({
        where: { id },
        data: {
          status: normalizedStatus,
          remarks: remarks ?? record.remarks,
        },
      });
    }),
  );

  return { updated: updates.length, records: updates };
};

exports.getSession = async (schoolId, sessionId) => {
  const session = await prisma.attendanceSession.findFirst({
    where: { id: sessionId, schoolId },
    include: {
      section: { include: { class: true, academicYear: true } },
      subject: true,
      teacher: true,
      records: {
        include: {
          studentProfile: { include: { user: true } },
        },
      },
    },
  });

  if (!session) {
    throw new AppError("Attendance session not found", 404);
  }

  const summary = { present: 0, absent: 0, late: 0, excused: 0 };
  for (const record of session.records) {
    if (summary[record.status] !== undefined) {
      summary[record.status] += 1;
    }
  }

  return {
    id: session.id,
    schoolId: session.schoolId,
    attendanceDate: session.attendanceDate.toISOString().slice(0, 10),
    type: session.type,
    section: { id: session.section.id, name: buildClassName(session.section) },
    subject: session.subject ? { id: session.subject.id, name: session.subject.name } : null,
    teacher: session.teacher ? { id: session.teacher.id, name: buildStudentName(session.teacher) } : null,
    summary,
    records: session.records.map((record) => ({
      id: record.id,
      studentName: buildStudentName(record.studentProfile.user),
      studentCode: record.studentProfile.admissionNo || record.studentProfile.user.email || "N/A",
      status: record.status,
      remarks: record.remarks || null,
    })),
  };
};

exports.listSessions = async (schoolId, filters = {}) => {
  const where = { schoolId };
  if (filters.sectionId) where.sectionId = filters.sectionId;
  if (filters.academicYearId) where.academicYearId = filters.academicYearId;
  if (filters.date) {
    const value = new Date(filters.date);
    where.attendanceDate = { equals: value };
  }
  if (filters.type) where.type = filters.type;

  const sessions = await prisma.attendanceSession.findMany({
    where,
    include: {
      section: { include: { class: true } },
      subject: true,
      records: true,
    },
    orderBy: { attendanceDate: "desc" },
    take: Number(filters.limit || 20),
    skip: Number(filters.page > 1 ? (filters.page - 1) * Number(filters.limit || 20) : 0),
  });

  return sessions.map((session) => {
    const summary = { present: 0, absent: 0, late: 0, excused: 0 };
    for (const record of session.records) {
      if (summary[record.status] !== undefined) {
        summary[record.status] += 1;
      }
    }
    return {
      id: session.id,
      date: session.attendanceDate.toISOString().slice(0, 10),
      type: session.type,
      section: buildClassName(session.section),
      subject: session.subject ? session.subject.name : null,
      totalStudents: session.records.length,
      present: summary.present,
      absent: summary.absent,
      late: summary.late,
      excused: summary.excused,
      attendancePercentage: session.records.length
        ? Math.round(((summary.present + summary.late) / session.records.length) * 100)
        : 0,
    };
  });
};

exports.deleteSession = async (schoolId, sessionId) => {
  const session = await prisma.attendanceSession.findFirst({ where: { id: sessionId, schoolId } });
  if (!session) {
    throw new AppError("Attendance session not found", 404);
  }

  await prisma.attendanceRecord.deleteMany({ where: { sessionId } });
  await prisma.attendanceSession.delete({ where: { id: sessionId } });

  return { deleted: true, id: sessionId };
};
