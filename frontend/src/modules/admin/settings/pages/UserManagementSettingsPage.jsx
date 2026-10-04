import { useState } from "react";
import { Users } from "lucide-react";
import UsersTable from "../components/user-management/UsersTable";
import UserDetailsPanel from "../components/user-management/UserDetailsPanel";
import UserEditPanel from "../components/user-management/UserEditPanel";
import DashboardHeader from "../../shared/components/DashboardHeader";
import StatCard from "@shared/components/StatCard";
export default function UserManagementSettingsPage() {
  const [viewingUserId, setViewingUserId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);

  const statData=[
    {title: "Total Users", subtitle:"", value:7, icon:Users, trend:2.5},
    {title: "Total Users", subtitle:"", value:7, icon:Users, trend:2.5},
    {title: "Total Users", subtitle:"", value:7, icon:Users, trend:2.5},
    {title: "Total Users", subtitle:"", value:7, icon:Users, trend:2.5}
  ]
  return (
    <div className="space-y-6 bg-gray-50 p-6 min-h-screen">
      <DashboardHeader
        title="User Management"
        subtitle="Manage users, their roles, and access permissions."
        icon={Users}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statData.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            value={stat.value}
            title={stat.title}
            subtitle={stat.subtitle}
            trend={stat.trend}
            trendDirection={stat.trendDirection}
            tone={stat.tone}
            color={stat.color}
          />
        ))}
      </div>

      <UsersTable
        onView={(id) => setViewingUserId(id)}
        onEdit={(id) => {
          setEditingUserId(id);
          setViewingUserId(null);
        }}
      />

      <UserDetailsPanel
        userId={viewingUserId}
        isOpen={Boolean(viewingUserId)}
        onClose={() => setViewingUserId(null)}
        onEdit={(id) => {
          setEditingUserId(id);
          setViewingUserId(null);
        }}
      />

      <UserEditPanel
        userId={editingUserId}
        isOpen={Boolean(editingUserId)}
        onClose={() => setEditingUserId(null)}
      />
    </div>
  );
}
