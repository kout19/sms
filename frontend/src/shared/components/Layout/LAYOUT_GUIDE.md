/\*\*

- REUSABLE LAYOUT SYSTEM - IMPLEMENTATION GUIDE
- =============================================
-
- This guide shows how to use the new reusable Header and Sidebar components
- across all roles in your SMS application.
  \*/

/\*\*

- ## SYSTEM ARCHITECTURE
-
- The new layout system is organized as:
-
- src/shared/
- ├── config/
- │ └── navigationConfig.js ← Central menu configuration for all roles
- │
- ├── components/Layout/
- │ ├── Layout.jsx ← Main layout wrapper (combines header + sidebar)
- │ ├── Header.jsx ← Reusable header for all roles
- │ ├── Sidebar.jsx ← Reusable sidebar for all roles
- │ └── index.js ← Barrel exports
- │
- └── styles/
-     ├── Layout.css            ← Layout styles
-     ├── Header.css            ← Header styles
-     └── Sidebar.css           ← Sidebar styles
-
- ## KEY FILES
-
- 1.  navigationConfig.js - Menu items for each role
- 2.  Layout.jsx - Main wrapper
- 3.  Header.jsx - Shows user info, notifications, profile
- 4.  Sidebar.jsx - Shows role-based menu items
      \*/

/\*\*

