/**
 * RBAC Utilities - Export Index
 */

export * from "./rbacUtils";

export { useAuth, getRoleDashboardPath } from "../../modules/auth/hooks/useAuth";
export { usePermission } from "../hooks/usePermission";

export { default as ProtectedRoute } from "../components/ProtectedRoute";
export { default as CanAccess } from "../components/CanAccess";
