require("dotenv/config");
const prisma = require("../config/prisma");

const base = "http://localhost:5000/api/v1";
const stamp = Date.now();

const login = async (email, password) => {
  const response = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`login ${response.status}`);
  return body.accessToken;
};

const call = async (token, path, method = "GET", payload) => {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
};

const main = async () => {
  const admin = await login(
    process.env.SEED_ADMIN_EMAIL || "admin@demo.com",
    process.env.SEED_ADMIN_PASSWORD || "Admin123!",
  );
  const student = await login(
    process.env.SEED_STUDENT_EMAIL || "student@demo.com",
    process.env.SEED_STUDENT_PASSWORD || "Student123!",
  );
  const email = `table.teacher.${stamp}@example.com`;
  const created = await call(admin, "/admin/teachers", "POST", {
    firstName: "Table",
    lastName: "Check",
    email,
    password: "Teacher123!",
    phone: "0911777000",
    employeeId: `TBL-${stamp}`,
    qualifications: "BEd",
    hireDate: "2025-02-01",
  });
  const id = created.body?.data?.id;
  const saved = id
    ? await prisma.user.findFirst({
        where: { id },
        select: {
          role: true,
          schoolId: true,
          isActive: true,
          teacherProfile: { select: { employeeId: true, schoolId: true } },
        },
      })
    : null;
  const active = await call(admin, "/admin/teachers?isActive=true&search=Table%20Check&limit=5");
  const updated = await call(admin, `/admin/teachers/${id}`, "PATCH", {
    phone: "0911777111",
  });
  const viewed = await call(admin, `/admin/teachers/${id}`);
  const inactive = await call(admin, `/admin/teachers/${id}`, "DELETE");
  const inactiveList = await call(
    admin,
    `/admin/teachers?isActive=false&search=TBL-${stamp}&limit=5`,
  );
  const students = await call(admin, "/students?page=1&limit=7");
  const denied = await call(student, "/admin/teachers");
  const hidden = await prisma.user.findFirst({
    where: { id, schoolId: "00000000-0000-4000-8000-000000000001" },
    select: { id: true },
  });

  console.log(
    JSON.stringify(
      {
        create: created.status,
        saved: saved
          ? {
              role: saved.role,
              sameSchool: saved.schoolId === saved.teacherProfile?.schoolId,
              employeeId: Boolean(saved.teacherProfile?.employeeId),
            }
          : null,
        activeFound: (active.body?.data || []).some((row) => row.id === id),
        updatePhone: updated.body?.data?.phone,
        viewEmail: viewed.body?.data?.email === email,
        deactivate: inactive.body?.data?.isActive,
        inactiveFound: (inactiveList.body?.data || []).some((row) => row.id === id),
        students: students.status,
        studentTotal: students.body?.meta?.total,
        studentDenied: denied.status,
        otherSchoolRow: hidden === null,
      },
      null,
      2,
    ),
  );
};

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
