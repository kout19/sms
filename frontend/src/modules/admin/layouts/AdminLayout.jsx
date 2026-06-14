import Sidbar from "../components/Sidebar";
import Header from "../../../shared/components/AdminHeader";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidbar />
      <div className="flex-1 min-w-0  overflow-hidden">
        <Header />
        <main className="overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
