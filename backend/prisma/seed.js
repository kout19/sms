require("dotenv").config();

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
    id: "66666666-6666-6666-6666-666666666666",
    firstName: "Demo",
    lastName: "Student",
    email: process.env.SEED_STUDENT_EMAIL || "student@demo.com",
    password: process.env.SEED_STUDENT_PASSWORD || "Student123!",
    role: "student",
    schoolId: DEMO_SCHOOL_ID,
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

  for (const userData of seedUsers) {
    const passwordHash = await hashPassword(userData.password);

    await prisma.user.upsert({
      where: { email: userData.email.toLowerCase() },
      update: {},
      create: {
        id: userData.id,
        schoolId: userData.schoolId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        passwordHash,
        role: userData.role,
        isActive: true,
        isEmailVerified: true,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
