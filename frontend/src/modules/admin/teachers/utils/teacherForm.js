const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emptyTeacherForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  employeeId: "",
  qualifications: "",
  hireDate: "",
  isActive: true,
};

export const toDateInput = (value) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

export const teacherToForm = (teacher) => {
  const profile = teacher?.teacherProfile || {};
  return {
    firstName: teacher?.firstName || "",
    lastName: teacher?.lastName || "",
    email: teacher?.email || "",
    password: "",
    phone: teacher?.phone || "",
    employeeId: profile.employeeId || "",
    qualifications: profile.qualifications || "",
    hireDate: toDateInput(profile.hireDate),
    isActive: teacher?.isActive ?? true,
  };
};

export const validateTeacherForm = (form, mode) => {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  if (!form.lastName.trim()) errors.lastName = "Last name is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = "Enter a valid email.";

  if (mode === "create" && form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (mode === "edit" && form.password && form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (form.hireDate && Number.isNaN(Date.parse(form.hireDate))) {
    errors.hireDate = "Enter a valid hire date.";
  }

  return errors;
};

export const toTeacherPayload = (form, mode) => {
  const payload = {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    employeeId: form.employeeId.trim(),
    qualifications: form.qualifications.trim(),
    hireDate: form.hireDate,
    isActive: Boolean(form.isActive),
  };

  if (mode === "create" || form.password) {
    payload.password = form.password;
  }

  return payload;
};

export const classOptionLabel = (schoolClass) =>
  schoolClass.name
    ? `${schoolClass.name} · ${schoolClass.academicYear}`
    : `${schoolClass.grade} ${schoolClass.section} · ${schoolClass.academicYear}`;

export const homeroomLabel = (schoolClass) =>
  `${schoolClass.grade}${schoolClass.section} · ${schoolClass.academicYear}`;

export const getApiError = (error) => {
  const data = error?.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors
      .map((item) => item.message || item)
      .filter(Boolean)
      .join(" ");
  }
  return data?.message || error?.message || "The request failed.";
};
