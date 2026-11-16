import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import DashboardHeader from "../../shared/components/DashboardHeader";
import ReportFilterBar from "../../shared/components/ReportFilterBar";
import FinanceReportSummaryCard from "../cards/financial-reports/FinanceReportSummaryCard";
import RevenueTrendChart from "../components/financial-reports/RevenueTrendChart";
import RevenueByFeeTypeCard from "../cards/financial-reports/RevenueByFeeTypeCard";
import ExpensesByCategoryCard from "../cards/financial-reports/ExpensesByCategoryCard";
import DetailedFeeRecordsTable from "../components/financial-reports/DetailedFeeRecordsTable";

const DEFAULT_FILTERS = {
  academicYear: "all",
  startDate: "",
  endDate: "",
  classId: "all",
  sectionId: "all",
  studentId: "all",
  feeType: "all",
  paymentStatus: "all",
  paymentMethod: "all",
  expenseCategory: "all",
};

const FinancialReportsPage = () => {
  const [pendingFilters, setPendingFilters] = useState(DEFAULT_FILTERS);
  const [financeFilters, setFinanceFilters] = useState(DEFAULT_FILTERS);

  const financialFilters = useMemo(
    () => [
      {
        name: "academicYear",
        type: "select",
        options: [
          { value: "all", label: "All academic years" },
          { value: "2026-2027", label: "2026-2027" },
          { value: "2025-2026", label: "2025-2026" },
        ],
      },
      {
        name: "paymentStatus",
        type: "select",
        options: [
          { value: "all", label: "All payment statuses" },
          { value: "paid", label: "Paid" },
          { value: "partial", label: "Partially paid" },
          { value: "pending", label: "Pending" },
          { value: "overdue", label: "Overdue" },
        ],
      },
      {
        name: "paymentMethod",
        type: "select",
        options: [
          { value: "all", label: "All payment methods" },
          { value: "cash", label: "Cash" },
          { value: "bank_transfer", label: "Bank transfer" },
          { value: "mobile_money", label: "Mobile money" },
        ],
      },
      {
        name: "feeType",
        type: "select",
        options: [
          { value: "all", label: "All fee types" },
          { value: "tuition", label: "Tuition" },
          { value: "transport", label: "Transport" },
          { value: "meals", label: "Meals & canteen" },
          { value: "activity", label: "Activity" },
        ],
      },
    ],
    [],
  );

  return (
    <div className="space-y-6 bg-gray-50 p-6">
      <DashboardHeader
        title="Financial Reports"
        subtitle="Read-only financial reporting and analytics for the current tenant."
        icon={Download}
        accent="white"
      />

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        The current schema does not include fee, invoice, payment, refund, or expense tables. This report therefore stays read-only and clearly reports the missing data dependency instead of inventing financial records.
      </div>

      <ReportFilterBar
        pendingFilters={pendingFilters}
        onChange={setPendingFilters}
        onApply={() => setFinanceFilters(pendingFilters)}
        onReset={() => {
          setPendingFilters(DEFAULT_FILTERS);
          setFinanceFilters(DEFAULT_FILTERS);
        }}
        filters={financialFilters}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Active reporting period: <span className="font-semibold text-slate-800">All time</span>
      </div>

      <FinanceReportSummaryCard filters={financeFilters} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueTrendChart filters={financeFilters} />
        <RevenueByFeeTypeCard filters={financeFilters} />
      </div>

      <ExpensesByCategoryCard filters={financeFilters} />
      <DetailedFeeRecordsTable filters={financeFilters} />
    </div>
  );
};

export default FinancialReportsPage;