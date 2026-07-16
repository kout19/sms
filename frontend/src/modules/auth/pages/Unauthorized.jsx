import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";
import AuthCard from "../components/AuthCard";

const Unauthorized = () => {
  return (
    <AuthCard className="text-center">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <ShieldX size={28} />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Access denied</h1>
      <p className="mt-3 text-sm text-slate-500 leading-relaxed">
        You do not have permission to view this page. Contact your administrator
        if you believe this is an error.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/login"
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
        >
          Sign in
        </Link>
        <Link
          to="/"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Go home
        </Link>
      </div>
    </AuthCard>
  );
};

export default Unauthorized;
