import apiAxios from "@shared/api/axios";
import { PERMISSION_CATEGORIES } from "../../utils/roles-permissions/rolePermissionsConstant";

const BASE = "/admin/settings/roles";
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

// Builds a full permission object with every category defaulted to all-false,
// then overrides with the `granted` map. This means every role always has
// a complete, uniform shape - no category is ever "missing" from a role's
// permissions, which is what makes rendering the matrix safe without
// defensive null-checks everywhere.
function buildPermissions(granted) {
  const permissions = {};
  for (const cat of PERMISSION_CATEGORIES) {
    permissions[cat.key] = {
      view: false,
      create: false,
      edit: false,
      delete: false,
      approve: false,
      export: false,
      publish: false,
      send: false,
      generate: false,
      upload: false,
      download: false,
      suspend: false,
      changeRole: false,
    };
    if (granted[cat.key]) {
      for (const action of granted[cat.key])
        permissions[cat.key][action] = true;
    }
  }
  return permissions;
}

// MOCK DATA - illustrative permission sets, not hand-copied pixel-for-pixel
// from any single source. Card summary numbers are DERIVED from this data
// at render time (see RoleCard.jsx) - never hardcoded separately - so they
// can never drift out of sync with the matrix itself.
let MOCK_ROLES = [
  {
    id: "super_admin",
    name: "Super Admin",
    description:
      "Full unrestricted access to all system features and settings.",
    isSystem: true,
    userCount: 1,
    updatedAt: "2026-09-01",
    permissions: buildPermissions(
      (() => {
        const all = [
          "view",
          "create",
          "edit",
          "delete",
          "approve",
          "export",
          "publish",
          "send",
          "generate",
          "upload",
          "download",
          "suspend",
          "changeRole",
        ];
        const g = {};
        for (const cat of PERMISSION_CATEGORIES)
          g[cat.key] = cat.key === "dashboard" ? ["view"] : all;
        g.settings = all.filter((a) => a !== "delete"); // deleting "Settings" as a category has no real meaning
        return g;
      })(),
    ),
  },
  {
    id: "admin",
    name: "Admin",
    description:
      "Full school administration access with limited system settings.",
    isSystem: true,
    userCount: 24,
    updatedAt: "2026-09-15",
    permissions: buildPermissions({
      dashboard: ["view"],
      students: ["view", "create", "edit", "delete", "export"],
      teachers: ["view", "create", "edit", "delete", "export"],
      parents: ["view", "create", "edit", "delete"],
      classes: ["view", "create", "edit", "delete"],
      subjects: ["view", "create", "edit", "delete"],
      attendance: ["view", "create", "edit", "approve"],
      assignments: ["view", "create", "edit"],
      grades: ["view", "create", "edit", "approve"],
      exams: ["view", "create", "edit", "approve"],
      schedule: ["view", "create", "edit", "delete"],
      announcements: ["view", "create", "edit", "publish"],
      messages: ["view", "send"],
      finance: ["view", "create", "edit", "approve", "export"],
      reports: ["view", "export", "generate"],
      documents: ["view", "create", "edit", "delete", "upload", "download"],
      settings: ["view", "edit"],
      userManagement: [
        "view",
        "create",
        "edit",
        "delete",
        "suspend",
        "changeRole",
      ],
    }),
  },
  {
    id: "department_head",
    name: "Department Head",
    description: "Manages department-level resources, staff, and reports.",
    isSystem: false,
    userCount: 8,
    updatedAt: "2026-09-10",
    permissions: buildPermissions({
      dashboard: ["view"],
      students: ["view", "edit"],
      teachers: ["view", "create", "edit"],
      parents: ["view", "edit"],
      classes: ["view", "create", "edit", "delete"],
      subjects: ["view", "create", "edit"],
      attendance: ["view", "create", "edit", "approve"],
      assignments: ["view", "create", "edit", "delete"],
      grades: ["view", "create", "edit", "approve"],
      exams: ["view", "create", "edit", "approve"],
      schedule: ["view", "create", "edit", "delete"],
      announcements: ["view", "create", "edit", "publish"],
      messages: ["view", "send"],
      documents: ["view", "create", "edit", "delete"],
      reports: ["view", "export"],
    }),
  },
  {
    id: "teacher",
    name: "Teacher",
    description: "Can manage classes, attendance, assignments, and grades.",
    isSystem: false,
    userCount: 148,
    updatedAt: "2026-09-05",
    permissions: buildPermissions({
      dashboard: ["view"],
      students: ["view"],
      classes: ["view", "edit"],
      subjects: ["view"],
      attendance: ["view", "create", "edit"],
      assignments: ["view", "create", "edit", "delete"],
      grades: ["view", "create", "edit"],
      exams: ["view", "create"],
      schedule: ["view"],
      announcements: ["view", "create"],
      messages: ["view", "send"],
      documents: ["view", "edit"],
    }),
  },
  {
    id: "accountant",
    name: "Accountant",
    description: "Manages financial records, payments, and reports.",
    isSystem: false,
    userCount: 4,
    updatedAt: "2026-08-28",
    permissions: buildPermissions({
      dashboard: ["view"],
      finance: ["view", "create", "edit", "delete", "approve", "export"],
      reports: ["view", "export", "generate"],
      documents: ["view", "create", "edit", "download"],
      announcements: ["view"],
      messages: ["view"],
    }),
  },
  {
    id: "parent",
    name: "Parent",
    description:
      "Read-only access to child's academic progress and announcements.",
    isSystem: true,
    userCount: 1240,
    updatedAt: "2026-07-20",
    permissions: buildPermissions({
      dashboard: ["view"],
      grades: ["view"],
      attendance: ["view"],
      schedule: ["view"],
      announcements: ["view"],
      messages: ["view"],
    }),
  },
  {
    id: "student",
    name: "Student",
    description: "Access to own academic resources, grades, and schedule.",
    isSystem: true,
    userCount: 1050,
    updatedAt: "2026-07-20",
    permissions: buildPermissions({
      dashboard: ["view"],
      grades: ["view"],
      schedule: ["view"],
      assignments: ["view", "edit"],
      announcements: ["view"],
    }),
  },
];

