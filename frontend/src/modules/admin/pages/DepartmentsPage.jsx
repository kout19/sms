import {useState} from "react";
import DepartmentCard from "../components/cards/DepartmentCards";
import {
  useDepartments,
  useToggleDepartmentStatus,
} from "../hooks/useDepartments";
import DepartmentTable from "../components/DepartmentTable";
import { Building2, Users, CheckSquare, TrendingUp } from "lucide-react";

const deptCards = [
  {
    icon: Building2,
    value: "8",
    title: "total Departments",
    descriptions: "All disciplines",
    icongBgColor: "bg-gray-200",
    iconColor: "text-blue-500",
    iconSize: 24,
  },
  {
    icon: CheckSquare,
    value: "7",
    title: "Active",
    descriptions: "Currently  running",
    change: "+1 this term",
    isPosetive: true,
    icongBgColor: "bg-gray-200",
    iconColor: "text-green-500",
    iconSize: 24,
  },
  {
    icon: Users,
    value: "8",
    title: "total users",
    descriptions: "All disciplines",
    icongBgColor: "bg-gray-200",
    iconColor: "text-blue-500",
    iconSize: 24,
  },

  {
    icon: Users,
    value: "78",
    title: "Total Staff",
    descriptions: "2813 students enrolled",
    change: "+4 % this term",
    isPosetive: true,
    icongBgColor: "bg-gray-200",
    iconColor: "text-blue-500",
    iconSize: 24,
  },
];
export default function  DepartmentsPage () {
  const [search, setSearch] = useState("");
  const [statusFileter, setStatusFilter] = useState("all");
  const {data:departments=[], isLoading, error} = useDepartments({
    search, 
    status: statusFileter
  });

  const toggleStatus = useToggleDepartmentStatus();
  const handleAction= (actionType, department) =>{
    switch(actionType){
      case "toggleStatus":
        toggleStatus.mutate(department.id);
        break;
      case "edit":
         console.log("edit");
        //to do here
        break;
      case "view":
        //to do here
        break;
      case "manageStaff":
        //to do here
        break;
      case "assingHead":
        //to do here
        break;
      default:
        break;
    }
  };

    if (isLoading)
      return (
        <div className="p-6 text-sm text-gray-400">Loading departments...</div>
      );
    if (error)
      return (
        <div className="p-6 text-sm text-red-500">
          Failed to load departments.
        </div>
      );


  return (
    <div className=" p-6 bg-slate-50 min-h-full  ">
      <header className="">
        <div>
          <h1 className="text-xl font-bold ">Department Management</h1>
          <span className="text-sm text-slate-500 ">
            Oversee academic departments, heads, staff collections and subjects
          </span>
        </div>
      </header>
      <main>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {deptCards.map((card) => (
            <DepartmentCard key={card.title} {...card} />
          ))}
        </div>
        <div>
        <DepartmentTable
          departments={departments}
          totalCount={departments.length}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFileter}
          onStatusFilterChange={setStatusFilter}
          onCreateClick={() => {
            //to do here
          }}
          onAction={handleAction}
        />

        </div>
      </main>
    </div>
  );
};

