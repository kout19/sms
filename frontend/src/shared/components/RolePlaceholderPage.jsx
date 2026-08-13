import { Link } from "react-router-dom";

const RolePlaceholderPage = ({
  title,
  description,
  backPath = "/",
  backLabel = "Back to dashboard",
}) => {
  return (
    <div className="min-h-[60vh] rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="max-w-2xl space-y-4">
        <div className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
          Placeholder module
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
        <Link
          to={backPath}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
};

export default RolePlaceholderPage;