export const getRoles = async () => {
  // TODO: const response = await apiAxios.get(BASE); return response.data.data;
  await delay();
  return structuredClone(MOCK_ROLES);
};

export const updateRolePermissions = async (roleId, permissions) => {
  // TODO: const response = await apiAxios.put(`${BASE}/${roleId}/permissions`, { permissions }); return response.data.data;
  await delay(300);
  const role = MOCK_ROLES.find((r) => r.id === roleId);
  if (!role) throw new Error("Role not found");
  role.permissions = permissions;
  role.updatedAt = new Date().toISOString().slice(0, 10);
  return role;
};

export const createRole = async ({ name, description }) => {
  const newRole = {
    id: crypto.randomUUID(),
    name,
    description,
    isSystem: false,
    userCount: 0,
    updatedAt: new Date().toISOString().slice(0, 10),
    permissions: buildPermissions({}),
  };
  MOCK_ROLES = [...MOCK_ROLES, newRole];
  return newRole;
};

export const updateRoleDetails = async (roleId, { name, description }) => {
  const role = MOCK_ROLES.find((r) => r.id === roleId);
  if (!role) throw new Error("Role not found");
  role.name = name;
  role.description = description;
  return role;
};

export const deleteRole = async (roleId) => {
  const role = MOCK_ROLES.find((r) => r.id === roleId);
  if (role?.userCount > 0) {
    throw new Error(
      `Cannot delete "${role.name}" - ${role.userCount} users are still assigned to this role. Reassign them first.`,
    );
  }
  MOCK_ROLES = MOCK_ROLES.filter((r) => r.id !== roleId);
  return roleId;
};
