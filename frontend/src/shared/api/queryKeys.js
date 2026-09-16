// We are creating the query keys for the React Query library, used for caching and invalidating queries.
export function makeResourceKeys(resource) {
  return {
    all: [resource],
    lists: () => [resource, "list"],
    list: (filters = {}) => [resource, "list", filters],
    details: () => [resource, "detail"],
    detail: (id) => [resource, "detail", id],
    dashboard:(filters = {}) => [resource, "dashboard", filters],
    create: () => [resource, "create"],
    update: () => [resource, "update"],
    delete: () => [resource, "delete"],
    search: () => [resource, "search"],
    status: () => [resource, "status"],
    export: () => [resource, "export"],
    import: () => [resource, "import"],
    upload: () => [resource, "upload"],
    download: () => [resource, "download"],
    downloadAll: () => [resource, "download-all"],

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
export const attendanceKeys = makeResourceKeys("attendances");
export const parentKeys = makeResourceKeys("parents");
export const termKeys = makeResourceKeys("terms");
export const userKeys = makeResourceKeys("users");
export const scheduleKeys = makeResourceKeys("schedules");
export const feeKeys = makeResourceKeys("fees");
export const paymentKeys = makeResourceKeys("payments");
export const reportKeys = makeResourceKeys("reports");
export const documentKeys = makeResourceKeys("documents");
export const departmentKeys = makeResourceKeys("departments");
export const rolePermissionKeys = makeResourceKeys("role-permissions");
export const accountantKeys = makeResourceKeys("accountants");
export const transactionKeys = makeResourceKeys("transactions");
export const schoolHealthKeys = makeResourceKeys("school-health");
export const overviewKeys = makeResourceKeys("overview");


