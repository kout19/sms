import "./App.css";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landingpages from "./modules/public/pages/Landingpages";

// Auth
import AuthLayout from "./modules/auth/layouts/AuthLayout";
import Login from "./modules/auth/pages/Login";
import ForgotPassword from "./modules/auth/pages/ForgotPassword";
import ResetPassword from "./modules/auth/pages/ResetPassword";
import Unauthorized from "./modules/auth/pages/Unauthorized";
import NotFound from "./modules/auth/pages/NotFound";

// Feature Routes
import AdminRoutes from "./modules/admin/routes/AdminRoutes";
import TeacherRoutes from "./modules/teachers/routes/TeacherRoutes";
import StudentRoutes from "./modules/students/routes/StudentRoutes";
import ParentRoutes from "./modules/parents/routes/ParentRoutes";
import SuperAdminRoutes from "./modules/superAdmin/routes/SuperAdminRoutes";
import AccountantRoutes from "./modules/accountant/routes/AccountantRoutes";
import DepartmentHeadRoutes from "./modules/departmentHead/routes/DepartmentHeadRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landingpages />} />

        {/* Authentication */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* Dashboards */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/teacher/*" element={<TeacherRoutes />} />
        <Route path="/student/*" element={<StudentRoutes />} />
        <Route path="/parent/*" element={<ParentRoutes />} />
        <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
        <Route path="/accountant/*" element={<AccountantRoutes />} />
        <Route path="/department-head/*" element={<DepartmentHeadRoutes />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
