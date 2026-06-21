import { useState } from "react";
import { ClipboardList, Check, Clock } from "lucide-react";
import PageHeader from "../../../shared/components/dashboard/PageHeader";
import SectionCard from "../../../shared/components/dashboard/SectionCard";
import TabPills from "../../../shared/components/dashboard/TabPills";
import { pendingAssignments, submittedAssignments } from "../data/studentMockData";

const tabs = [
  { id: "pending", label: "Pending", icon: Clock },
  { id: "submitted", label: "Submitted", icon: Check },
];

const StudentAssignmentsPage = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const items = activeTab === "pending" ? pendingAssignments : submittedAssignments;

  return (
    <div className="p-6 w-full bg-gray-50 min-h-full">
      <PageHeader
        icon={ClipboardList}
        title="Assignments"
        subtitle="Track pending work and submitted assignments"
        accent="emerald"
      />

      <SectionCard className="mb-6">
        <TabPills tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </SectionCard>

      <SectionCard
        title={activeTab === "pending" ? "Pending Assignments" : "Submitted Assignments"}
        badge={`${items.length} items`}
      >
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-slate-100 hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-medium text-sm text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500 mt-1">{item.subject}</p>
              </div>
              <div className="text-right">
                {activeTab === "pending" ? (
                  <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                    Due {item.due}
                  </span>
                ) : (
                  <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    {item.grade} · {item.submitted}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default StudentAssignmentsPage;
