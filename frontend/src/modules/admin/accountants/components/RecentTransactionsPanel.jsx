import {
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useRecentTransactions } from "../hooks/useAccountants";

function formatTxnDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RecentTransactionsPanel() {
  const { data: transactions = [], isLoading } = useRecentTransactions(6);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Recent Transactions
      </h2>
      <p className="text-sm text-gray-500 mt-0.5 mb-4">
        Latest financial activity
      </p>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((txn) => {
            const isCredit = txn.direction === "credit";
            return (
              <div key={txn.id} className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCredit ? "bg-emerald-50" : "bg-rose-50"
                    }`}
                  >
                    {isCredit ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {txn.type}
                    </p>
                    <p className="text-sm text-gray-500">{txn.person}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatTxnDate(txn.occurredAt)} · {txn.txnId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${isCredit ? "text-emerald-600" : "text-rose-500"}`}
                  >
                    {isCredit ? "+" : "-"}$
                    {Math.abs(txn.amount).toLocaleString()}.00
                  </p>
                  <div
                    className={`flex items-center gap-1 justify-end text-xs mt-0.5 ${
                      txn.status === "completed"
                        ? "text-emerald-600"
                        : "text-amber-500"
                    }`}
                  >
                    {txn.status === "completed" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {txn.status === "completed" ? "Completed" : "Pending"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 mt-5">
        View all transactions →
      </button>
    </div>
  );
}
