import { getTierStatus } from "@shared/utils/tieredStatus";

const ATTENDANCE_TIERS = [
  { key: "excellent", min: 90 },
  { key: "good", min: 85 },
  { key: "average", min: 75 },
  { key: "chronicAbsent", min: 0 },
];

export function getAttendanceStatus(rate) {
  return getTierStatus(rate, ATTENDANCE_TIERS);
}

export const ATTENDANCE_STATUS_STYLES = {
  excellent: {
    label: "Excellent",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  good: {
    label: "Good",
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-500",
  },
  average: {
    label: "Average",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  chronicAbsent: {
    label: "Chronic Absent",
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
  },
};

const ATTENDANCE_BAR_TIERS = [
  { key: "bg-emerald-500", min: 90 },
  { key: "bg-amber-500", min: 75 },
  { key: "bg-rose-500", min: 0 },
];

export function getAttendanceBarColor(rate) {
  return getTierStatus(rate, ATTENDANCE_BAR_TIERS);
}

export function extractGradeLabel(className) {
  const match = className.match(/^Grade \d+/);
  return match ? match[0] : className;
}
