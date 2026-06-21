export const children = [
  {
    id: "child_001",
    name: "Emma Brown",
    class: "Class 8-A",
    gpa: 3.9,
    attendance: 96,
    grades: [
      { subject: "Mathematics", score: 94, grade: "A" },
      { subject: "English", score: 88, grade: "B+" },
      { subject: "Science", score: 91, grade: "A-" },
    ],
    attendanceRecords: [
      { month: "Jan", rate: 97 },
      { month: "Feb", rate: 95 },
      { month: "Mar", rate: 96 },
    ],
    schedule: [
      { time: "8:30 AM", subject: "Mathematics", room: "301" },
      { time: "10:00 AM", subject: "English", room: "205" },
      { time: "1:00 PM", subject: "Art", room: "Studio 2" },
    ],
  },
  {
    id: "child_002",
    name: "Noah Brown",
    class: "Class 10-B",
    gpa: 3.7,
    attendance: 92,
    grades: [
      { subject: "Mathematics", score: 85, grade: "B+" },
      { subject: "Physics", score: 90, grade: "A-" },
      { subject: "Chemistry", score: 82, grade: "B" },
    ],
    attendanceRecords: [
      { month: "Jan", rate: 93 },
      { month: "Feb", rate: 91 },
      { month: "Mar", rate: 92 },
    ],
    schedule: [
      { time: "9:00 AM", subject: "Physics", room: "Lab 1" },
      { time: "11:00 AM", subject: "Mathematics", room: "202" },
      { time: "2:00 PM", subject: "Chemistry", room: "Lab 2" },
    ],
  },
];

export const parentAnnouncements = [
  { id: 1, title: "Parent-Teacher Conference", date: "Jun 22", type: "Event" },
  { id: 2, title: "Fee Payment Reminder", date: "Jun 20", type: "Finance" },
];

export const feeRecords = [
  { term: "Fall 2026", amount: 1200, status: "Paid", date: "May 15" },
  { term: "Spring 2026", amount: 1200, status: "Paid", date: "Jan 10" },
  { term: "Fall 2025", amount: 1150, status: "Paid", date: "Aug 20" },
];

export const documents = [
  { id: 1, name: "Report Card — Spring 2026", type: "PDF", date: "Jun 1" },
  { id: 2, name: "Vaccination Certificate", type: "PDF", date: "Mar 12" },
  { id: 3, name: "Enrollment Form", type: "PDF", date: "Aug 5" },
];

export const parentMessages = [
  { id: 1, from: "Mr. Smith (Teacher)", preview: "Emma's progress update attached.", time: "3h ago", unread: true },
  { id: 2, from: "School Admin", preview: "Fee receipt for Spring 2026.", time: "Jun 17", unread: false },
];
