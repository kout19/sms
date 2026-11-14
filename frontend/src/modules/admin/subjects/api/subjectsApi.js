import apiAxios from "../../../../shared/api/axios";

const BASE = "/admin/subjects";

const normalizeTeacherName = (teacher) => {
  if (!teacher) return "";
  if (teacher.fullName) return teacher.fullName;
  if (teacher.firstName || teacher.lastName) {
    return `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim();
  }
  return teacher.name || "";
};

const normalizeSubject = (subject) => {
  const grades = [
    ...new Set((subject.classes || []).map((classItem) => classItem.grade)),
  ];
  const teacher = Array.isArray(subject.teachers) && subject.teachers.length
    ? subject.teachers[0]
    : null;
  const teacherName = normalizeTeacherName(teacher);

  return {
    ...subject,
    department: subject.department?.name || "Unassigned",
    grade: grades.length ? grades.map((grade) => `Grade ${grade}`).join(", ") : "N/A",
    status: subject.isActive ? "Active" : "Inactive",
    teacher: teacherName
      ? {
          name: teacherName,
          initials: teacherName
            .split(" ")
            .map((part) => part[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase(),
        }
      : null,
  };
};

export const getAllSubjects = async (filters = {}) => {
  const academicYear = filters.academicYear;
  const departmentId = filters.departmentId;
  const response = await apiAxios.get(BASE, {
    params: {
      search: filters.search,
      departmentId:
        departmentId && departmentId !== "All" ? departmentId : undefined,
      classId: filters.classId,
      academicYear:
        academicYear && academicYear !== "All" ? academicYear : undefined,
      status: filters.status && filters.status !== "All" ? filters.status.toLowerCase() : undefined,
      isActive: filters.isActive,
      page: filters.page,
      limit: filters.limit,
    },
  });

  const payload = response?.data ?? {};
  const items = Array.isArray(payload.data)
    ? payload.data
    : Array.isArray(payload.items)
      ? payload.items
      : null;
  if (!items) {
    throw new Error("The subjects API returned an invalid response.");
  }

  return {
    items: items.map(normalizeSubject),
    total: Number(payload.meta?.total ?? payload.total ?? items.length),
    page: Number(payload.meta?.page ?? filters.page ?? 1),
    totalPages: Number(payload.meta?.totalPages ?? 1),
    stats: {
      totalSubjects: Number(
        payload.stats?.totalSubjects ?? payload.meta?.total ?? items.length,
      ),
      activeSubjects: Number(
        payload.stats?.activeSubjects ??
          items.filter((subject) => subject.isActive).length,
      ),
      assignedSubjects: Number(
        payload.stats?.assignedSubjects ??
          items.filter(
            (subject) =>
              Array.isArray(subject.teachers) && subject.teachers.length,
          ).length,
      ),
      departments: Number(
        payload.stats?.departments ??
          new Set(items.map((subject) => subject.department || "Unassigned"))
            .size,
      ),
    },
  };
};

export const getSubjectOptions = async () => {
  const response = await apiAxios.get(`${BASE}/options`);
  const options = response?.data?.data;

  if (
    !Array.isArray(options?.departments) ||
    !Array.isArray(options?.classes) ||
    !Array.isArray(options?.teachers)
  ) {
    throw new Error("The subject options API returned an invalid response.");
  }

  return options;
};

export const createSubject = async (payload) => {
  const response = await apiAxios.post(BASE, payload);
  return normalizeSubject(response?.data?.data ?? response?.data ?? payload);
};

export const toggleSubjectStatus = async (id) => {
  const response = await apiAxios.patch(`${BASE}/${id}/status`);
  return normalizeSubject(response?.data?.data ?? response?.data ?? {});
};

export const deleteSubject = async (id) => {
  await apiAxios.delete(`${BASE}/${id}`);
  return id;
};

export const updateSubject = async ({ id, ...payload }) => {
  const response = await apiAxios.patch(`${BASE}/${id}`, payload);
  return normalizeSubject(response?.data?.data ?? response?.data ?? {});
};