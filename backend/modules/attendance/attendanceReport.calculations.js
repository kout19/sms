const STATUSES = ["present", "absent", "late", "excused"];

const emptyCounts = () => ({ present: 0, absent: 0, late: 0, excused: 0, total: 0 });

const attendancePercentage = (counts) =>
  counts.total ? Math.round(((counts.present + counts.late) / counts.total) * 10000) / 100 : 0;

const dateKey = (date) => date.toISOString().slice(0, 10);

const dateGroupKey = (date, grouping) => {
  if (grouping === "monthly") return date.toISOString().slice(0, 7);
  if (grouping === "weekly") {
    const monday = new Date(date);
    monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
    return dateKey(monday);
  }
  return dateKey(date);
};

module.exports = { STATUSES, emptyCounts, attendancePercentage, dateKey, dateGroupKey };
