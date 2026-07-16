import "./App.css";
import "./index.css";
import Landingpages from "./modules/public/pages/Landingpages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoutes from "./modules/admin/routes/AdminRoutes";
import TeacherRoutes from "./modules/teachers/routes/TeacherRoutes";
import StudentRoutes from "./modules/students/routes/StudentRoutes";
import ParentRoutes from "./modules/parents/routes/ParentRoutes";
import AuthRoutes from "./modules/auth/routes/AuthRoutes";
import NotFound from "./modules/auth/pages/NotFound";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landingpages />} />

          <Route path="/*" element={<AuthRoutes />} />

          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/teacher/*" element={<TeacherRoutes />} />
          <Route path="/student/*" element={<StudentRoutes />} />
          <Route path="/parent/*" element={<ParentRoutes />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
