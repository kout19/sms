/\*\*

- REUSABLE HEADER AND SIDEBAR - COMPLETE IMPLEMENTATION GUIDE
- ============================================================
-
- This guide shows how to implement the new reusable Header and Sidebar
- components across all four roles in your SMS application.
  \*/

/\*\*

- ## PROJECT STRUCTURE - WHAT WAS CREATED
-
- src/shared/
- ├── config/
- │ └── navigationConfig.js ..................... Menu configuration for all roles
- │
- ├── components/Layout/
- │ ├── Layout.jsx ............................ Main wrapper (header + sidebar)
- │ ├── Header.jsx ........................... Reusable header for all roles
- │ ├── Sidebar.jsx .......................... Reusable sidebar for all roles
- │ ├── index.js ............................. Barrel exports
- │ └── LAYOUT_GUIDE.md ....................... Detailed usage guide
- │
- └── styles/
-     ├── Layout.css
-     ├── Header.css
-     └── Sidebar.css
-
- src/modules/
- ├── teachers/
- │ ├── layouts/TeacherLayout.jsx ............ Simple wrapper using Layout
- │ └── routes/TeacherRoutes.jsx ............ Updated to use TeacherLayout
- │
- ├── students/
- │ ├── layouts/StudentLayout.jsx ........... Simple wrapper using Layout
- │ └── routes/StudentRoutes.jsx ........... Updated to use StudentLayout
- │
- ├── parents/
- │ ├── layouts/ParentLayout.jsx ............ Simple wrapper using Layout
- │ └── routes/ParentRoutes.jsx ............ Updated to use ParentLayout
- │
- └── admin/
-     ├── layouts/AdminLayout.jsx .............. OPTIONAL: Update to use Layout
-     └── routes/AdminRoutes.jsx .............. Already working
  \*/

/\*\*

- ## WHAT THE COMPONENTS DO
-
- ### Layout Component
- - Main wrapper that combines Header and Sidebar
- - Manages sidebar open/close state
- - Handles responsive behavior
- - Single entry point for all roles
-
- ### Header Component
- - Shows app logo
- - Displays current user name and role
- - Shows notification bell
- - Profile dropdown with logout option
- - Mobile menu toggle button
-
- ### Sidebar Component
- - Automatically renders menu items based on user role
- - Reads navigationConfig for menu structure
- - Highlights active route
- - Supports nested menus
- - Shows user badge at bottom
- - Permission-based item visibility
    \*/

/\*\*

- ## HOW MENU ITEMS ARE CONFIGURED
-
- File: src/shared/config/navigationConfig.js
-
- Contains menu definitions for all roles:
-
- navigationConfig = {
- admin: { ... }, // Admin menu items
- teacher: { ... }, // Teacher menu items
- student: { ... }, // Student menu items
- parent: { ... } // Parent menu items
- }
-
- Each role has:
- - label: Display name for the role
- - items: Array of menu items with:
- - id: Unique identifier
- - label: Display text
- - icon: Emoji or icon
- - path: Route path
- - permission: Optional permission check
- - children: Optional nested items
    \*/

/\*\*

- ## IMPLEMENTATION STEPS
-
- ### Step 1: Files Already Created ✓
-
- Already done:
- ✓ navigationConfig.js - Complete with all 4 roles
- ✓ Layout.jsx - Main layout wrapper
- ✓ Header.jsx - Reusable header
- ✓ Sidebar.jsx - Reusable sidebar
- ✓ Layout.css, Header.css, Sidebar.css - Styling
- ✓ TeacherLayout.jsx - Simple wrapper
- ✓ StudentLayout.jsx - Simple wrapper
- ✓ ParentLayout.jsx - Simple wrapper
- ✓ TeacherRoutes.jsx - Updated to use TeacherLayout
- ✓ StudentRoutes.jsx - Updated to use StudentLayout
- ✓ ParentRoutes.jsx - Updated to use ParentLayout
-
- ### Step 2: Test Teacher Role (Now)
-
- 1.  Run: npm run dev
- 2.  Click "teacher" in RoleSwitcher
- 3.  Navigate to /teacher
- 4.  Should see:
- - Header with user info
- - Sidebar with teacher menu items
- - Active menu highlighting
-
- ### Step 3: Test Student Role (Now)
-
- 1.  Click "student" in RoleSwitcher
- 2.  Navigate to /student
- 3.  Should see student-specific menu
-
- ### Step 4: Test Parent Role (Now)
-
- 1.  Click "parent" in RoleSwitcher
- 2.  Navigate to /parent
- 3.  Should see parent-specific menu
-
- ### Step 5: Optional - Update Admin Layout
-
- Current AdminLayout works fine. To use new components:
-
- Replace src/modules/admin/layouts/AdminLayout.jsx with:
-
- ```jsx

  ```
