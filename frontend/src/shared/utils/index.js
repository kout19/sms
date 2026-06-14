/**
 * RBAC Utilities - Export Index
 * Centralized exports for all RBAC-related utilities
 * Makes imports cleaner and more organized
 */

// Permission checking utilities
export * from "./rbacUtils";

// Hooks
export {  useAuth } from "../hooks/useAuth";
export {  usePermission } from "../hooks/usePermission";

// Components
export { default as ProtectedRoute } from "../components/ProtectedRoute";
export { default as CanAccess } from "../components/CanAccess";
export { default as RoleSwitcher } from "../components/RoleSwitcher";
