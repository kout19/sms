 const STUDENT_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  isActive: true,
  createdAt: true,
  studentProfile: {
    select: {
      admissionNo: true,
      dateOfBirth: true,
      gender: true,
      enrollmentDate: true,
      guardianName: true,
      guardianPhone: true,
      class: {
        select: { id: true, name: true, grade: true, section: true },
      },
    },
  },
};

module.exports = {
  STUDENT_SELECT,
};

