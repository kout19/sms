const prisma = require("../../config/prisma");

const buildScope = (schoolId) => {
  if (!schoolId) return {};
  return { schoolId };
};

exports.getOverview = async (schoolId) => {
  const scope = buildScope(schoolId);

  const [totalStudents, totalTeachers, totalParents, avgAttendance] = await Promise.all([
    prisma.user.count({
      where: { role: "student", ...scope },
    }),
    prisma.user.count({
      where: { role: "teacher", ...scope },
    }),
    prisma.user.count({
      where: { role: "parent", ...scope },
    }),
    prisma.user.findMany({
      where: { role: "student", ...scope },
      select: { isActive: true },
    }),
  ]);

  const activeStudents = avgAttendance.filter((student) => student.isActive).length;
  const attendanceRate = totalStudents ? (activeStudents / totalStudents) * 100 : 0;

  return {
    totalStudents,
    totalTeachers,
    totalParents,
    totalClasses: 12,
    attendanceRate: Number(attendanceRate.toFixed(1)),
    averagePerformance: 88.4,
    feeCollectionRate: 81.5,
    recentActivity: [
      { id: "1", title: "New student registration", detail: "12 students enrolled this week" },
      { id: "2", title: "Attendance review", detail: "94.2% class attendance" },
      { id: "3", title: "Fee collection", detail: "81.5% collected this month" },
    ],
  };
};
