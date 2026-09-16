import Avatar from "@shared/components/Avatar";
import { FEE_STATUS_STYLES } from "../../utils/financeConstants";
import { useFeeCollectionRecords } from "../../hooks/useFinanceReport";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DetailedFeeRecordsTable({ filters }) {
  const { data: records = [], isLoading } = useFeeCollectionRecords(filters);

  const paidCount = records.filter((r) => r.status === "Paid").length;
  const overdueCount = records.filter((r) => r.status === "Overdue").length;
  const totalOutstanding = records.reduce((sum, r) => sum + r.outstanding, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Fee Collection Records</h2>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Paid: <span className="font-semibold">{paidCount}</span>
          </span>
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Overdue: <span className="font-semibold">{overdueCount}</span>
          </span>
        </div>
      </div>

      {isLoading ? (
        <p className="px-6 py-8 text-sm text-gray-400">Loading records...</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[1.6fr_1.1fr_1.3fr_0.9fr_0.9fr_1fr_1fr_0.9fr] gap-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <span>Student</span>
              <span>Invoice</span>
              <span>Fee Type</span>
              <span>Amount</span>
              <span>Paid</span>
              <span>Outstanding</span>
              <span>Due Date</span>
              <span>Status</span>
            </div>

            <div>
              {records.map((r) => {
                const style = FEE_STATUS_STYLES[r.status];
                return (
                  <div
                    key={r.id}
                    className="grid grid-cols-[1.6fr_1.1fr_1.3fr_0.9fr_0.9fr_1fr_1fr_0.9fr] gap-4 px-6 py-3.5 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={r.studentName} colorful />
                      <span className="text-sm font-medium text-gray-900">{r.studentName}</span>
                    </div>
                    <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded w-fit">{r.invoice}</span>
                    <span className="text-sm text-gray-600">{r.feeType}</span>
                    <span className="text-sm font-medium text-gray-900">${r.amount.toLocaleString()}</span>
                    <span className="text-sm font-medium text-emerald-600">${r.paid.toLocaleString()}</span>
                    <span className={`text-sm font-medium ${r.outstanding > 0 ? "text-rose-500" : "text-gray-300"}`}>
                      {r.outstanding > 0 ? `$${r.outstanding.toLocaleString()}` : "—"}
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(r.dueDate)}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${style.bg} ${style.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {r.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm">
        <span className="text-gray-400">Showing <span className="font-medium text-gray-600">{records.length}</span> records</span>
        <span className="text-gray-600">
          Outstanding: <span className="font-semibold text-rose-500">${totalOutstanding.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
}