- ## QUICK START - 3 WAYS TO USE THE LAYOUT
-
- ### Option 1: Simple Usage (Recommended)
-
- In your role-specific layout file:
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

  ```
-
- That's it! The Layout component:
- - Automatically reads user role from Redux
- - Renders correct Header (same for all roles)
- - Renders correct Sidebar (menu items based on role)
- - Handles responsive behavior
- - Manages sidebar open/close
-
- ### Option 2: Custom Layout
-
- If you need custom styling or behavior:
-
- ```jsx

  ```
- import { Header, Sidebar } from '../../../shared/components/Layout';
- import { useState } from 'react';
-
- function CustomAdminLayout() {
- const [sidebarOpen, setSidebarOpen] = useState(false);
-
- return (
-     <div className="my-custom-layout">
-       <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
-       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
-       <main className="my-main-content">
-         <Outlet />
-       </main>
-     </div>
- );
- }
- ```

  ```
-
- ### Option 3: Individual Components
-
- Use only Header or Sidebar if needed:
-
- ```jsx

  ```
- import { Header } from '../../../shared/components/Layout';
-
- function JustHeader() {
- return <Header onMenuToggle={() => {}} />;
- }
- ```
  */
  ```

/\*\*

- ## CONFIGURATION - ADD/MODIFY MENU ITEMS
-
- All menu items are defined in navigationConfig.js:
-
- ### Adding a New Menu Item
-
- ```javascript

  ```
- // In navigationConfig.js
-
- export const navigationConfig = {
- admin: {
-     items: [
-       // Existing items...
-
-       {
-         id: "new-feature",
-         label: "New Feature",
-         icon: "🚀",
-         path: "/admin/new-feature",
-         permission: "manage:features", // optional
-         children: [ // optional for nested items
-           {
-             id: "sub-feature",
-             label: "Sub Feature",
-             icon: "⭐",
-             path: "/admin/new-feature/sub"
-           }
-         ]
-       }
-     ]
- }
- };
- ```

  ```
-
- ### Adding a New Role
-
- ```javascript

  ```
- export const navigationConfig = {
- admin: { /_ ... _/ },
- teacher: { /_ ... _/ },
- student: { /_ ... _/ },
- parent: { /_ ... _/ },
-
- // New role
- librarian: {
-     label: "Librarian",
-     items: [
-       {
-         id: "dashboard",
-         label: "Dashboard",
-         icon: "📚",
-         path: "/librarian"
-       },
-       // ... more items
-     ]
- }
- };
- ```
  */
  ```

/\*\*

- ## FEATURES
-
- ### Header Features
- - Shows application logo
- - Shows user first name and role
- - Displays notification count
- - User profile dropdown with:
- - Profile button
- - Settings button
- - Logout button
- - Fully responsive
- - Mobile menu toggle button
-
- ### Sidebar Features
- - Automatically renders menu items for user's role
- - Support for nested menus (expandable)
- - Active route highlighting
- - Permission-based menu visibility
- - User badge at bottom with avatar
- - Collapsible on mobile
- - Smooth animations
-
- ### Layout Features
- - Combines header and sidebar
- - Handles responsive behavior
- - Auto-closes sidebar on mobile after navigation
- - Works with all roles without modification
    \*/

/\*\*

- ## MENU ITEMS CONFIG STRUCTURE
-
- Each role has this structure:
-
- ```javascript

  ```
- {
- label: "Role Display Name", // Shows in sidebar header
- items: [
-     {
-       id: "unique-id",                  // Unique identifier
-       label: "Menu Item Label",         // Display text
-       icon: "📚",                       // Emoji or icon
-       path: "/role/page",               // Route path
-       permission: "permission:name",    // Optional - hides if user lacks permission
-       children: [                       // Optional - for nested menus
-         {
-           id: "child-id",
-           label: "Child Item",
-           icon: "⭐",
-           path: "/role/page/child"
-         }
-       ]
-     }
- ]
- }
- ```
  */
  ```

/\*\*

- ## USING PERMISSION-BASED MENU ITEMS
-
- Menu items can be hidden based on permissions:
-
- ```javascript

  ```
- {
- id: "reports",
- label: "Reports",
- icon: "📊",
- path: "/admin/reports",
- permission: "view:reports" // Only shows if user has this permission
- }
- ```

  ```
-
- The Sidebar component automatically checks permissions and hides items
- that the user doesn't have access to.
  \*/

/\*\*

- ## STYLING AND CUSTOMIZATION
-
- ### Header Colors
-
- Edit: src/shared/styles/Header.css
-
- ```css

  ```
- .header {
- background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
- }
- ```

  ```
-
- ### Sidebar Colors
-
- Edit: src/shared/styles/Sidebar.css
-
- ```css

  ```
- .sidebar {
- background: #f8f9fa;
- border-right: 1px solid #e9ecef;
- }
-
- .menu-item.active {
- color: #667eea;
- }
- ```

  ```
-
- ### Layout Spacing
-
- Edit: src/shared/styles/Layout.css
-
- ```css

  ```
- .layout-main {
- margin-left: 280px; /_ Sidebar width _/
- background: #f5f5f5;
- }
- ```
  */
  ```

/\*\*

- ## RESPONSIVE BEHAVIOR
-
- The layout automatically responds to screen size:
-
- Desktop (> 1024px):
- - Header spans full width
- - Sidebar always visible (280px fixed)
- - Main content has left margin
-
- Tablet (768px - 1024px):
- - Header spans full width
- - Sidebar visible but narrower (240px)
- - Main content adjusts
-
- Mobile (< 768px):
- - Header has menu toggle button
- - Sidebar hidden by default
- - Click menu button to show sidebar
- - Overlay when sidebar is open
- - Full width main content
- - Sidebar auto-closes on navigation
    \*/

/\*\*

- ## INTEGRATION STEPS
-
- Step 1: Import Layout components
- Step 2: Wrap your pages with Layout
- Step 3: Define menu items in navigationConfig.js
- Step 4: Customize styles if needed
- Step 5: Test with different roles using RoleSwitcher
-
- Example for Admin:
-
- ```jsx

  ```
- // AdminLayout.jsx
- import { Layout } from '../../../shared/components/Layout';
- import { Outlet } from 'react-router-dom';
-
- export default function AdminLayout() {
- return (
-     <Layout>
-       <Outlet />
-     </Layout>
- );
- }
-
- // AdminRoutes.jsx
- import AdminLayout from './layouts/AdminLayout';
-
- export default function AdminRoutes() {
- return (
-     <ProtectedRoute
-       allowedRoles={["admin"]}
-       element={
-         <Routes>
-           <Route path="/" element={<AdminLayout />}>
-             <Route index element={<AdminDashboard />} />
-             <Route path="students" element={<Students />} />
-             {/* More routes */}
-           </Route>
-         </Routes>
-       }
-     />
- );
- }
- ```
  */
  ```

/\*\*

- ## HOW IT WORKS - UNDER THE HOOD
-
- 1.  User logs in with a role (stored in Redux)
- 2.  Layout component mounts
- 3.  Header component:
- - Gets user from Redux
- - Shows user name and role
- - Provides logout function
- 4.  Sidebar component:
- - Gets user role from Redux
- - Looks up navigationConfig[role]
- - Filters items by permission (if specified)
- - Renders menu with active highlighting
- 5.  Main content area shows page content
- 6.  Responsive CSS handles mobile behavior
-
- The same components work for all roles - they just render
- different menus based on the role configuration!
  \*/

/\*\*

- ## ACTIVE ROUTE HIGHLIGHTING
-
- The sidebar automatically highlights the active menu item:
- - Compares current URL with menu item paths
- - Adds 'active' class to matching items
- - Shows left border for active items
- - Auto-expands parent if child is active
-
- This works automatically - no configuration needed!
  \*/

/\*\*

- ## NESTED MENUS EXAMPLE
-
- ```javascript

  ```
- {
- id: "students",
- label: "Students",
- icon: "👨‍🎓",
- path: "/admin/students",
- children: [
-     {
-       id: "students-list",
-       label: "All Students",
-       icon: "📋",
-       path: "/admin/students"
-     },
-     {
-       id: "students-add",
-       label: "Add Student",
-       icon: "➕",
-       path: "/admin/students/add"
-     }
- ]
- }
- ```

  ```
-
- Features:
- - Parent item is clickable button
- - Clicking toggles children visibility
- - Arrow icon rotates when expanded
- - Active child auto-expands parent
- - Smooth animation
    \*/

/\*\*

- ## TROUBLESHOOTING
-
- Issue: Sidebar doesn't show correct menu items
- - Check navigationConfig.js has role defined
- - Verify user role in Redux
- - Check permission names match
-
- Issue: Active highlighting not working
- - Verify route paths match menu paths exactly
- - Check browser DevTools for current URL
- - Clear browser cache
-
- Issue: Sidebar not responsive on mobile
- - Check sidebar-open class is applied
- - Verify CSS media queries
- - Check z-index values
-
- Issue: Menu items not appearing
- - Check item has required fields (id, label, path)
- - Verify permission matches user's permissions
- - Check item is in correct role config
-
- Issue: Nested menus not working
- - Verify children array exists
- - Check child items have proper structure
- - Test with expanded state
    \*/

/\*\*

- ## NEXT STEPS
-
- 1.  Replace existing AdminLayout with new Layout component
- 2.  Create similar layouts for Teacher, Student, Parent roles
- 3.  Update routes to use new layouts
- 4.  Customize navigationConfig.js for your needs
- 5.  Test with RoleSwitcher
- 6.  Adjust styles/colors as needed
- 7.  Add more menu items as features are built
      \*/

export default {};
