require("dotenv/config");
const prisma = require("../config/prisma");
const teacherService = require("../modules/teachers/teacher.service");

const base = "http://localhost:5000/api/v1";
const stamp = Date.now();

const login = async (email, password) => {
  const response = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`Login ${email} ${response.status} ${body.message}`);
  return body.accessToken;
};

const request = async (token, method, path, payload) => {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const text = await response.text();
  let body = {};
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text };
    }
  }
  return { status: response.status, body };
};

const teacherPayload = (suffix, employeeId) => ({
  firstName: "Phase",
  lastName: suffix,
  email: `phase2.${suffix}.${stamp}@example.com`.toLowerCase(),
  password: "Teacher123!",
  phone: "0911000000",
  employeeId,
  qualifications: "BEd Mathematics",
  hireDate: "2024-09-01",
});

const main = async () => {
  const admin = await login(
    process.env.SEED_ADMIN_EMAIL || "admin@demo.com",
    process.env.SEED_ADMIN_PASSWORD || "Admin123!",
  );
  const student = await login(
    process.env.SEED_STUDENT_EMAIL || "student@demo.com",
    process.env.SEED_STUDENT_PASSWORD || "Student123!",
  );

  const created = await request(admin, "POST", "/admin/teachers", teacherPayload("Ada", `EMP-${stamp}`));
  const second = await request(admin, "POST", "/admin/teachers", teacherPayload("Bea", `EMP-${stamp}-B`));
  const duplicateEmployee = await request(
    admin,
    "POST",
    "/admin/teachers",
    teacherPayload("Cam", `emp-${stamp}`),
  );
  const duplicateEmail = await request(admin, "POST", "/admin/teachers", {
    ...teacherPayload("Dee", `EMP-${stamp}-D`),
    email: created.body?.data?.email,
  });
  const schoolInBody = await request(admin, "POST", "/admin/teachers", {
    ...teacherPayload("Eve", `EMP-${stamp}-E`),
    schoolId: "00000000-0000-4000-8000-000000000099",
  });
  const department = await request(admin, "POST", "/admin/teachers", {
    ...teacherPayload("Fay", `EMP-${stamp}-F`),
    departmentId: "00000000-0000-4000-8000-000000000088",
  });
  const shortPassword = await request(admin, "POST", "/admin/teachers", {
    ...teacherPayload("Gio", `EMP-${stamp}-G`),
    password: "short",
  });

  const id = created.body?.data?.id;
  const listed = await request(
    admin,
    "GET",
    `/admin/teachers?search=${encodeURIComponent(`EMP-${stamp}`)}&page=1&limit=1`,
  );
  const byName = await request(admin, "GET", "/admin/teachers?search=Phase%20Ada&page=1&limit=5");
  const one = await request(admin, "GET", `/admin/teachers/${id}`);
  const updated = await request(admin, "PATCH", `/admin/teachers/${id}`, {
    phone: "0911222333",
    qualifications: "MEd Mathematics",
  });
  const badClass = await request(admin, "GET", "/admin/teachers?classId=not-a-uuid");
  const missing = await request(admin, "GET", "/admin/teachers?search=zz-no-teacher");
  const anonymous = await request(null, "GET", "/admin/teachers");
  const studentRead = await request(student, "GET", "/admin/teachers");
  const otherSchool = await teacherService.getTeacherById(
    "00000000-0000-4000-8000-000000000001",
    id,
  );
  const deactivated = await request(admin, "DELETE", `/admin/teachers/${second.body?.data?.id}`);
  const persisted = await prisma.user.findFirst({
    where: { id: second.body?.data?.id },
    select: { id: true, isActive: true, role: true, passwordHash: true, teacherProfile: { select: { id: true } } },
  });

  const leakedHash = JSON.stringify(created.body).includes("passwordHash");

  console.log(
    JSON.stringify(
      {
        create: created.status,
        createHasProfile: Boolean(created.body?.data?.teacherProfile?.employeeId),
        leakedHash,
        second: second.status,
        duplicateEmployee: duplicateEmployee.status,
        duplicateEmail: duplicateEmail.status,
        schoolInBody: schoolInBody.status,
        department: department.status,
        shortPassword: shortPassword.status,
        listTotal: listed.body?.meta?.total,
        listLimit: listed.body?.meta?.limit,
        fullNameFound: (byName.body?.data || []).some((row) => row.id === id),
        get: one.status,
        updatePhone: updated.body?.data?.phone,
        badClass: badClass.status,
        missingTotal: missing.body?.meta?.total,
        anonymous: anonymous.status,
        studentRead: studentRead.status,
        otherSchoolHidden: otherSchool === null,
        deactivate: deactivated.status,
        deactivateActive: deactivated.body?.data?.isActive,
        persisted: persisted
          ? {
              kept: Boolean(persisted.id && persisted.teacherProfile),
              isActive: persisted.isActive,
              role: persisted.role,
            }
          : null,
      },
      null,
      2,
    ),
  );
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
