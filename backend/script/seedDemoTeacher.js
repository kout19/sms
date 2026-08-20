// Add this into your existing scripts/seed.js, called AFTER your School
// and other demo users are seeded (it needs an existing school to attach to).
//
// If you're not using bcryptjs for password hashing, swap in whatever your
// actual auth module uses (argon2, etc.) - the important part is that this
// produces a hash your login endpoint's compare function actually validates.

const bcrypt = require("bcryptjs");

async function seedDemoTeacher(prisma) {
  const school = await prisma.school.findFirst();
  if (!school) {
    throw new Error("No school found - seed the demo School before calling seedDemoTeacher()");
  }

  const passwordHash = await bcrypt.hash("Teacher@123", 10);

  const teacher = await prisma.user.upsert({
    where: { email: "teacher.demo@school.test" },
    update: {}, // no-op on re-run, keeps this safely repeatable
    create: {
      schoolId: school.id,
      role: "teacher",
      firstName: "Selam",
      lastName: "Tesfaye",
      email: "teacher.demo@school.test",
      passwordHash,
      phone: "+251911000000",
      isActive: true,
      isEmailVerified: true,
      teacherProfile: {
        create: {
          departmentId: null,
          hireDate: new Date("2023-09-01"),
          qualifications: "BSc Mathematics",
          employeeId: "EMP-1001",
        },
      },
    },
    include: { teacherProfile: true },
  });

  console.log("Seeded demo teacher:", teacher.email, "(password: Teacher@123)");
  return teacher;
}

module.exports = { seedDemoTeacher };

// If seed.js runs as: async function main() { ... await seedDemoTeacher(prisma); }
// add the call there. If it's a flat script, just call seedDemoTeacher(prisma)
// after your school/admin seeding block, using your existing `prisma` instance -
// don't create a second PrismaClient here.