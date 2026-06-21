export const currentGrades = [
  { subject: "Mathematics", score: 92, grade: "A", teacher: "Mr. Smith" },
  { subject: "English", score: 85, grade: "B+", teacher: "Ms. Johnson" },
  { subject: "Science", score: 88, grade: "A-", teacher: "Dr. Lee" },
  { subject: "History", score: 78, grade: "B", teacher: "Mr. Brown" },
];

export const gradeHistory = [
  { term: "Fall 2025", gpa: 3.7, subjects: 6 },
  { term: "Spring 2025", gpa: 3.5, subjects: 6 },
  { term: "Fall 2024", gpa: 3.4, subjects: 6 },
];

export const attendanceSummary = {
  present: 142,
  absent: 8,
  late: 3,
  rate: 94,
};

export const monthlyAttendance = [
  { month: "Jan", rate: 96 },
  { month: "Feb", rate: 93 },
  { month: "Mar", rate: 95 },
  { month: "Apr", rate: 92 },
  { month: "May", rate: 94 },
  { month: "Jun", rate: 94 },
];

export const studentSchedule = [
  { time: "8:00 AM", subject: "Mathematics", room: "201", teacher: "Mr. Smith" },
  { time: "9:30 AM", subject: "English", room: "105", teacher: "Ms. Johnson" },
  { time: "11:00 AM", subject: "Science Lab", room: "Lab 3", teacher: "Dr. Lee" },
  { time: "1:00 PM", subject: "History", room: "110", teacher: "Mr. Brown" },
];

export const pendingAssignments = [
  { title: "Algebra Worksheet", subject: "Mathematics", due: "Jun 23", status: "pending" },
  { title: "Essay Draft", subject: "English", due: "Jun 25", status: "pending" },
];

export const submittedAssignments = [
  { title: "Science Project", subject: "Science", submitted: "Jun 18", grade: "A-" },
  { title: "History Quiz", subject: "History", submitted: "Jun 15", grade: "B+" },
];

export const studentAnnouncements = [
  { id: 1, title: "Sports Day Registration", date: "Jun 20", type: "Event" },
  { id: 2, title: "Library Hours Extended", date: "Jun 18", type: "Notice" },
];

export const studentMessages = [
  { id: 1, from: "Mr. Smith", preview: "Great work on the latest quiz!", time: "1h ago", unread: true },
  { id: 2, from: "School Admin", preview: "Reminder: ID card renewal.", time: "Jun 19", unread: false },
];
