const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emptyAccountantForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
};

export const accountantToForm = (accountant) => ({
  firstName: accountant?.firstName || "",
  lastName: accountant?.lastName || "",
  email: accountant?.email || "",
  phone: accountant?.phone || "",
  password: "",
});

export const validateAccountantForm = (form, mode) => {
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

  return errors;
};

export const toAccountantPayload = (form, mode) => {
  const payload = {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim(),
  };
  if (mode === "create" || form.password) payload.password = form.password;
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
