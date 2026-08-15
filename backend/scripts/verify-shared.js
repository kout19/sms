// backend/scripts/verify-shared.js
// Run: node scripts/verify-shared.js
const {
  hasPermission,
  PERMISSIONS,
  rolePermissions,
} = require("@packages/shared");

console.log("Loaded from:", require.resolve("@packages/shared"));
console.log("Roles found:", Object.keys(rolePermissions));
console.log(
  "admin -> edit:grades:",
  hasPermission("admin", PERMISSIONS.EDIT_GRADES),
);
console.log(
  "teacher -> edit:grades:",
  hasPermission("teacher", PERMISSIONS.EDIT_GRADES),
);
console.log(
  "teacher -> manage:payments:",
  hasPermission("teacher", PERMISSIONS.MANAGE_PAYMENTS),
);
