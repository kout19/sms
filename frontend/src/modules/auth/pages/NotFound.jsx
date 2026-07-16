import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import AuthCard from "../components/AuthCard";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <AuthCard className="text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
          <FileQuestion size={28} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm text-slate-500 leading-relaxed">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
          >
            Go home
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </AuthCard>
    </div>
  );
};

export default NotFound;
