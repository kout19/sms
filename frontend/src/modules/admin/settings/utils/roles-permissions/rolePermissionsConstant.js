
export const ACTION_COLUMNS = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "approve", label: "Approve" },
  { key: "export", label: "Export" },
  { key: "publish", label: "Publish" },
  { key: "send", label: "Send" },
  { key: "generate", label: "Generate" },
  { key: "upload", label: "Upload" },
  { key: "download", label: "Download" },
  { key: "suspend", label: "Suspend" },
  { key: "changeRole", label: "Change Role" },
];

export const PERMISSION_CATEGORIES = [
  { key: "dashboard", label: "Dashboard" },
  { key: "students", label: "Students" },
  { key: "teachers", label: "Teachers" },
  { key: "parents", label: "Parents" },
  { key: "classes", label: "Classes" },
  { key: "subjects", label: "Subjects" },
  { key: "attendance", label: "Attendance" },
  { key: "assignments", label: "Assignments" },
  { key: "grades", label: "Grades" },
  { key: "exams", label: "Exams" },
  { key: "schedule", label: "Schedule" },
  { key: "announcements", label: "Announcements" },
  { key: "messages", label: "Messages" },
  { key: "finance", label: "Finance" },
  { key: "reports", label: "Reports" },
  { key: "documents", label: "Documents" },
  { key: "settings", label: "Settings" },
  { key: "userManagement", label: "User Management" },
];

// Summary stat pills shown on each role card - only these 4 actions get
// a card-level count, matching the screenshot.
export const CARD_SUMMARY_ACTIONS = ["view", "create", "edit", "delete"];