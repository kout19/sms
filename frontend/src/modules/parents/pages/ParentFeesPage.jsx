import { DollarSign } from "lucide-react";
import PageHeader from "../../../shared/components/dashboard/PageHeader";
import SectionCard from "../../../shared/components/dashboard/SectionCard";
import { feeRecords } from "../data/parentMockData";

const ParentFeesPage = () => {
  const totalPaid = feeRecords.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="p-6 w-full bg-gray-50 min-h-full">
      <PageHeader
        icon={DollarSign}
        title="Fees & Payments"
        subtitle="View payment history and outstanding balances"
        accent="violet"
      />

      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm mb-6">
        <p className="text-xs text-slate-500">Total Paid</p>
        <p className="text-2xl font-bold text-violet-600 mt-1">
          ${totalPaid.toLocaleString()}
        </p>
      </div>

      <SectionCard title="Payment History" badge={`${feeRecords.length} records`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="pb-3 font-medium">Term</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {feeRecords.map((record) => (
                <tr
                  key={record.term}
                  className="border-b border-slate-50 hover:bg-gray-50"
                >
                  <td className="py-3 font-medium text-slate-800">{record.term}</td>
                  <td className="py-3 text-slate-600">${record.amount}</td>
                  <td className="py-3">
                    <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{record.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

export default ParentFeesPage;
