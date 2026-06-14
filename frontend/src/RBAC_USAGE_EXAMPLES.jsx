/**
 * RBAC Usage Examples
 * ====================
 *
 * This file contains practical examples of how to use the RBAC system
 * in your React components. Copy and adapt these patterns for your needs.
 */

// ============================================
// Example 1: Basic useAuth Hook Usage
// ============================================

import { useAuth } from "../shared/utils";

function UserProfileComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div className="user-profile">
      <h2>
        Welcome, {user?.firstName} {user?.lastName}
      </h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// ============================================
// Example 2: Permission-Based UI Rendering
// ============================================

import { usePermission } from "../shared/utils";

function StudentManagementPanel() {
  const { can, canAny, permissions } = usePermission();

  return (
    <div className="student-panel">
      <h2>Student Management</h2>

      {can("view:students") && (
        <section>
          <h3>View Students</h3>
          {/* Student list component */}
        </section>
      )}

      {can("edit:grades") && (
        <section>
          <h3>Edit Grades</h3>
          {/* Grade editor component */}
        </section>
      )}

      {canAny(["manage:classes", "manage:attendance"]) && (
        <section>
          <h3>Administrative Functions</h3>
          {/* Admin controls */}
        </section>
      )}

      <details>
        <summary>Your Permissions ({permissions.length})</summary>
        <ul>
          {permissions.map((perm) => (
            <li key={perm}>{perm}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

// ============================================
// Example 3: Using CanAccess Component
// ============================================

import { CanAccess } from "../shared/utils";

function DashboardWithConditionalContent() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* Single permission check */}
      <CanAccess permission="view:all_data">
        <div className="admin-section">
          <h2>System Overview</h2>
          {/* Admin dashboard content */}
        </div>
      </CanAccess>

      {/* Multiple permissions (all required) */}
      <CanAccess
        permissions={["view:students", "edit:grades"]}
        fallback={<p>You need special permissions to access this</p>}
      >
        <div className="grades-section">
          <h2>Grade Management</h2>
          {/* Grade management interface */}
        </div>
      </CanAccess>

      {/* Any permission check */}
      <CanAccess anyPermission={["mark:attendance", "view:attendance"]}>
        <div className="attendance-section">
          <h2>Attendance</h2>
          {/* Attendance interface */}
        </div>
      </CanAccess>

      {/* View own data (students/parents) */}
      <CanAccess permission="view:own_grades">
        <div className="grades-section">
          <h2>My Grades</h2>
          {/* Student grades display */}
        </div>
      </CanAccess>
    </div>
  );
}

// ============================================
// Example 4: Role-Based Component Rendering
// ============================================

function RoleSpecificDashboard() {
  const { isAdmin, isTeacher, isStudent, isParent } = useAuth();

  return (
    <div className="dashboard">
      {isAdmin() && <AdminDashboard />}
      {isTeacher() && <TeacherDashboard />}
      {isStudent() && <StudentDashboard />}
      {isParent() && <ParentDashboard />}
    </div>
  );
}

// ============================================
// Example 5: Protected Navigation/Sidebar
// ============================================

import { Link } from "react-router-dom";

function NavigationSidebar() {
  const { can, isAdmin, isTeacher } = useAuth();

  return (
    <nav className="sidebar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        {isAdmin() && (
          <>
            <li>
              <Link to="/admin">Admin Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/students">Manage Students</Link>
            </li>
            <li>
              <Link to="/admin/teachers">Manage Teachers</Link>
            </li>
          </>
        )}

        {isTeacher() && (
          <>
            <li>
              <Link to="/teacher">Teacher Dashboard</Link>
            </li>
            <li>
              <Link to="/teacher/classes">My Classes</Link>
            </li>
            <li>
              <Link to="/teacher/grades">Grades</Link>
            </li>
          </>
        )}

        {can("view:own_grades") && (
          <li>
            <Link to="/student/grades">My Grades</Link>
          </li>
        )}

        {can("view:child_grades") && (
          <li>
            <Link to="/parent/child-progress">Child Progress</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

// ============================================
// Example 6: Form/Action Permission Checks
// ============================================

function StudentGradesForm({ studentId, onSubmit }) {
  const { can, user } = useAuth();

  // Check if user can edit this specific student's grades
  const canEditGrades = can("edit:grades");
  const canViewGrades = can("view:students");

  return (
    <form onSubmit={onSubmit}>
      {!canViewGrades && (
        <p className="error">You don't have permission to view grades</p>
      )}

      {canViewGrades && !canEditGrades && (
        <div className="readonly-view">{/* Read-only grade display */}</div>
      )}

      {canEditGrades && (
        <div className="editable-view">
          <label>
            Math Grade:
            <input type="number" name="mathGrade" />
          </label>
          <button type="submit">Save Grades</button>
        </div>
      )}
    </form>
  );
}

// ============================================
// Example 7: Data Filtering Based on Role
// ============================================

function StudentList() {
  const { user, getRolePermissions } = useAuth();
  const permissions = getRolePermissions();

  // Fetch different data based on role
  const fetchStudentData = async () => {
    let endpoint = "/api/students";

    if (user?.role === "teacher") {
      // Teacher only sees their assigned students
      endpoint = `/api/teachers/${user.id}/students`;
    } else if (user?.role === "parent") {
      // Parent only sees their children
      endpoint = `/api/parents/${user.id}/children`;
    } else if (user?.role === "student") {
      // Student only sees themselves
      endpoint = `/api/students/${user.id}`;
    }

    // Fetch and return data
  };

  return (
    <div>
      <h2>Students</h2>
      {/* Render appropriate list based on permissions */}
    </div>
  );
}

// ============================================
// Example 8: Role Switcher Usage (Development)
// ============================================

function DevelopmentToolbar() {
  const { user, login } = useAuth();

  return (
    <div className="dev-toolbar">
      <p>
        Current User: {user?.name} ({user?.role})
      </p>
      <p>Show/hide RoleSwitcher in bottom-right corner</p>
      {/* The RoleSwitcher is globally available in App.jsx */}
    </div>
  );
}

// ============================================
// Example 9: Async Role Switching (Mock Login)
// ============================================

import { mockUsers } from "../features/auth/mockUsers";

function MockLoginForm() {
  const { login, loading } = useAuth();

  const handleLoginAs = async (role) => {
    // Simulate API call delay
    const mockUser = mockUsers[role];
    if (mockUser) {
      login(mockUser);
    }
  };

  return (
    <div className="mock-login">
      <h3>Mock Login (Development Only)</h3>
      <div className="button-group">
        {Object.entries(mockUsers).map(([role, user]) => (
          <button
            key={role}
            onClick={() => handleLoginAs(role)}
            disabled={loading}
          >
            Login as {role}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Example 10: Custom Hook - useAdmin
// ============================================

/**
 * Custom hook for admin-specific functionality
 * Can be reused across components
 */
function useAdmin() {
  const { isAdmin, can } = useAuth();

  return {
    isAdmin: isAdmin(),
    canManageUsers: can("manage:users"),
    canManageRoles: can("manage:roles"),
    canViewReports: can("view:reports"),
  };
}

// Usage:
function AdminPanel() {
  const { isAdmin, canManageUsers, canViewReports } = useAdmin();

  return (
    <div>
      {!isAdmin && <div>Access Denied</div>}
      {isAdmin && (
        <>
          {canManageUsers && <UserManagement />}
          {canViewReports && <Reports />}
        </>
      )}
    </div>
  );
}

export {
  UserProfileComponent,
  StudentManagementPanel,
  DashboardWithConditionalContent,
  RoleSpecificDashboard,
  NavigationSidebar,
  StudentGradesForm,
  StudentList,
  DevelopmentToolbar,
  MockLoginForm,
  AdminPanel,
};
