import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import Settings from "../pages/Settings";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import Classes from "../pages/Classes";
import Attendance from "../pages/Attendance";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="settings" element={<Settings />} />
        <Route path="students" element={<Students />}/>
        <Route path="teachers" element={<Teachers />}/>
        <Route path="classes" element={<Classes />}/>
        <Route path="attendance" element={<Attendance />}/>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
