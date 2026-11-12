import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useAccountants,
  useSetAccountantStatus,
} from "../hooks/useAccountants";
import FinanceOverviewCards from "../components/FinanceOverviewCards";
import AccountantStaffTable from "../components/AccountantStaffTable";
import AccountantFormModal from "../components/AccountantFormModal";
import AccountantDetailsDrawer from "../components/AccountantDetailsDrawer";
import { getApiError } from "../utils/accountantForm";

const PAGE_SIZE = 10;

export default function AccountantsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [formMode, setFormMode] = useState("create");
  const [selectedAccountantId, setSelectedAccountantId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState(location.state?.notice || "");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim().replace(/\s+/g, " "));
      setPage(1);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const previousTitle = document.title;
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const previousRobots = robotsMeta?.content;
    const meta = robotsMeta || document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    if (!robotsMeta) document.head.appendChild(meta);
    document.title = "Accountants | School Management";

    return () => {
      document.title = previousTitle;
      if (robotsMeta) {
        robotsMeta.content = previousRobots;
      } else {
        meta.remove();
      }
    };
  }, []);

  const accountantQuery = useAccountants({
    search: debouncedSearch,
    status: statusFilter,
    page,
    limit: PAGE_SIZE,
  });
  const setStatus = useSetAccountantStatus();
  const result = accountantQuery.data;
  const accountants = result?.data || [];
  const total = result?.meta?.total || 0;
  const totalPages = result?.meta?.totalPages || 1;

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedAccountantId(null);
  };

  const openForm = (mode, accountant) => {
    setFormMode(mode);
    setSelectedAccountantId(accountant?.id || null);
    setIsFormOpen(true);
    setActionError("");
    setNotice("");
  };

  const handleAction = (actionType, accountant) => {
    setSelectedAccountantId(accountant.id);
    setActionError("");
    setNotice("");

    if (actionType === "view") {
      setIsDetailsOpen(true);
      return;
    }
    if (actionType === "edit") {
      openForm("edit", accountant);
      return;
    }
    if (actionType === "toggleStatus") {
      if (setStatus.isPending) return;
      const nextIsActive = !accountant.isActive;
      const verb = nextIsActive ? "activate" : "deactivate";
      if (
        !window.confirm(
          `Are you sure you want to ${verb} ${accountant.firstName} ${accountant.lastName}?`,
        )
      ) {
        return;
      }
      setStatus.mutate(
        { id: accountant.id, isActive: nextIsActive },
        {
          onSuccess: () =>
            setNotice(
              nextIsActive
                ? "Accountant activated."
                : "Accountant deactivated. The account and its history were retained.",
            ),
          onError: (error) => setActionError(getApiError(error)),
        },
      );
    }
  };

  const handleSaved = (message) => {
    setNotice(message);
    setActionError("");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Finance and accountants
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage accountant accounts for this school
        </p>
      </div>

      <FinanceOverviewCards />

      {notice ? (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {notice}
        </p>
      ) : null}
      {actionError ? (
        <p
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {actionError}
        </p>
      ) : null}

      <AccountantStaffTable
        accountants={accountants}
        total={total}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setNotice("");
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(value) => {
          setStatusFilter(value);
          setPage(1);
          setNotice("");
        }}
        onCreateClick={() => navigate("/admin/accountants/add")}
        onAction={handleAction}
        isLoading={accountantQuery.isPending}
        isFetching={accountantQuery.isFetching}
        error={
          accountantQuery.isError
            ? getApiError(accountantQuery.error)
            : ""
        }
        onRetry={() => accountantQuery.refetch()}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <AccountantFormModal
        mode={formMode}
        accountantId={selectedAccountantId}
        isOpen={isFormOpen}
        onClose={closeForm}
        onSaved={handleSaved}
      />
      <AccountantDetailsDrawer
        accountantId={selectedAccountantId}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedAccountantId(null);
        }}
      />
    </div>
  );
}
