import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const toneClasses = {
  success: "bg-emerald-500",
  danger: "bg-rose-500",
  warning: "bg-amber-500",
  info: "bg-blue-600",
};

export function MetricCard({ label, value, detail, detailLead, tone }) {
  return (
    <article className="group flex min-h-38 flex-col rounded-xl border border-slate-200 bg-white px-6 py-5 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-medium tracking-wide text-slate-600 dark:text-slate-300">
          {label}
        </h2>
        <span
          aria-hidden="true"
          className={`size-2.5 shrink-0 rounded-full ${toneClasses[tone]}`}
        />
      </div>
      <p className="mt-3 text-3xl font-semibold leading-none tracking-tight text-slate-950 dark:text-slate-50">
        {value}
      </p>
      <p className="mt-4 text-sm text-slate-400 dark:text-slate-400">
        {detailLead && (
          <span className="mr-2 font-medium text-emerald-600 dark:text-emerald-400">
            {detailLead}
          </span>
        )}
        {detail}
      </p>
    </article>
  );
}

function ChartTooltip({ active, payload, label, valueSuffix = "" }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <p className="mb-1 text-xs font-semibold text-slate-900 dark:text-slate-100">
        {label}
      </p>
      {payload.map((item) => (
        <div key={item.dataKey} className="flex items-center justify-between gap-5 text-xs">
          <span style={{ color: item.color }}>{item.name}</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {item.value}{valueSuffix}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueExpenseChart({ data }) {
  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white px-6 py-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">
          REVENUE VS EXPENSES
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-400">
          ETB thousands · 6 months
        </p>
      </div>
      <div className="mt-5 h-52 w-full sm:h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={5} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dy={8} />
            <YAxis domain={[0, 1200]} ticks={[0, 300, 600, 900, 1200]} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.08)" }} />
            <Bar name="Revenue" dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={68} animationDuration={900} />
            <Bar name="Expenses" dataKey="expenses" fill="#f99a9f" radius={[4, 4, 0, 0]} maxBarSize={68} animationDuration={1050} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function PaymentMethodsChart({ data }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white px-6 py-6 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">
        PAYMENT METHODS
      </h2>
      <div className="mx-auto mt-4 h-36 w-full max-w-64 sm:h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={44} outerRadius={69} paddingAngle={2} stroke="none" animationDuration={1000}>
              {data.map((item) => <Cell key={item.name} fill={item.color} />)}
            </Pie>
            <Tooltip content={<ChartTooltip valueSuffix="%" />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-1 flex flex-col gap-1.5" aria-label="Payment method breakdown">
        {data.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
              {item.name}
            </span>
            <span className="font-semibold text-slate-950 dark:text-slate-50">{item.value}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
