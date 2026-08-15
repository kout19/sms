// frontend/src/shared/__tests__/verify-shared.test.js
import { describe, test, expect } from "vitest";
import { hasPermission, PERMISSIONS, rolePermissions } from "@packages/shared";

describe("shared permissions resolve correctly through Vite", () => {
  test("package loads with expected roles", () => {
    expect(Object.keys(rolePermissions)).toEqual(
      expect.arrayContaining([
        "admin",
        "teacher",
        "student",
        "parent",
        "accountant",
      ]),
    );
  });

  test("admin has wildcard access", () => {
    expect(hasPermission("admin", PERMISSIONS.EDIT_GRADES)).toBe(true);
    expect(hasPermission("admin", PERMISSIONS.MANAGE_PAYMENTS)).toBe(true);
  });

  test("teacher is scoped correctly", () => {
    expect(hasPermission("teacher", PERMISSIONS.EDIT_GRADES)).toBe(true);
    expect(hasPermission("teacher", PERMISSIONS.MANAGE_PAYMENTS)).toBe(false);
  });
});
