export const FEE_STATUS_STYLES = {
  Paid: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  Overdue: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
  Partial: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Pending: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
};

// Shared between the revenue donut/legend and any future fee-type filter -
// one color per category, defined once.
export const FEE_TYPE_COLORS = {
  Tuition: "#8b5cf6",
  Transport: "#10b981",
  "Meals & Canteen": "#f59e0b",
  Activity: "#3b82f6",
};

export const EXPENSE_CATEGORY_COLORS = {
  "Staff Salaries": "#f59e0b",
  Infrastructure: "#8b5cf6",
  "Academic Materials": "#3b82f6",
  Utilities: "#10b981",
  Other: "#9ca3af",
};
