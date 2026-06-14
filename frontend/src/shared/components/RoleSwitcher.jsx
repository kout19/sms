/**
 * RoleSwitcher Component - Development Tool for Testing Different Roles
 * Allows quick switching between user roles for testing RBAC functionality
 * Remove or hide this in production!
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { mockUsers } from "../../features/auth/mockUsers";
import "../styles/RoleSwitcher.css";

/**
 * RoleSwitcher - Quick role switching UI for development/testing
 * Shows current user and allows easy switching between mock users
 *
 * Best practices:
 * - Only show in development environment
 * - Add environment checks: process.env.NODE_ENV === "development"
 * - Remove before production deployment
 * - Consider adding to a dev-only toolbar
 */
const RoleSwitcher = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = (mockUser) => {
    // Login with the new user role
    login(mockUser);

    // Navigate to the appropriate dashboard based on the role
    const roleRoutes = {
      admin: "/admin",
      teacher: "/teacher",
      student: "/student",
      parent: "/parent",
    };

    const targetRoute = roleRoutes[mockUser.role] || "/";
    setTimeout(() => {
      navigate(targetRoute);
    }, 100); // Small delay to ensure Redux state updates first
  };

  const roles = [
    { key: "admin", user: mockUsers.admin, icon: "👨‍💼" },
    { key: "teacher", user: mockUsers.teacher, icon: "👨‍🏫" },
    { key: "student", user: mockUsers.student, icon: "👨‍🎓" },
    { key: "parent", user: mockUsers.parent, icon: "👨‍👩‍👧" },
  ];

  return (
    <div className="role-switcher">
      <div className="role-switcher-header">
        <span className="role-switcher-label">Current User:</span>
        <span className="role-switcher-user">
          {user?.firstName} {user?.lastName} ({user?.role})
        </span>
      </div>

      <div className="role-switcher-buttons">
        {roles.map((item) => (
          <button
            key={item.key}
            className={`role-btn ${user?.role === item.key ? "active" : ""}`}
            onClick={() => handleRoleSwitch(item.user)}
            title={`Switch to ${item.key}`}
          >
            <span className="role-icon">{item.icon}</span>
            <span className="role-name">{item.key}</span>
          </button>
        ))}
      </div>

      {user && (
        <div className="role-switcher-info">
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
