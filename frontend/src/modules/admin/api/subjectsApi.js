import apiAxios from "../../../shared/api/axios";

const BASE = "/admin/subjects";

// Initial mock data until backend endpoint `/admin/subjects` is ready
let MOCK_SUBJECTS = [
  {
    id: "s1",
    name: "Physics",
    code: "PHY301",
    department: "Sciences",
    grade: "Grade 12",
    students: 87,
    status: "Inactive",
    teacher: { name: "Dr. Robert Chen", initials: "RC" },
  },
  {
    id: "s2",
    name: "Computer Science",
    code: "CS301",
    department: "Technology",
    grade: "Grade 12",
    students: 76,
    status: "Active",
    teacher: { name: "Mr. Kevin Lee", initials: "KL" },
  },
  {
    id: "s3",
    name: "Economics",
    code: "ECO301",
    department: "Humanities",
    grade: "Grade 12",
    students: 92,
    status: "Active",
    teacher: { name: "Mr. Paul Anderson", initials: "PA" },
  },
  {
    id: "s4",
    name: "Literature",
    code: "LIT301",
    department: "Humanities",
    grade: "Grade 12",
    students: 96,
    status: "Active",
    teacher: { name: "Ms. Patricia Davis", initials: "PD" },
  },
  {
    id: "s5",
    name: "English Language",
    code: "ENG201",
    department: "Humanities",
    grade: "Grade 11",
    students: 118,
    status: "Active",
    teacher: { name: "Ms. Sarah Johnson", initials: "SJ" },
  },
  {
    id: "s6",
    name: "Chemistry",
    code: "CHEM201",
    department: "Sciences",
    grade: "Grade 11",
    students: 103,
    status: "Active",
    teacher: { name: "Ms. Emily Davis", initials: "ED" },
  },
  {
    id: "s7",
    name: "History",
    code: "HIST201",
    department: "Humanities",
    grade: "Grade 11",
    students: 98,
    status: "Active",
    teacher: { name: "Ms. Linda Martinez", initials: "LM" },
  },
  {
    id: "s8",
    name: "French",
    code: "FRN201",
    department: "Languages",
    grade: "Grade 11",
    students: 0,
    status: "Inactive",
    teacher: { name: "Ms. Claire Dubois", initials: "CD" },
  },
  {
    id: "s9",
    name: "Statistics",
    code: "STAT201",
    department: "Sciences",
    grade: "Grade 11",
    students: 84,
    status: "Active",
    teacher: { name: "Dr. Anna Kim", initials: "AK" },
  },
  {
    id: "s10",
    name: "Mathematics",
    code: "MATH101",
    department: "Sciences",
    grade: "Grade 10",
    students: 142,
    status: "Active",
    teacher: { name: "Mr. James Wilson", initials: "JW" },
  },
  {
    id: "s11",
    name: "Biology",
    code: "BIO101",
    department: "Sciences",
    grade: "Grade 10",
    students: 130,
    status: "Active",
    teacher: { name: "Mr. Michael Brown", initials: "MB" },
  },
  {
    id: "s12",
    name: "Geography",
    code: "GEO101",
    department: "Humanities",
    grade: "Grade 10",
    students: 110,
    status: "Active",
    teacher: { name: "Mr. David Thompson", initials: "DT" },
  },
  {
    id: "s13",
    name: "Art & Design",
    code: "ART101",
    department: "Arts",
    grade: "Grade 10",
    students: 65,
    status: "Active",
    teacher: { name: "Ms. Rachel Green", initials: "MR" },
  },
  {
    id: "s14",
    name: "Physical Education",
    code: "PE101",
    department: "Sports",
    grade: "Grade 10",
    students: 180,
    status: "Active",
    teacher: { name: "Mr. Tom Harris", initials: "TH" },
  },
  {
    id: "s15",
    name: "Music",
    code: "MUS101",
    department: "Arts",
    grade: "Grade 10",
    students: 58,
    status: "Active",
    teacher: { name: "Ms. Amy Wilson", initials: "AW" },
  },
];

export const getAllSubjects = async (filters = {}) => {
  // TODO once backend exists:
  // const response = await apiAxios.get(BASE, { params: filters });
  // return response.data;

  await new Promise((r) => setTimeout(r, 200));

  let results = [...MOCK_SUBJECTS];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.teacher.name.toLowerCase().includes(q),
    );
  }

  if (filters.department && filters.department !== "All") {
    results = results.filter((s) => s.department === filters.department);
  }

  if (filters.grade && filters.grade !== "All") {
    results = results.filter((s) => s.grade === filters.grade);
  }

  if (filters.status && filters.status !== "All") {
    results = results.filter((s) => s.status === filters.status);
  }

  // Calculate dynamic header stats based on current state
  const stats = {
    totalSubjects: MOCK_SUBJECTS.length,
    activeSubjects: MOCK_SUBJECTS.filter((s) => s.status === "Active").length,
    assignedSubjects: MOCK_SUBJECTS.filter((s) => s.teacher?.name).length,
    departments: new Set(MOCK_SUBJECTS.map((s) => s.department)).size,
  };

  return { items: results, total: results.length, stats };
};

export const createSubject = async (payload) => {
  const newSubject = {
    id: crypto.randomUUID(),
    students: 0,
    status: "Active",
    ...payload,
  };
  MOCK_SUBJECTS.push(newSubject);
  return newSubject;
};

export const toggleSubjectStatus = async (id) => {
  const subject = MOCK_SUBJECTS.find((s) => s.id === id);
  if (!subject) throw new Error("Subject not found");
  subject.status = subject.status === "Active" ? "Inactive" : "Active";
  return subject;
};

export const deleteSubject = async (id) => {
  MOCK_SUBJECTS = MOCK_SUBJECTS.filter((s) => s.id !== id);
  return id;
};

export const updateSubject = async ({ id, ...payload }) => {
  const subject = MOCK_SUBJECTS.find((s) => s.id === id);
  if (!subject) throw new Error("Subject not found");
  Object.assign(subject, payload);
  return subject;
};