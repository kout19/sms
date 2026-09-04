import { useState } from "react";
import {
  useAccountants,
  useToggleAccountantStatus,
} from "../hooks/useAccountants";
import FinanceOverviewCards from "../components/FinanceOverviewCards";
import FinanceStaffTable from "../components/AccountantStaffTable";
import RecentTransactionsPanel from "../components/RecentTransactionsPanel";

export default function AccountantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: accountants = [],
    isLoading,
    error,
  } = useAccountants({ search, status: statusFilter });
  const toggleStatus = useToggleAccountantStatus();

  const handleAction = (actionType, accountant) => {
    switch (actionType) {
      case "toggleStatus":
        toggleStatus.mutate(accountant.id);
        break;
      case "view":
        console.log("view profile:", accountant.name); // TODO
        break;
      case "edit":
        console.log("edit:", accountant.name); // TODO
        break;
      case "reassign":
        console.log("reassign responsibilities:", accountant.name); // TODO
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Finance and accountants
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitor finance staff, transactions, fees, and financial health
          </p>
        </div>
      </div>

      <FinanceOverviewCards />

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading staff...</p>
      ) : error ? (
        <p className="text-sm text-red-500">Failed to load finance staff.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FinanceStaffTable
              accountants={accountants}
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onCreateClick={() => {
                // TODO: open create-accountant modal
              }}
              onAction={handleAction}
            />
          </div>
          <div className="lg:col-span-1">
            <RecentTransactionsPanel />
          </div>
        </div>
      )}
    </div>
  );
}
