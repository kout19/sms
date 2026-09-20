export const AUDIENCE_OPTIONS = [
  { value: "everyone", label: "Everyone" },
  { value: "teachers", label: "Teachers" },
  { value: "students", label: "Students" },
  { value: "parents", label: "Parents" },
];

export const PRIORITY_STYLES = {
  normal: {
    label: "Normal",
    bg: "bg-gray-100",
    text: "text-gray-600",
    accent: "border-gray-300",
  },
  important: {
    label: "Important",
    bg: "bg-amber-50",
    text: "text-amber-700",
    accent: "border-amber-400",
  },
  urgent: {
    label: "Urgent",
    bg: "bg-rose-50",
    text: "text-rose-700",
    accent: "border-rose-400",
  },
};

export const STATUS_STYLES = {
  draft: { label: "Draft", bg: "bg-gray-100", text: "text-gray-600" },
  scheduled: { label: "Scheduled", bg: "bg-sky-50", text: "text-sky-700" },
  published: {
    label: "Published",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  archived: { label: "Archived", bg: "bg-amber-50", text: "text-amber-700" },
};
