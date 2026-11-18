const RECIPIENT_BATCH = 1000;

const SHORT_TX = { maxWait: 2_000, timeout: 5_000 };
const PUBLISH_TX = { maxWait: 5_000, timeout: 20_000 };

const chunk = (items, size) => {
  const batches = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
};

const normalizeAudience = (audience = {}) => {
  const rules = [];
  if (audience.allUsers) rules.push({ type: "all_users" });
  for (const role of new Set(audience.roles || [])) rules.push({ type: "role", role });
  for (const classId of new Set(audience.classIds || [])) rules.push({ type: "class", classId });
  for (const sectionId of new Set(audience.sectionIds || [])) rules.push({ type: "section", sectionId });
  return rules;
};

const endOfSuppliedDay = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return date;
  if (date.toISOString().endsWith("T00:00:00.000Z")) date.setUTCHours(23, 59, 59, 999);
  return date;
};

const expiryError = ({ expiresAt, scheduledFor, now = new Date() } = {}) => {
  if (expiresAt && new Date(expiresAt) <= now) return "Expiry must be in the future";
  if (expiresAt && scheduledFor && new Date(expiresAt) <= new Date(scheduledFor)) {
    return "Expiry must be after the scheduled publication time";
  }
  return null;
};

const currentYearSectionWhere = (schoolId, extra = {}) => ({
  schoolId,
  isActive: true,
  class: { is: { schoolId, isActive: true } },
  academicYear: { is: { schoolId, isActive: true, isCurrent: true } },
  ...extra,
});

module.exports = {
  RECIPIENT_BATCH,
  SHORT_TX,
  PUBLISH_TX,
  chunk,
  normalizeAudience,
  endOfSuppliedDay,
  expiryError,
  currentYearSectionWhere,
};
