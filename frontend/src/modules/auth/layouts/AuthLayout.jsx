import { Outlet } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-2">
          <div className="h-10 w-10 flex justify-center items-center bg-blue-700 text-white rounded-xl">
            <GraduationCap size={20} />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">
            EduSystems
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Outlet />
      </main>

      <footer className="py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} EduSystems. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
