import { useNavigate } from "react-router-dom";
import AccountantFormModal from "../components/AccountantFormModal";

export default function AccountantAddPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-slate-50 p-6">
      <AccountantFormModal
        mode="create"
        isOpen
        embedded
        onClose={() => navigate("/admin/accountants")}
        onSaved={(message) =>
          navigate("/admin/accountants", {
            replace: true,
            state: { notice: message },
          })
        }
      />
    </div>
  );
}
