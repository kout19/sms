const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emptyParentForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
};

export const parentToForm = (parent) => ({
  firstName: parent?.firstName || "",
  lastName: parent?.lastName || "",
  email: parent?.email || "",
  password: "",
  phone: parent?.phone || "",
});

export const validateParentForm = (form, mode) => {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  if (!form.lastName.trim()) errors.lastName = "Last name is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (mode === "create" && form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (form.password && form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (form.password.length > 72) {
    errors.password = "Password must be 72 characters or fewer.";
  }
  if (form.phone.length > 30) errors.phone = "Phone must be 30 characters or fewer.";
  return errors;
};

export const toParentPayload = (form, mode, students) => {
  const payload = {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim() || null,
    students,
  };
  if (mode === "create") payload.password = form.password;
  return payload;
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
