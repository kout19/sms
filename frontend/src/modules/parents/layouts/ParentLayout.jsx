import Sidebar from "../components/Sidebar";
import Header from "../../../shared/components/AdminHeader";
import { Outlet } from "react-router-dom";

const ParentLayout = () => {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ParentLayout;
