import { useState } from "react";
import { Download } from "lucide-react";
import DashboardHeader from "../../shared/components/DashboardHeader";
import ReportFilterBar from "../../shared/components/ReportFilterBar";
import FinanceReportSummaryCard from "../cards/financial-reports/FinanceReportSummaryCard";
import RevenueTrendChart from "../components/financial-reports/RevenueTrendChart";
import RevenueByFeeTypeCard from "../cards/financial-reports/RevenueByFeeTypeCard"; 
import ExpensesByCategoryCard from "../cards/financial-reports/ExpensesByCategoryCard";
import DetailedFeeRecordsTable from "../components/financial-reports/DetailedFeeRecordsTable";


const DEFAULT_FILTERS = [{ year: "2026-2027", term: "all", grade: "all"} ];
const FinancialReportsPage =()=>{
    const [pendingFilters, setPendingFilters] = useState({});
    const [financeFilters, setFinanceFilters] = useState(DEFAULT_FILTERS);


    const financialFilters = [
      {
        name: "period",
        type: "select",
        options: [
          { value: "year", label: "Full Year" },
          { value: "first-term", label: "Term I" },
          { value: "second-term", label: "Term II" },
          { value: "week", label: "This Week" },
          { value: "month", label: "This Month" },
        ],
      },
      {
        name: "year",
        type: "select",
        options: [
          { value: "2026-2027", label: "2026-2027" },
          { value: "2025-2026", label: "2025-2026" },
        ],
      },
      {
        name: "feeType",
        type: "select",
        options: [
          { value: "all", label: "All Fee Types" },
          { value: "tuition", label: "Tuition" },
          { value: "transport", label: "Transport" },
          { value: "meal", label: "Meal & Canteen" },
          { value: "activity", label: "Activity Fees" },
        ],
      },
      {
        name: "status",
        type: "select",
        options: [
          { value: "all", label: "All Statuses" },
          { value: "paid", label: "Paid" },
          { value: "pending", label: "Pending" },
          { value: "partial", label: "Partially Paid" },
          { value: "overdue", label: "Overdue" },
        ],
      },
    ];
    return (
      <div className="bg-gray-50 p-6  space-y-6">
        <div>
          <DashboardHeader
            title="Financial Analytics Report"
            subtitle="Revenue, fee collections, expenses, and outstanding balances for each term"
            icon={Download}
            accent="white"
          />
        </div>
        <div>
          <ReportFilterBar
            pendingFilters={{ pendingFilters }}
            onChange={() => {
              setPendingFilters;
            }}
            onApply={() => {
              setFinanceFilters(pendingFilters);
            }}
            onReset={() => {
              setPendingFilters(DEFAULT_FILTERS);
              setFinanceFilters(DEFAULT_FILTERS);
            }}
            filters={financialFilters}
          />
        </div>
        <div>
          <FinanceReportSummaryCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueTrendChart filters={financeFilters} />
          <RevenueByFeeTypeCard filters={financeFilters} />
        </div>
        <ExpensesByCategoryCard filters={financeFilters} />
        <DetailedFeeRecordsTable filters={financeFilters} />
      </div>
    );
}


export default FinancialReportsPage;