// We are creating the query keys for the React Query library, used for caching and invalidating queries.
function makeResourceKeys(resource) {
  return {
    all: [resource],
    lists: () => [resource, "list"],
    list: (filters = {}) => [resource, "list", filters],
    details: () => [resource, "detail"],
    detail: (id) => [resource, "detail", id],
  };
}

export const teacherKeys = makeResourceKeys("teachers"); // we are creating the query keys for the teachers resource
export const studentKeys = makeResourceKeys("students");
export const classKeys = makeResourceKeys("classes");
export const announcementKeys = makeResourceKeys("announcements");
export const messageKeys = makeResourceKeys("messages");
export const subjectKeys = makeResourceKeys("subjects");
export const assignmentKeys = makeResourceKeys("assignments");
export const gradeKeys = makeResourceKeys("grades");
export const attendanceKeys = makeResourceKeys("attendance");
export const parentKeys = makeResourceKeys("parents");
export const termKeys = makeResourceKeys("terms");
export const userKeys = makeResourceKeys("users");
export const scheduleKeys = makeResourceKeys("schedule");
export const feeKeys = makeResourceKeys("fees");
export const paymentKeys = makeResourceKeys("payments")
export const reportKeys = makeResourceKeys("reports")
export const documentKeys = makeResourceKeys("documents")
export const departmentKeys = makeResourceKeys("departments")
export const rolePermissionKeys = makeResourceKeys("role-permissions")
