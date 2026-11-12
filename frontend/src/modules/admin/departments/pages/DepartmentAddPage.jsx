import { useNavigate } from "react-router-dom";
import DepartmentFormModal from "../components/DepartmentFormModal";

export default function DepartmentAddPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-slate-50 p-6">
      <DepartmentFormModal
        mode="create"
        isOpen
        embedded
        onClose={() => navigate("/admin/departments")}
        onSaved={(message) =>
          navigate("/admin/departments", {
            replace: true,
            state: { notice: message },
          })
        }
      />
    </div>
  );
}
