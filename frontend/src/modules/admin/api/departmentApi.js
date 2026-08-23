// frontend/src/modules/admin/api/departmentApi.js
//
// MOCK DATA for now - backend/modules/departments/ doesn't exist yet.
// When it's built (follow the same routes/controller/service/validation
// pattern as teachers), swap the function bodies below for real apiAxios
// calls. Nothing in useDepartments.js or the components needs to change
// when that happens - same contract, same shape.

import apiAxios from "../../../shared/api/axios";
const MOCK_DEPARTMENTS = [
  {
    id: "d1",
    code: "D-001",
    name: "Mathematics",
    icon: "ruler",
    head: "Dr. Robert Williams",
    teacherCount: 14,
    studentCount: 412,
    subjects: ["Algebra", "Calculus", "Statistics", "Geometry", "Trigonometry"],
    isActive: true,
  },
  {
    id: "d2",
    code: "D-002",
    name: "Science",
    icon: "microscope",
    head: "Prof. Linda Osei",
    teacherCount: 18,
    studentCount: 487,
    subjects: ["Physics", "Chemistry", "Biology", "Earth Science"],
    isActive: true,
  },
  {
    id: "d3",
    code: "D-003",
    name: "English Language",
    icon: "book-open",
    head: "Ms. Claire Dubois",
    teacherCount: 11,
    studentCount: 398,
    subjects: ["Literature", "Grammar", "Creative Writing", "Public Speaking"],
    isActive: true,
  },
  {
    id: "d4",
    code: "D-004",
    name: "Social Studies",
    icon: "globe",
    head: "Mr. Kwame Asante",
    teacherCount: 9,
    studentCount: 320,
    subjects: ["History", "Geography", "Civics", "Economics"],
    isActive: true,
  },
  {
    id: "d5",
    code: "D-005",
    name: "Computer Science",
    icon: "monitor",
    head: "Dr. Maya Patel",
    teacherCount: 7,
    studentCount: 234,
    subjects: ["Programming", "Data Structures", "Web Dev", "Databases"],
    isActive: true,
  },
  {
    id: "d6",
    code: "D-006",
    name: "Physical Education",
    icon: "dumbbell",
    head: "Coach Brian Torres",
    teacherCount: 6,
    studentCount: 560,
    subjects: ["Athletics", "Team Sports", "Fitness", "Health"],
    isActive: true,
  },
  {
    id: "d7",
    code: "D-007",
    name: "Arts & Music",
    icon: "palette",
    head: null,
    teacherCount: 5,
    studentCount: 187,
    subjects: ["Visual Arts", "Choir", "Band", "Theatre"],
    isActive: false,
  },
  {
    id: "d8",
    code: "D-008",
    name: "Foreign Languages",
    icon: "languages",
    head: "Dr. Carlos Mendez",
    teacherCount: 8,
    studentCount: 215,
    subjects: ["Spanish", "French", "Mandarin", "German"],
    isActive: true,
  },
];

export const getAllDepartments = async (filters = {}) => {
  // const response = await apiAxios.get("/admin/departments", { params: filters });
  // return response.data.data;
  await new Promise((r) => setTimeout(r, 200)); // simulate network delay
  let results = MOCK_DEPARTMENTS;
  if (filters.status && filters.status !== "all") {
    results = results.filter((d) =>
      filters.status === "active" ? d.isActive : !d.isActive,
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter((d) => d.name.toLowerCase().includes(q));
  }
  return results;
};

export const createDepartment = async (payload) => {

  return {
    id: crypto.randomUUID(),
    teacherCount: 0,
    studentCount: 0,
    subjects: [],
    isActive: true,
    ...payload,
  };
};

export const toggleDepartmentStatus = async (id) => {
  const dept = MOCK_DEPARTMENTS.find((d) => d.id === id);
  if (dept) dept.isActive = !dept.isActive; // mutating the mock array directly - local testing only, real backend won't work this way
  return dept;
};