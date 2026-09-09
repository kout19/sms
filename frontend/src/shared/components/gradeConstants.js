export function getLetterGrade(score) {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

export function getPerformanceStatus(score) {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  return "atRisk";
}

// Status pill colors and score-bar colors are intentionally DIFFERENT palettes
// (matches the screenshot: mid-range bars are amber, but the "Good" pill is blue)
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

export function getScoreBarColor(score) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-rose-500";
}
