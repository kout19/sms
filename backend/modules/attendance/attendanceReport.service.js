const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");
const {
  STATUSES,
  emptyCounts,
  attendancePercentage: percentage,
  dateKey,
  dateGroupKey,
} = require("./attendanceReport.calculations");
const fullName = (user) => `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Unassigned teacher";

const dateWhere = (filters) => {
  if (!filters.startDate) return undefined;
  const end = new Date(`${filters.endDate}T00:00:00.000Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  return { gte: new Date(`${filters.startDate}T00:00:00.000Z`), lt: end };
};

const recordWhere = (schoolId, filters) => ({
  schoolId,
  ...(filters.status ? { status: filters.status } : {}),
  session: {
    schoolId,
    ...(filters.academicYearId ? { academicYearId: filters.academicYearId } : {}),
    ...(filters.sectionId ? { sectionId: filters.sectionId } : {}),
    ...(filters.subjectId ? { subjectId: filters.subjectId } : {}),
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.classId ? { section: { classId: filters.classId } } : {}),
    ...(dateWhere(filters) ? { attendanceDate: dateWhere(filters) } : {}),
  },
});

const sessionWhere = (schoolId, filters) => {
  const where = recordWhere(schoolId, filters).session;
  return { ...where };
};

const fetchRecords = (schoolId, filters) =>
  prisma.attendanceRecord.findMany({
    where: recordWhere(schoolId, filters),
    select: {
      id: true,
      status: true,
      createdAt: true,
      studentProfileId: true,
      studentProfile: {
        select: {
          admissionNo: true,
          user: { select: { firstName: true, lastName: true } },
        },
      },
      session: {
        select: {
          id: true,
          attendanceDate: true,
          updatedAt: true,
          type: true,
          teacherId: true,
          sectionId: true,
          subjectId: true,
          teacher: { select: { firstName: true, lastName: true, role: true, schoolId: true } },
          subject: { select: { name: true } },
          section: {
            select: {
              id: true,
              name: true,
              class: { select: { id: true, name: true, code: true } },
              academicYear: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
    orderBy: [{ session: { attendanceDate: "desc" } }, { createdAt: "desc" }],
  });

const formatRecord = (record) => ({
  id: record.id,
  sessionId: record.session.id,
  studentId: record.studentProfileId,
  admissionNo: record.studentProfile.admissionNo || "—",
  studentName: fullName(record.studentProfile.user),
  className: record.session.section.class.name,
  sectionName: record.session.section.name,
  classId: record.session.section.class.id,
  sectionId: record.session.section.id,
  subject: record.session.subject?.name || "—",
  date: dateKey(record.session.attendanceDate),
  type: record.session.type,
  status: record.status,
});

const sessionReportFilters = (filters) => ({
  ...(filters.academicYearId ? { academicYearId: filters.academicYearId } : {}),
  ...(filters.sectionId ? { id: filters.sectionId } : {}),
  ...(filters.classId ? { classId: filters.classId } : {}),
  ...(filters.subjectId ? { attendanceSessions: { some: { subjectId: filters.subjectId } } } : {}),
});

exports.getOptions = async (schoolId) => {
  const [school, academicYears, classes, sections, subjects] = await Promise.all([
    prisma.school.findUnique({ where: { id: schoolId }, select: { name: true } }),
    prisma.academicYear.findMany({
      where: { schoolId },
      select: { id: true, name: true, isCurrent: true },
      orderBy: [{ isCurrent: "desc" }, { name: "desc" }],
    }),
    prisma.class.findMany({
      where: { schoolId },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
    prisma.section.findMany({
      where: { schoolId },
      select: {
        id: true,
        name: true,
        academicYearId: true,
        class: { select: { id: true, name: true } },
        academicYear: { select: { name: true } },
      },
      orderBy: [{ class: { name: "asc" } }, { name: "asc" }],
    }),
    prisma.subject.findMany({
      where: { schoolId },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
  ]);
  return { schoolName: school?.name || "", academicYears, classes, sections, subjects };
};

exports.getReport = async (schoolId, filters) => {
  const sectionFilter = sessionReportFilters(filters);
  const [recordGroups, sessions, sections, submittedSessions] = await Promise.all([
    prisma.attendanceRecord.groupBy({
      by: ["sessionId", "status"],
      where: recordWhere(schoolId, filters),
      _count: { _all: true },
    }),
    prisma.attendanceSession.findMany({
      where: {
        schoolId,
        ...sessionWhere(schoolId, filters),
        records: { some: { schoolId, ...(filters.status ? { status: filters.status } : {}) } },
      },
      select: {
        id: true,
        attendanceDate: true,
        sectionId: true,
        section: {
          select: {
            id: true,
            class: { select: { name: true } },
          },
        },
      },
    }),
    prisma.section.findMany({
      where: {
        schoolId,
        ...sectionFilter,
      },
      select: {
        id: true,
        name: true,
        class: { select: { id: true, name: true, code: true } },
        academicYear: { select: { id: true, name: true } },
      },
      orderBy: [{ class: { name: "asc" } }, { name: "asc" }],
    }),
    prisma.attendanceSession.findMany({
      where: {
        schoolId,
        ...sessionWhere(schoolId, filters),
        records: { some: { schoolId } },
      },
      select: {
        id: true,
        teacherId: true,
        updatedAt: true,
        subjectId: true,
        subject: { select: { name: true } },
        teacher: { select: { firstName: true, lastName: true, role: true, schoolId: true } },
        section: {
          select: {
            id: true,
            name: true,
            class: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  const counts = emptyCounts();
  const trendMap = new Map();
  const sectionMap = new Map();
  const teacherMap = new Map();
  const sessionsById = new Map(sessions.map((session) => [session.id, session]));
  for (const record of recordGroups) {
    const status = record.status;
    const total = record._count._all;
    const session = sessionsById.get(record.sessionId);
    if (!session) continue;
    counts[status] += total;
    counts.total += total;
    const trendKey = dateGroupKey(session.attendanceDate, filters.groupBy || "weekly");
    const trendCounts = trendMap.get(trendKey) || emptyCounts();
    trendCounts[status] += total;
    trendCounts.total += total;
    trendMap.set(trendKey, trendCounts);

    const sectionCounts = sectionMap.get(session.sectionId) || emptyCounts();
    sectionCounts[status] += total;
    sectionCounts.total += total;
    sectionMap.set(session.sectionId, sectionCounts);
  }

  for (const session of submittedSessions) {
    const isSchoolTeacher = session.teacher?.role === "teacher" && session.teacher.schoolId === schoolId;
    const teacherKey = isSchoolTeacher ? session.teacherId : "unassigned";
    const teacher = teacherMap.get(teacherKey) || {
      id: isSchoolTeacher ? session.teacherId : null,
      name: isSchoolTeacher ? fullName(session.teacher) : "Unassigned teacher",
      sessions: 0,
      lastSessionUpdatedAt: session.updatedAt,
      sections: new Map(),
    };
    teacher.sessions += 1;
    if (session.updatedAt > teacher.lastSessionUpdatedAt) teacher.lastSessionUpdatedAt = session.updatedAt;
    const assignmentKey = `${session.section.id}:${session.subjectId || "none"}`;
    if (!teacher.sections.has(assignmentKey)) {
      teacher.sections.set(assignmentKey, {
        className: session.section.class.name,
        sectionName: session.section.name,
        subject: session.subject?.name || "—",
      });
    }
    teacherMap.set(teacherKey, teacher);
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      schoolId,
      ...(filters.academicYearId ? { academicYearId: filters.academicYearId } : {}),
      section: { schoolId, ...sectionFilter },
      ...(filters.startDate
        ? {
            enrolledAt: { lte: new Date(`${filters.endDate}T23:59:59.999Z`) },
            OR: [
              { isActive: true },
              { endedAt: { gte: new Date(`${filters.startDate}T00:00:00.000Z`) } },
            ],
          }
        : {}),
    },
    select: { sectionId: true, studentProfileId: true },
  });
  const enrolledBySection = new Map();
  for (const enrollment of enrollments) {
    enrolledBySection.set(enrollment.sectionId, (enrolledBySection.get(enrollment.sectionId) || 0) + 1);
  }

  const distribution = STATUSES.map((status) => ({ status, count: counts[status] }));
  const trend = Array.from(trendMap, ([period, values]) => ({
    period,
    ...values,
    percentage: percentage(values),
  })).sort((a, b) => a.period.localeCompare(b.period));
  const comparison = sections.map((section) => {
    const values = sectionMap.get(section.id) || emptyCounts();
    return {
      sectionId: section.id,
      classId: section.class.id,
      className: section.class.name,
      sectionName: section.name,
      academicYear: section.academicYear.name,
      totalEnrolled: enrolledBySection.get(section.id) || 0,
      recordedAttendance: values.total,
      ...values,
      attendancePercentage: percentage(values),
    };
  });
  const teachers = Array.from(teacherMap.values()).map((teacher) => ({
    id: teacher.id,
    name: teacher.name,
    recordedSessions: teacher.sessions,
    assignedSections: Array.from(teacher.sections.values()),
    lastSessionUpdatedAt: teacher.lastSessionUpdatedAt?.toISOString() || null,
    expectedSessions: null,
    pendingSessions: null,
    submissionPercentage: null,
  }));

  return {
    summary: { ...counts, attendancePercentage: percentage(counts) },
    distribution,
    trend,
    comparison,
    teachers,
  };
};

exports.getStudentReport = async (schoolId, filters, kind, page, limit, sortBy, sortOrder, minAbsent, minLate) => {
  const records = await fetchRecords(schoolId, filters);
  const map = new Map();
  for (const record of records) {
    const data = formatRecord(record);
    const key = `${data.studentId}:${data.sectionId}`;
    const student = map.get(key) || {
      id: data.studentId,
      admissionNo: data.admissionNo,
      name: data.studentName,
      className: data.className,
      sectionName: data.sectionName,
      classId: data.classId,
      sectionId: data.sectionId,
      totalRecordedSessions: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    };
    student[data.status] += 1;
    student.totalRecordedSessions += 1;
    map.set(key, student);
  }
  let items = Array.from(map.values()).map((student) => ({
    ...student,
    attendancePercentage: student.totalRecordedSessions
      ? Math.round(((student.present + student.late) / student.totalRecordedSessions) * 10000) / 100
      : 0,
  }));
  items = kind === "late"
    ? items.filter((student) => student.late >= minLate)
    : items.filter((student) => student.absent >= minAbsent);
  items.sort((a, b) => {
    const left = sortBy === "studentName" ? a.name.toLocaleLowerCase() : a[sortBy];
    const right = sortBy === "studentName" ? b.name.toLocaleLowerCase() : b[sortBy];
    const result = typeof left === "string" ? left.localeCompare(right) : left - right;
    return sortOrder === "asc" ? result : -result;
  });
  return {
    items: items.slice((page - 1) * limit, page * limit),
    pagination: { page, limit, total: items.length, pages: Math.ceil(items.length / limit) },
  };
};

exports.getRecords = async (schoolId, filters, page, limit) => {
  const where = recordWhere(schoolId, filters);
  const [records, total] = await Promise.all([
    prisma.attendanceRecord.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ session: { attendanceDate: "desc" } }, { createdAt: "desc" }],
      select: {
        id: true,
        status: true,
        studentProfileId: true,
        studentProfile: { select: { admissionNo: true, user: { select: { firstName: true, lastName: true } } } },
        session: {
          select: {
            id: true,
            attendanceDate: true,
            type: true,
            subject: { select: { name: true } },
            section: {
              select: {
                id: true,
                name: true,
                class: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    }),
    prisma.attendanceRecord.count({ where }),
  ]);
  return {
    items: records.map((record) => formatRecord({
      ...record,
      session: { ...record.session, updatedAt: new Date() },
    })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

exports.getDetail = async (schoolId, filters, kind, id, page, limit) => {
  const scope = recordWhere(schoolId, filters);
  if (kind === "session") {
    const session = await prisma.attendanceSession.findFirst({
      where: { id, schoolId, ...sessionWhere(schoolId, filters) },
      select: {
        id: true,
        attendanceDate: true,
        type: true,
        updatedAt: true,
        teacher: { select: { firstName: true, lastName: true } },
        subject: { select: { name: true } },
        section: { select: { name: true, class: { select: { name: true } }, academicYear: { select: { name: true } } } },
        records: {
          where: { schoolId, ...(filters.status ? { status: filters.status } : {}) },
          select: {
            id: true,
            status: true,
            studentProfile: { select: { admissionNo: true, user: { select: { firstName: true, lastName: true } } } },
          },
          orderBy: [{ studentProfile: { user: { lastName: "asc" } } }, { studentProfile: { user: { firstName: "asc" } } }],
        },
      },
    });
    if (!session) throw new AppError("Attendance session not found", 404);
    const counts = emptyCounts();
    session.records.forEach((record) => {
      counts[record.status] += 1;
      counts.total += 1;
    });
    return {
      kind,
      date: dateKey(session.attendanceDate),
      type: session.type,
      subject: session.subject?.name || "—",
      teacher: fullName(session.teacher),
      className: session.section.class.name,
      sectionName: session.section.name,
      academicYear: session.section.academicYear.name,
      updatedAt: session.updatedAt.toISOString(),
      summary: { ...counts, attendancePercentage: percentage(counts) },
      records: session.records.map((record) => ({
        admissionNo: record.studentProfile.admissionNo || "—",
        studentName: fullName(record.studentProfile.user),
        status: record.status,
      })),
    };
  }

  if (kind === "student") {
    const student = await prisma.studentProfile.findFirst({
      where: {
        id,
        user: { schoolId },
        attendanceRecords: { some: { ...scope } },
      },
      select: { id: true, admissionNo: true, user: { select: { firstName: true, lastName: true } } },
    });
    if (!student) throw new AppError("Student attendance history not found", 404);
    const where = { ...scope, studentProfileId: id };
    const [records, total] = await Promise.all([
      prisma.attendanceRecord.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ session: { attendanceDate: "desc" } }],
        select: {
          id: true,
          status: true,
          session: {
            select: {
              attendanceDate: true,
              type: true,
              subject: { select: { name: true } },
              section: { select: { name: true, class: { select: { name: true } } } },
            },
          },
        },
      }),
      prisma.attendanceRecord.count({ where }),
    ]);
    return {
      kind,
      student: { id: student.id, admissionNo: student.admissionNo || "—", name: fullName(student.user) },
      records: records.map((record) => ({
        date: dateKey(record.session.attendanceDate),
        type: record.session.type,
        subject: record.session.subject?.name || "—",
        className: record.session.section.class.name,
        sectionName: record.session.section.name,
        status: record.status,
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  const teacher = await prisma.user.findFirst({
    where: {
      id,
      schoolId,
      role: "teacher",
      attendanceSessions: { some: { schoolId, records: { some: { schoolId } } } },
    },
    select: { id: true, firstName: true, lastName: true },
  });
  if (!teacher) throw new AppError("Teacher attendance history not found", 404);
  const where = {
    schoolId,
    teacherId: id,
    ...sessionWhere(schoolId, filters),
    records: { some: { schoolId, ...(filters.status ? { status: filters.status } : {}) } },
  };
  const [sessions, total] = await Promise.all([
    prisma.attendanceSession.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ attendanceDate: "desc" }],
      select: {
        id: true,
        attendanceDate: true,
        updatedAt: true,
        type: true,
        subject: { select: { name: true } },
        section: { select: { name: true, class: { select: { name: true } } } },
        _count: {
          select: {
            records: { where: { schoolId, ...(filters.status ? { status: filters.status } : {}) } },
          },
        },
      },
    }),
    prisma.attendanceSession.count({ where }),
  ]);
  return {
    kind,
    teacher: { id: teacher.id, name: fullName(teacher) },
    sessions: sessions.map((session) => ({
      id: session.id,
      date: dateKey(session.attendanceDate),
      lastUpdatedAt: session.updatedAt.toISOString(),
      type: session.type,
      subject: session.subject?.name || "—",
      className: session.section.class.name,
      sectionName: session.section.name,
      recordedStudents: session._count.records,
    })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

exports.getExportRecords = fetchRecords;
exports.getReportFiltersWhere = recordWhere;
