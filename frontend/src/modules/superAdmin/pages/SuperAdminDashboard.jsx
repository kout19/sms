import { useAuth } from "../../auth/hooks/useAuth";

const cards = [
  { title: "Active Schools", value: "12", hint: "Across the platform" },
  { title: "System Users", value: "1,284", hint: "Managed accounts" },
  { title: "Pending Reviews", value: "18", hint: "Awaiting action" },
  { title: "Subscription Health", value: "94%", hint: "Renewal stability" },
];

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-700 p-8 text-white shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">
          Platform oversight
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          Welcome back, {user?.firstName || "Super Admin"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-indigo-100">
          Monitor schools, administrators, subscriptions, and system health from
          one central hub.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{card.title}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {card.value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Priority operations
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="rounded-lg bg-slate-50 p-3">
              Review new school onboarding requests.
            </li>
            <li className="rounded-lg bg-slate-50 p-3">
              Audit recent administrative changes.
            </li>
            <li className="rounded-lg bg-slate-50 p-3">
              Monitor subscription renewals and support tickets.
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            System status
          </h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              API services operating normally
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
              Background sync running on schedule
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
              Backup verification scheduled for tonight
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
