import { useAuth } from "../../auth/hooks/useAuth";
import {
  MetricCard,
  PaymentMethodsChart,
  RevenueExpenseChart,
} from "../components/AccountantOverview";
import FeeCollectionStatusCard from "../accountantCards/FeeCollectionsStatusCard";
import OutstandingFeesTable from "../accountantCards/OutstandingFeesTable";


const metrics = [
  {
    label: "TOTAL REVENUE YTD",
    value: "ETB 42.8M",
    detailLead: "+8.4%",
    detail: "vs 2025/26",
    tone: "success",
  },
  {
    label: "COLLECTED FEES",
    value: "ETB 3.1M",
    detail: "74% of expected",
    tone: "success",
  },
  {
    label: "OUTSTANDING FEES",
    value: "ETB 1.09M",
    detail: "48 students",
    tone: "danger",
  },
  {
    label: "TODAY'S PAYMENTS",
    value: "ETB 124,500",
    detail: "12 transactions",
    tone: "info",
  },
  {
    label: "MONTHLY EXPENSES",
    value: "ETB 2.1M",
    detail: "Aug projection",
    tone: "warning",
  },
  {
    label: "NET INCOME",
    value: "ETB 1.0M",
    detail: "this month",
    tone: "success",
  },
  {
    label: "OVERDUE PAYMENTS",
    value: "23",
    detail: "require follow-up",
    tone: "danger",
  },
  {
    label: "PENDING INVOICES",
    value: "9",
    detail: "awaiting approval",
    tone: "warning",
  },
];

const monthlyPerformance = [
  { month: "Mar", revenue: 840, expenses: 520 },
  { month: "Apr", revenue: 920, expenses: 580 },
  { month: "May", revenue: 760, expenses: 490 },
  { month: "Jun", revenue: 1080, expenses: 640 },
  { month: "Jul", revenue: 1150, expenses: 710 },
  { month: "Aug", revenue: 980, expenses: 590 },
];

const paymentMethods = [
  { name: "Bank Transfer", value: 42, color: "#2563eb" },
  { name: "Cash", value: 28, color: "#16a34a" },
  { name: "Online", value: 22, color: "#7c3aed" },
  { name: "Mobile", value: 8, color: "#d97706" },
];

const AccountantDashboard = () => {
  const { user } = useAuth();
  const schoolName = user?.school?.name || "No school provided";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 font-sans sm:p-5 white:bg-slate-950">
      <header className="flex  justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-semibold leading-none tracking-tight text-slate-950 white:text-slate-50">
            Finance Overview
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {schoolName} · August 2026
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 green:border-emerald-800 white:bg-emerald-950 dark:text-emerald-300">
          <span
            className="size-2.5 rounded-full bg-emerald-500"
            aria-hidden="true"
          />
          Finance Officer · AIA
        </div>
      </header>

      <main className="mt-7 flex flex-col gap-7">
        <section
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Finance key performance indicators"
        >
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section
          className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]"
          aria-label="Finance analytics"
        >
          <RevenueExpenseChart data={monthlyPerformance} />
          <PaymentMethodsChart data={paymentMethods} />
        </section>
        <section>
          <FeeCollectionStatusCard />
        </section>
        <section>
          <OutstandingFeesTable />
        </section>
      </main>
    </div>
  );
};

export default AccountantDashboard;