import { useAuth } from "../../auth/hooks/useAuth";
import RolePlaceholderPage from "../../../shared/components/RolePlaceholderPage";

const DepartmentHeadDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Department leadership
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Welcome, {user?.firstName || "Department Head"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Monitor the academic department, assign responsibilities, and track
          departmental performance from this workspace.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RolePlaceholderPage
          title="Department overview"
          description="Upcoming departmental metrics, staffing summaries, and key academic priorities will appear here."
          backPath="/department-head/dashboard"
          backLabel="Stay on department dashboard"
        />
        <RolePlaceholderPage
          title="Department actions"
          description="Teacher coordination, class oversight, and exam planning tools will be added in the next phase."
          backPath="/department-head/dashboard"
          backLabel="Stay on department dashboard"
        />
      </div>
    </div>
  );
};

export default DepartmentHeadDashboard;
