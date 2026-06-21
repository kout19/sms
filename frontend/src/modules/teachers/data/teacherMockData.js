export const teacherClasses = [
  {
    id: "10-a",
    section: "10-A",
    course: "Mathematics",
    period: "1",
    time: "9:00 AM",
    room: "201",
    students: [
      { id: "s1", name: "Alice Johnson", rollNo: "01", attendance: 96 },
      { id: "s2", name: "Ben Carter", rollNo: "02", attendance: 88 },
      { id: "s3", name: "Chloe Davis", rollNo: "03", attendance: 92 },
    ],
  },
  {
    id: "10-b",
    section: "10-B",
    course: "Mathematics",
    period: "3",
    time: "11:00 AM",
    room: "202",
    students: [
      { id: "s4", name: "David Lee", rollNo: "01", attendance: 94 },
      { id: "s5", name: "Emma Wilson", rollNo: "02", attendance: 91 },
    ],
  },
  {
    id: "10-c",
    section: "10-C",
    course: "Mathematics",
    period: "5",
    time: "2:00 PM",
    room: "203",
    students: [
      { id: "s6", name: "Frank Miller", rollNo: "01", attendance: 89 },
      { id: "s7", name: "Grace Taylor", rollNo: "02", attendance: 97 },
    ],
  },
];

export const teacherSchedule = [
  { time: "9:00 AM", course: "Mathematics", grade: "10-A", room: "201", task: "Lecture" },
  { time: "11:00 AM", course: "Mathematics", grade: "10-B", room: "202", task: "Lecture" },
  { time: "2:00 PM", course: "Mathematics", grade: "10-C", room: "203", task: "Lab" },
];

export const allTeacherStudents = teacherClasses.flatMap((cls) =>
  cls.students.map((s) => ({ ...s, class: cls.section, course: cls.course })),
);

export const gradeEntries = [
  { student: "Alice Johnson", class: "10-A", assignment: "Midterm Exam", score: 88, maxScore: 100 },
  { student: "Ben Carter", class: "10-A", assignment: "Midterm Exam", score: 72, maxScore: 100 },
  { student: "David Lee", class: "10-B", assignment: "Quiz 3", score: 19, maxScore: 20 },
];

export const attendanceRecords = [
  { date: "Jun 18", class: "10-A", present: 30, absent: 2, late: 0 },
  { date: "Jun 19", class: "10-B", present: 35, absent: 2, late: 1 },
  { date: "Jun 20", class: "10-C", present: 28, absent: 2, late: 0 },
];

export const teacherAnnouncements = [
  { id: 1, title: "Midterm Exam Schedule", date: "Jun 15", audience: "Grade 10" },
  { id: 2, title: "Parent-Teacher Meeting", date: "Jun 10", audience: "All Classes" },
];
