// One source of truth for status styling - used by the table pill,
// the "Set Status" dropdown dots, and the Today's Breakdown bars,
// so all three can never visually disagree with each other.
export const ATTENDANCE_STATUSES = {
  present: {
    label: "Present",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    bar: "bg-emerald-500",
  },
  absent: {
    label: "Absent",
    dot: "bg-rose-500",
    text: "text-rose-700",
    bg: "bg-rose-50",
    bar: "bg-rose-500",
  },
  late: {
    label: "Late",
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    bar: "bg-amber-500",
  },
  excused: {
    label: "Excused",
    dot: "bg-sky-500",
    text: "text-sky-700",
    bg: "bg-sky-50",
    bar: "bg-sky-500",
  },
};
