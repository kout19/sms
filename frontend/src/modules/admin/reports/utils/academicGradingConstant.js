import { getTierStatus } from "@shared/utils/tieredStatus";
export { getLetterGrade } from "@shared/utils/grading";

const PERFORMANCE_TIERS = [
  { key: "excellent", min: 80 },
  { key: "good", min: 60 },
  { key: "atRisk", min: 0 },
];

export function getPerformanceStatus(score) {
  return getTierStatus(score, PERFORMANCE_TIERS);
}

export const STATUS_STYLES = {
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
  atRisk: {
    label: "At Risk",
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
  },
};

const BAR_COLOR_TIERS = [
  { key: "bg-emerald-500", min: 80 },
  { key: "bg-amber-500", min: 60 },
  { key: "bg-rose-500", min: 0 },
];

export function getScoreBarColor(score) {
  return getTierStatus(score, BAR_COLOR_TIERS);
}
