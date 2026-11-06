const CLASS_BRIEF_SELECT = {
  id: true,
  name: true,
  grade: true,
  section: true,
  academicYear: true,
};

const TEACHER_PROFILE_SELECT = {
  id: true,
  employeeId: true,
  qualifications: true,
  hireDate: true,
  departmentId: true,
};

const TEACHER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  isActive: true,
  createdAt: true,
  teacherProfile: { select: TEACHER_PROFILE_SELECT },
  homeroomClasses: {
    select: CLASS_BRIEF_SELECT,
    orderBy: [{ academicYear: "desc" }, { grade: "asc" }, { section: "asc" }],
  },
};

module.exports = {
  CLASS_BRIEF_SELECT,
  TEACHER_SELECT,
};
