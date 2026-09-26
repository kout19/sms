export const ACCOUNT_STATUS_STYLES = {
  active: { label: "Active", bg: "bg-emerald-50", text: "text-emerald-700" },
  inactive: { label: "Inactive", bg: "bg-gray-100", text: "text-gray-600" },
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700" },
  suspended: { label: "Suspended", bg: "bg-rose-50", text: "text-rose-700" },
};

// MVP roles only - "Authorized Staff" intentionally excluded until it's a
// real, decided role in @packages/shared and the Prisma UserRole enum.
export const ASSIGNABLE_ROLES = [
  "admin",
  "teacher",
  "department_head",
  "accountant",
  "student",
  "parent",
];

export const DEPARTMENT_OPTIONS = [
  "Science",
  "Mathematics",
  "English",
  "History",
  "Administration",
  "Finance",
  "IT",
];