- import { Layout } from '../../../shared/components/Layout';
- import { Outlet } from 'react-router-dom';
-
- function AdminLayout() {
- return (
-     <Layout>
-       <Outlet />
-     </Layout>
- );
- }
-
- export default AdminLayout;
- ```
  */
  ```

/\*\*

- ## CUSTOMIZING MENU ITEMS
-
- ### Adding a New Menu Item
-
- Edit: src/shared/config/navigationConfig.js
-
- ```javascript

  ```
- teacher: {
- label: "Teacher",
- items: [
-     // ... existing items ...
-     {
-       id: "new-feature",
-       label: "New Feature",
-       icon: "🚀",
-       path: "/teacher/new-feature",
-       permission: "view:new_feature" // optional
-     }
- ]
- }
- ```

  ```
-
- ### Adding a Nested Menu
-
- ```javascript

  ```
- {
- id: "assignments",
- label: "Assignments",
- icon: "📝",
- path: "/student/assignments",
- children: [
-     {
-       id: "pending",
-       label: "Pending",
-       icon: "⏳",
-       path: "/student/assignments/pending"
-     },
-     {
-       id: "submitted",
-       label: "Submitted",
-       icon: "✔️",
-       path: "/student/assignments/submitted"
-     }
- ]
- }
- ```

  ```
-
- ### Hiding Menu Items by Permission
-
- ```javascript

  ```
- {
- id: "reports",
- label: "Reports",
- icon: "📊",
- path: "/teacher/reports",
- permission: "view:reports" // only shows if user has permission
- }
- ```
  */
  ```

/\*\*

