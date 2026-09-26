export const COUNTRY_OPTIONS = [
  "Ethiopia",
  "Kenya",
  "Nigeria",
  "Ghana",
  "South Africa",
];
export const LANGUAGE_OPTIONS = ["English", "Amharic", "Oromo"];
export const CURRENCY_OPTIONS = ["ETB", "USD", "KES", "NGN"];
export const TIMEZONE_OPTIONS = [
  "Africa/Addis_Ababa",
  "Africa/Nairobi",
  "Africa/Lagos",
  "UTC",
];
export const DATE_FORMAT_OPTIONS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];
export const TIME_FORMAT_OPTIONS = ["12-hour", "24-hour"];
export const GRADING_SYSTEM_OPTIONS = [
  "Percentage",
  "Letter Grade (A-F)",
  "GPA (4.0 scale)",
];
export const TERM_COUNT_OPTIONS = [2, 3, 4];

export const NOTIFICATION_CATEGORIES = [
  "Announcements",
  "Messages",
  "Attendance",
  "Assignments",
  "Grades",
  "Payments",
  "System Notifications",
];
export const NOTIFICATION_CHANNELS = [
  { key: "email", label: "Email" },
  { key: "inApp", label: "In-App" },
  { key: "sms", label: "SMS" },
];

export const SETTINGS_TABS = [
  { key: "general", label: "General", path: "/admin/settings/general" },
  { key: "users", label: "User Management", path: "/admin/settings/user-management" },
  { key: "roles", label: "Role & Permission", path: "/admin/settings/roles-permissions" },
];
