// frontend/src/shared/utils/validateNavConfig.js
import { PERMISSIONS, rolePermissions } from "@packages/shared";

const ALL_KNOWN_PERMISSIONS = new Set(Object.values(PERMISSIONS));

export function validateNavConfig(navConfig) {
  if (import.meta.env.PROD) return;

  for (const [role, roleNav] of Object.entries(navConfig)) {
    for (const group of roleNav.groups) {
      for (const item of group.items) {
        if (item.permission === undefined) continue; // no gate by design — fine

        if (!ALL_KNOWN_PERMISSIONS.has(item.permission)) {
          console.error(
            `[nav config] "${role}" -> "${item.id}" references unknown permission "${item.permission}"`,
          );
          continue;
        }
        const granted = rolePermissions[role]?.permissions ?? [];
        const hasIt =
          granted.includes(PERMISSIONS.ALL) ||
          granted.includes(item.permission);
        if (!hasIt) {
          console.warn(
            `[nav config] "${role}" -> "${item.id}" requires "${item.permission}", which "${role}" does not have.`,
          );
        }
      }
    }
  }
}
