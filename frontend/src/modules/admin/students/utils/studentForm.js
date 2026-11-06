const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emptyStudentForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  admissionNo: "",
  dateOfBirth: "",
  gender: "",
  enrollmentDate: "",
  classId: "",
  previousSchool: "",
  address: "",
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  medicalNotes: "",
  isActive: true,
};

export const toDateInput = (value) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

export const studentToForm = (student) => {
  const profile = student?.studentProfile || {};
  return {
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    email: student?.email || "",
    password: "",
    phone: student?.phone || "",
    admissionNo: profile.admissionNo || "",
    dateOfBirth: toDateInput(profile.dateOfBirth),
    gender: profile.gender || "",
    enrollmentDate: toDateInput(profile.enrollmentDate),
    classId: profile.class?.id || "",
    previousSchool: profile.previousSchool || "",
    address: profile.address || "",
    guardianName: profile.guardianName || "",
    guardianPhone: profile.guardianPhone || "",
    guardianEmail: profile.guardianEmail || "",
    medicalNotes: profile.medicalNotes || "",
    isActive: student?.isActive ?? true,
  };
};

export const validateStudentForm = (form, mode) => {
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
  if (form.guardianEmail && !EMAIL_PATTERN.test(form.guardianEmail.trim())) {
    errors.guardianEmail = "Enter a valid guardian email.";
  }
  if (form.dateOfBirth && form.dateOfBirth > new Date().toISOString().slice(0, 10)) {
    errors.dateOfBirth = "Date of birth must be in the past.";
  }

  return errors;
};

export const toStudentPayload = (form, mode) => {
  const payload = {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    admissionNo: form.admissionNo.trim(),
    dateOfBirth: form.dateOfBirth || null,
    gender: form.gender || null,
    enrollmentDate: form.enrollmentDate || null,
    classId: form.classId || null,
    previousSchool: form.previousSchool.trim(),
    address: form.address.trim(),
    guardianName: form.guardianName.trim(),
    guardianPhone: form.guardianPhone.trim(),
    guardianEmail: form.guardianEmail.trim(),
    medicalNotes: form.medicalNotes.trim(),
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

export const studentClassLabel = (student) => {
  const schoolClass = student?.studentProfile?.class;
  if (!schoolClass) return "Unassigned";
  return `${schoolClass.grade}${schoolClass.section} · ${schoolClass.academicYear}`;
};

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
