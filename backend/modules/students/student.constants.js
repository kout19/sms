const classOnStudent = {
  select: {
    id: true,
    name: true,
    grade: true,
    section: true,
    academicYear: true,
  },
};

const STUDENT_LIST_SELECT = {
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
      class: classOnStudent,
    },
  },
};

const STUDENT_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  studentProfile: {
    select: {
      admissionNo: true,
      dateOfBirth: true,
      gender: true,
      enrollmentDate: true,
      previousSchool: true,
      medicalNotes: true,
      address: true,
      guardianName: true,
      guardianPhone: true,
      guardianEmail: true,
      class: classOnStudent,
    },
  },
};

const CLASS_SELECT = {
  id: true,
  name: true,
  grade: true,
  section: true,
  academicYear: true,
  capacity: true,
};

const IMPORT_HEADERS = [
  "firstName",
  "lastName",
  "email",
  "password",
  "phone",
  "admissionNo",
  "dateOfBirth",
  "gender",
  "enrollmentDate",
  "grade",
  "section",
  "academicYear",
  "guardianName",
  "guardianPhone",
  "guardianEmail",
  "address",
  "previousSchool",
  "medicalNotes",
];

const MAX_IMPORT_ROWS = 100;
const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

module.exports = {
  STUDENT_SELECT,
  STUDENT_LIST_SELECT,
  CLASS_SELECT,
  IMPORT_HEADERS,
  MAX_IMPORT_ROWS,
  MAX_IMPORT_BYTES,
};
