import "./App.css";
import "./index.css";
import Landingpages from "./modules/public/pages/Landingpages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoutes from "./modules/admin/routes/AdminRoutes";
import TeacherRoutes from "./modules/teachers/routes/TeacherRoutes";
import StudentRoutes from "./modules/students/routes/StudentRoutes";
import ParentRoutes from "./modules/parents/routes/ParentRoutes";
import { RoleSwitcher } from "./shared/utils";

/**
 * App Component - Main application entry point
 * Handles routing and shows development tools (RoleSwitcher in dev mode)
 */
function App() {
  return (
    <div className="app">
      <BrowserRouter>
        {/* Development Tools - Only show in development */}
        {import.meta.env.MODE === "development" && <RoleSwitcher />}

        {/* Main Routes */}
        <Routes>
          {/* Landing pages - public route */}
          <Route path="/" element={<Landingpages />} />

          {/* Admin pages - protected routes for admin role */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* Teacher dashboard - protected routes for teacher role */}
          <Route path="/teacher/*" element={<TeacherRoutes />} />

          {/* Student dashboard - protected routes for student role */}
          <Route path="/student/*" element={<StudentRoutes />} />

          {/* Parent dashboard - protected routes for parent role */}
          <Route path="/parent/*" element={<ParentRoutes />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
