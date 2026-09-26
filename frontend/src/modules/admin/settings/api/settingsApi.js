import apiAxios from "@shared/api/axios";

const BASE = "/admin/settings/general";
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

let MOCK_GENERAL_SETTINGS = {
  school: {
    logoUrl: null,
    name: "Addis Ababa International School",
    code: "AAIS-2026",
    email: "info@aais.edu.et",
    phone: "+251 11 234 5678",
    website: "www.aais.edu.et",
    country: "Ethiopia",
    address: "Bole Sub-City, Woreda 03",
    city: "Addis Ababa",
    region: "Addis Ababa",
  },
  academic: {
    academicYear: "2026-2027",
    currentTerm: "Term 1",
    numberOfTerms: 3,
    gradingSystem: "Percentage",
    passingScore: 50,
    startDate: "2026-09-01",
    endDate: "2027-06-30",
  },
  localization: {
    language: "English",
    timeZone: "Africa/Addis_Ababa",
    currency: "ETB",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12-hour",
  },
  attendance: {
    enableAttendance: true,
    allowTeachersToMark: true,
    lateThresholdMinutes: 15,
    absenceNotification: true,
    parentAttendanceNotifications: true,
  },
  notifications: {
    Announcements: { email: true, inApp: true, sms: false },
    Messages: { email: true, inApp: true, sms: false },
    Attendance: { email: true, inApp: true, sms: true },
    Assignments: { email: false, inApp: true, sms: false },
    Grades: { email: true, inApp: true, sms: false },
    Payments: { email: true, inApp: true, sms: true },
    "System Notifications": { email: true, inApp: false, sms: false },
  },
  security: {
    sessionTimeoutMinutes: 30,
    requireStrongPasswords: true,
    twoFactorAuth: false,
    loginNotifications: true,
    passwordExpirationDays: 90,
    failedLoginAttempts: 5,
  },
};

export const getGeneralSettings = async () => {
  // TODO: const response = await apiAxios.get(BASE); return response.data.data;
  await delay();
  return structuredClone(MOCK_GENERAL_SETTINGS);
};

export const updateGeneralSettings = async (payload) => {
  // TODO: const response = await apiAxios.put(BASE, payload); return response.data.data;
  await delay(300);
  MOCK_GENERAL_SETTINGS = structuredClone(payload);
  return MOCK_GENERAL_SETTINGS;
};
