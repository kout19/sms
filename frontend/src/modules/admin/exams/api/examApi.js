let MOCK_EXAMS = [
  {
    id: "1",
    name: "Sciences Mock Examination",
    year: "2026–2027",
    time: "08:30",
    duration: "2h",
    type: "Mock",
    term: "Term 1",
    classes: ["Grade 10A", "Grade 10B"],
    extraClassesCount: 2,
    date: "20 Aug 2026",
    endDate: "22 Aug 2026",
    students: 333,
    status: "Completed",
  },
  {
    id: "2",
    name: "Geography Quiz",
    year: "2026–2027",
    time: "11:00",
    duration: "45m",
    type: "Quiz",
    term: "Term 1",
    classes: ["Grade 10A"],
    extraClassesCount: 0,
    date: "25 Aug 2026",
    students: 56,
    status: "Completed",
  },
  {
    id: "3",
    name: "Biology Monthly Test",
    year: "2026–2027",
    time: "10:30",
    duration: "1h",
    type: "Monthly",
    term: "Term 1",
    classes: ["Grade 10A", "Grade 10B"],
    extraClassesCount: 0,
    date: "28 Aug 2026",
    students: 130,
    status: "Completed",
  },
  {
    id: "4",
    name: "Physics Monthly Assessment",
    year: "2026–2027",
    time: "10:00",
    duration: "1h 30m",
    type: "Monthly",
    term: "Term 1",
    classes: ["Grade 12A", "Grade 12B"],
    extraClassesCount: 0,
    date: "05 Sept 2026",
    students: 87,
    status: "Active",
  },
  {
    id: "5",
    name: "Chemistry Unit Quiz",
    year: "2026–2027",
    time: "11:00",
    duration: "45m",
    type: "Quiz",
    term: "Term 1",
    classes: ["Grade 11A", "Grade 11B"],
    extraClassesCount: 0,
    date: "08 Sept 2026",
    students: 103,
    status: "Active",
  },
  {
    id: "6",
    name: "Midterm Mathematics Examination",
    year: "2026–2027",
    time: "09:00",
    duration: "2h 30m",
    type: "Midterm",
    term: "Term 1",
    classes: ["Grade 10A", "Grade 10B"],
    extraClassesCount: 1,
    date: "15 Sept 2026",
    students: 148,
    status: "Upcoming",
  },
  {
    id: "7",
    name: "History Midterm Examination",
    year: "2026–2027",
    time: "09:00",
    duration: "2h",
    type: "Midterm",
    term: "Term 1",
    classes: ["Grade 11A", "Grade 11B"],
    extraClassesCount: 0,
    date: "18 Sept 2026",
    students: 98,
    status: "Upcoming",
  },
  {
    id: "8",
    name: "End-of-Term English Final",
    year: "2026–2027",
    time: "09:00",
    duration: "3h",
    type: "Final",
    term: "Term 1",
    classes: ["Grade 11A", "Grade 11B"],
    extraClassesCount: 1,
    date: "20 Oct 2026",
    students: 211,
    status: "Draft",
  },
  {
    id: "9",
    name: "Computer Science Final Exam",
    year: "2026–2027",
    time: "09:00",
    duration: "3h",
    type: "Final",
    term: "Term 2",
    classes: ["Grade 12A", "Grade 12B"],
    extraClassesCount: 0,
    date: "10 Nov 2026",
    students: 76,
    status: "Draft",
  },
  {
    id: "10",
    name: "Mathematics Final Examination",
    year: "2026–2027",
    time: "09:00",
    duration: "3h",
    type: "Final",
    term: "Term 2",
    classes: ["Grade 10A", "Grade 10B"],
    extraClassesCount: 3,
    date: "20 Nov 2026",
    students: 396,
    status: "Draft",
  },
];

export const examApi = {
  getExamStats: async () => {
    await new Promise((res) => setTimeout(res, 150));
    return {
      upcoming: 2,
      upcomingSubtitle: "+2 this week",
      active: 2,
      activeSubtitle: "In progress",
      completed: 3,
      completedSubtitle: "This term",
      total: 10,
      totalSubtitle: "2026–2027",
    };
  },

  getExams: async (filters = {}) => {
    await new Promise((res) => setTimeout(res, 200));
    let filtered = [...MOCK_EXAMS];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q) ||
          e.classes.some((c) => c.toLowerCase().includes(q)),
      );
    }
    if (filters.year && filters.year !== "All Years") {
      filtered = filtered.filter((e) => e.year === filters.year);
    }
    if (filters.term && filters.term !== "All Terms") {
      filtered = filtered.filter((e) => e.term === filters.term);
    }
    if (filters.type && filters.type !== "All Types") {
      filtered = filtered.filter((e) => e.type === filters.type);
    }
    if (filters.status && filters.status !== "All Statuss") {
      filtered = filtered.filter((e) => e.status === filters.status);
    }

    // Client/API sorting logic
    if (filters.sortField) {
      const { sortField, sortOrder } = filters;
      filtered.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === "string") {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return {
      items: filtered,
      total: filtered.length,
    };
  },

  publishExam: async (id) => {
    await new Promise((res) => setTimeout(res, 200));
    MOCK_EXAMS = MOCK_EXAMS.map((e) =>
      e.id === id ? { ...e, status: "Upcoming" } : e,
    );
    return true;
  },

  archiveExam: async (id) => {
    await new Promise((res) => setTimeout(res, 200));
    MOCK_EXAMS = MOCK_EXAMS.map((e) =>
      e.id === id ? { ...e, status: "Draft" } : e,
    );
    return true;
  },

  deleteExam: async (id) => {
    await new Promise((res) => setTimeout(res, 200));
    MOCK_EXAMS = MOCK_EXAMS.filter((e) => e.id !== id);
    return true;
  },
  createExam: async (examData) => {
    await new Promise((res) => setTimeout(res, 300));
    const newExam = {
      id: Math.random().toString(36).substr(2, 9),
      status: "Draft",
      students: 0,
      ...examData,
    };
    MOCK_EXAMS = [newExam, ...MOCK_EXAMS];
    return newExam;
  },

  getExamById: async (id) => {
    await new Promise((res) => setTimeout(res, 150));
    const exam = MOCK_EXAMS.find((e) => e.id === id);
    if (!exam) throw new Error("Exam not found");
    return exam;
  },
  updateExam: async ({ id, ...data }) => {
    await new Promise((res) => setTimeout(res, 300));
    MOCK_EXAMS = MOCK_EXAMS.map((e) => (e.id === id ? { ...e, ...data } : e));
    return MOCK_EXAMS.find((e) => e.id === id);
  },
};


