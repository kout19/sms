import {Routes,Route} from "react-router-dom"
import AdminDashboard from "../pages/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import Settings from "../pages/Settings";



const AdminRoutes= () => {
    return(
    <Routes>
        <Route path="/"  element={<AdminLayout/>}>
        <Route index element={<AdminDashboard/>} />
        <Route path="dashboard" element={<AdminDashboard/>} />
        <Route path="settings" element={<Settings/>}/>

        </Route>
    </Routes>

    )
};

export default AdminRoutes;