- ## STYLING AND CUSTOMIZATION
-
- ### Changing Header Color
-
- File: src/shared/styles/Header.css
-
- Find: .header { background: ... }
-
- Change to your desired gradient or color
-
- ### Changing Sidebar Width
-
- File: src/shared/styles/Layout.css
-
- Find: .layout-main { margin-left: 280px; }
- Change 280px to desired width
-
- Also update in Sidebar.css:
- Find: .sidebar { width: 280px; }
-
- ### Changing Active Menu Color
-
- File: src/shared/styles/Sidebar.css
-
- Find: .menu-item.active { color: #667eea; }
- Change #667eea to your brand color
  \*/

/\*\*

- ## RESPONSIVE DESIGN
-
- The components automatically adapt to screen size:
-
- Desktop (> 1024px):
- - Sidebar always visible
- - Full-width header
- - Main content has left margin
-
- Tablet (768px - 1024px):
- - Sidebar visible but narrower
- - Full-width header
- - Adjusted spacing
-
- Mobile (< 768px):
- - Sidebar hidden by default
- - Menu toggle button in header
- - Click to show/hide sidebar
- - Auto-closes on navigation
- - Full-width content
-
- No additional work needed - CSS handles it all!
  \*/

/\*\*

- ## FEATURES IMPLEMENTED
-
- ✓ Reusable Header
- - Shows user name and role
- - Profile dropdown
- - Logout button
- - Notification badge
- - Mobile menu toggle
-
- ✓ Reusable Sidebar
- - Role-based menu items
- - Active route highlighting
- - Nested menu support
- - Permission-based visibility
- - User badge
- - Smooth animations
-
- ✓ Configuration-Based
- - All menus defined in one file
- - Easy to add/remove items
- - Easy to add new roles
- - Permission integration
-
- ✓ Responsive Design
- - Mobile, tablet, desktop
- - Hamburger menu on mobile
- - Sidebar auto-close
- - Touch-friendly
-
- ✓ Accessibility
- - Semantic HTML
- - Keyboard navigation
- - ARIA labels
- - Screen reader friendly
    \*/

/\*\*

- ## USAGE PATTERNS
-
- ### Pattern 1: Simple Role-Specific Layout
-
- ```jsx

  ```
- // TeacherLayout.jsx
- import { Layout } from '../../../shared/components/Layout';
- import { Outlet } from 'react-router-dom';
-
- export default function TeacherLayout() {
- return (
-     <Layout>
-       <Outlet />
-     </Layout>
- );
- }
- ```

  ```
-
- Use in routes:
-
- ```jsx

  ```
- // TeacherRoutes.jsx
- <Route path="/" element={<TeacherLayout />}>
- <Route index element={<TeacherDashboard />} />
- <Route path="classes" element={<Classes />} />
- </Route>
- ```

  ```
-
- ### Pattern 2: Custom Layout
-
- ```jsx

  ```
- import { Header, Sidebar } from '../../../shared/components/Layout';
-
- export default function CustomLayout() {
- const [sidebarOpen, setSidebarOpen] = useState(false);
-
- return (
-     <div className="my-layout">
-       <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
-       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
-       <main className="my-content">
-         <Outlet />
-       </main>
-     </div>
- );
- }
- ```
  */
  ```

/\*\*

- ## TESTING CHECKLIST
-
- Test Admin:
- - [ ] Click admin in RoleSwitcher
- - [ ] Navigate to /admin
- - [ ] See header with admin user info
- - [ ] See admin menu items in sidebar
- - [ ] Click menu items
- - [ ] Active highlighting works
-
- Test Teacher:
- - [ ] Click teacher in RoleSwitcher
- - [ ] Navigate to /teacher
- - [ ] See header with teacher user info
- - [ ] See teacher menu items (not admin items)
- - [ ] Different menu structure
-
- Test Student:
- - [ ] Click student in RoleSwitcher
- - [ ] Navigate to /student
- - [ ] See student menu items
-
- Test Parent:
- - [ ] Click parent in RoleSwitcher
- - [ ] Navigate to /parent
- - [ ] See parent menu items
-
- Test Responsive:
- - [ ] Desktop: Sidebar always visible
- - [ ] Tablet: Sidebar narrower
- - [ ] Mobile: Menu toggle button works
- - [ ] Mobile: Sidebar slides from left
- - [ ] Mobile: Click item closes sidebar
-
- Test Dropdown:
- - [ ] Click user profile area
- - [ ] Dropdown shows
- - [ ] Click My Profile
- - [ ] Click Settings
- - [ ] Click Logout
        \*/

/\*\*

- ## FILE LOCATIONS - QUICK REFERENCE
-
- Navigation Config:
- src/shared/config/navigationConfig.js
-
- Layout Components:
- src/shared/components/Layout/
- - Layout.jsx
- - Header.jsx
- - Sidebar.jsx
- - index.js
-
- Styles:
- src/shared/styles/
- - Layout.css
- - Header.css
- - Sidebar.css
-
- Role Layouts:
- src/modules/admin/layouts/AdminLayout.jsx
- src/modules/teachers/layouts/TeacherLayout.jsx
- src/modules/students/layouts/StudentLayout.jsx
- src/modules/parents/layouts/ParentLayout.jsx
-
- Role Routes:
- src/modules/admin/routes/AdminRoutes.jsx
- src/modules/teachers/routes/TeacherRoutes.jsx
- src/modules/students/routes/StudentRoutes.jsx
- src/modules/parents/routes/ParentRoutes.jsx
  \*/

/\*\*

- ## NEXT STEPS
-
- 1.  ✓ Components created
- 2.  ✓ Navigation config set up
- 3.  ✓ Layouts updated for teacher, student, parent
- 4.  [ ] Test all roles with RoleSwitcher
- 5.  [ ] Customize colors if desired
- 6.  [ ] Create page components for each role
- 7.  [ ] Add page content to routes
- 8.  [ ] Test responsive design
- 9.  [ ] Deploy!
-
- ### How to Add Page Components
-
- Example - Creating student dashboard:
-
- 1.  Create: src/modules/students/pages/StudentDashboard.jsx
- 2.  Import in StudentRoutes.jsx
- 3.  Add route: <Route index element={<StudentDashboard />} />
- 4.  Navigate to /student to see it
- 5.  Will automatically show in layout with header/sidebar
-
- The same sidebar and header automatically appear!
- No need to duplicate - it's all shared.
  \*/

/\*\*

- ## TROUBLESHOOTING
-
- Problem: Sidebar shows wrong menu items
- Solution: Check navigationConfig.js for correct role
-
- Problem: Menu items not clickable
- Solution: Check route paths in config match actual routes
-
- Problem: Active highlighting not working
- Solution: Verify URL matches menu path exactly
-
- Problem: Header/Sidebar not showing
- Solution: Check component is imported and Layout wraps Outlet
-
- Problem: Mobile menu not working
- Solution: Check viewport width, resize window to < 768px
-
- Problem: Styles look broken
- Solution: Check CSS files are imported in components
  \*/

export default {};
