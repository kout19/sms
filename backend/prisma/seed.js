const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const prisma = require("../config/prisma");
const { hashPassword } = require("../modules/users/user.helpers");

const DEMO_SCHOOL_ID = "11111111-1111-1111-1111-111111111111";

const seedUsers = [
  {
    id: "22222222-2222-2222-2222-222222222222",
    firstName: "Super",
    lastName: "Admin",
    email: process.env.SEED_SUPER_ADMIN_EMAIL || "superadmin@demo.com",
    password: process.env.SEED_SUPER_ADMIN_PASSWORD || "SuperAdmin123!",
    role: "super_admin",
    schoolId: null,
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    firstName: "School",
    lastName: "Admin",
    email: process.env.SEED_ADMIN_EMAIL || "admin@demo.com",
    password: process.env.SEED_ADMIN_PASSWORD || "Admin123!",
    role: "admin",
    schoolId: DEMO_SCHOOL_ID,
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    firstName: "Demo",
    lastName: "Teacher",
    email: process.env.SEED_TEACHER_EMAIL || "teacher@demo.com",
    password: process.env.SEED_TEACHER_PASSWORD || "Teacher123!",
    role: "teacher",
    schoolId: DEMO_SCHOOL_ID,
    teacherProfile: {
      create: {
        departmentId: null,
        hireDate: new Date("2023-09-01"),
        qualifications: "BSc Mathematics",
        employeeId: "EMP-1001",
      },
    },
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    firstName: "Demo",
    lastName: "Parent",
    email: process.env.SEED_PARENT_EMAIL || "parent@demo.com",
    password: process.env.SEED_PARENT_PASSWORD || "Parent123!",
    role: "parent",
    schoolId: DEMO_SCHOOL_ID,
  },
  {
    // ✅ the ONLY student entry — has the profile
    id: "10000000-1000-1000-1000-100000000000",
    firstName: "Demo",
    lastName: "Student",
    email: process.env.SEED_STUDENT_EMAIL || "student@demo.com",
    password: process.env.SEED_STUDENT_PASSWORD || "Student123!",
    role: "student",
    schoolId: DEMO_SCHOOL_ID,
    studentProfile: {
      create: {
        admissionNo: "STD-2026-001",
        dateOfBirth: new Date("2010-05-14"),
        gender: "male",
        enrollmentDate: new Date("2026-09-01"),
        guardianName: "Abebe Bekele",
        guardianPhone: "+251911000001",
        guardianEmail: "parent@demo.com",
      },
    },
  },
  {
    id: "88888888-8888-8888-8888-888888888888",
    firstName: "Demo",
    lastName: "Department Head",
    email: process.env.SEED_DEPARTMENT_EMAIL || "department@demo.com",
    password: process.env.SEED_DEPARTMENT_PASSWORD || "Department123!",
    role: "department_head",
    schoolId: DEMO_SCHOOL_ID,
  },
  {
    id: "99999999-9999-9999-9999-999999999999",
    firstName: "Demo",
    lastName: "Accountant",
    email: process.env.SEED_ACCOUNTANT_EMAIL || "accountant@demo.com",
    password: process.env.SEED_ACCOUNTANT_PASSWORD || "Accountant123!",
    role: "accountant",
    schoolId: DEMO_SCHOOL_ID,
  },
];

async function main() {
  await prisma.school.upsert({
    where: { id: DEMO_SCHOOL_ID },
    update: {},
    create: {
      id: DEMO_SCHOOL_ID,
      name: "Demo International School",
      slug: "demo-international-school",
      isActive: true,
    },
  });

  const demoClass = await prisma.class.upsert({
    where: {
      schoolId_grade_section_academicYear: {
        schoolId: DEMO_SCHOOL_ID,
        grade: "10",
        section: "A",
        academicYear: "2026-2027",
      },
    },
    update: {},
    create: {
      schoolId: DEMO_SCHOOL_ID,
      name: "Grade 10A",
      grade: "10",
      section: "A",
      academicYear: "2026-2027",
      capacity: 40,
    },
  });

  for (const userData of seedUsers) {
    const passwordHash = await hashPassword(userData.password);

    const createData = {
      id: userData.id,
      schoolId: userData.schoolId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email.toLowerCase(),
      passwordHash,
      role: userData.role,
      isActive: true,
      isEmailVerified: true,
    };

    // Attach teacherProfile if this user has one
    if (userData.teacherProfile) {
      createData.teacherProfile = userData.teacherProfile;
    }

    // Attach studentProfile if this user has one, injecting the demoClass.id
    if (userData.studentProfile) {
      createData.studentProfile = {
        create: {
          ...userData.studentProfile.create,
          classId: demoClass.id,
        },
      };
    }

    await prisma.user.upsert({
      where: { email: userData.email.toLowerCase() },
      update: {},
      create: createData,
    });

    console.log(`User created: ${userData.email}`);
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
