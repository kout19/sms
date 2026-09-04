import {
  Search,
  Plus,
  MoreHorizontal,
  ChevronDown,
  AlertCircle,
  Ruler,
  Microscope,
  BookOpen,
  Globe,
  Monitor,
  Dumbbell,
  Palette,
  Languages,
  Eye,
  Pencil,
  UserPlus,
  Users,
  Power,
} from "lucide-react";
import StatusBadge from "../../../../shared/components/StatusBadge";
import TagList from "../../../../shared/components/TagList";
import Avatar from "../../../../shared/components/Avatar";
import DropdownMenu from "../../../../shared/components/DropdownMenu";

const DEPARTMENT_ICONS = {
  ruler: Ruler,
  microscope: Microscope,
  "book-open": BookOpen,
  globe: Globe,
  monitor: Monitor,
  dumbbell: Dumbbell,
  palette: Palette,
  languages: Languages,
};

function DepartmentIcon({ icon }) {
  const Icon = DEPARTMENT_ICONS[icon] || BookOpen;
  return (
    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-gray-500" />
    </div>
  );
}

export default function DepartmentTable({
  departments,
  totalCount,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onCreateClick,
  onAction,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* toolbar - wraps onto a new line on narrow screens instead of squeezing */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Department Registry
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {departments.length} of {totalCount} departments
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search departments..."
              className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Department
          </button>
        </div>
      </div>

      {/* horizontal scroll wrapper - header row and data rows scroll TOGETHER,
          so column labels never drift out of alignment with the data below them */}
      <div className="overflow-x-auto">
        <div className="min-w-[920px]">
          <div className="grid grid-cols-[2fr_1.6fr_0.9fr_1fr_2fr_0.9fr_0.5fr] gap-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
            <span>Department</span>
            <span>Head of Department</span>
            <span>Teachers</span>
            <span>Students</span>
            <span>Subjects</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          <div>
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="grid grid-cols-[2fr_1.6fr_0.9fr_1fr_2fr_0.9fr_0.5fr] gap-4 px-6 py-4 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <DepartmentIcon icon={dept.icon} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {dept.name}
                    </p>
                    <p className="text-xs text-gray-400">{dept.code}</p>
                  </div>
                </div>

                <div>
                  {dept.head ? (
                    <div className="flex items-center gap-2.5">
                      <Avatar name={dept.head} />
                      <span className="text-sm text-gray-700">{dept.head}</span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium">
                      <AlertCircle className="w-3 h-3" />
                      Vacant
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    {dept.teacherCount}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">staff</span>
                </div>

                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    {dept.studentCount}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">enrolled</span>
                </div>

                <TagList items={dept.subjects} visibleCount={3} />

                <StatusBadge isActive={dept.isActive} />

                <div className="flex justify-end">
                  <DropdownMenu
                    trigger={
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    }
                    items={[
                      {
                        label: "View Details",
                        icon: Eye,
                        onClick: () => onAction("view", dept),
                      },
                      {
                        label: "Edit Department",
                        icon: Pencil,
                        onClick: () => onAction("edit", dept),
                      },
                      {
                        label: "Assign Head",
                        icon: UserPlus,
                        onClick: () => onAction("assignHead", dept),
                      },
                      {
                        label: "Manage Staff",
                        icon: Users,
                        onClick: () => onAction("manageStaff", dept),
                      },
                      {
                        label: dept.isActive ? "Deactivate" : "Activate",
                        icon: Power,
                        variant: dept.isActive ? "danger" : "default",
                        onClick: () => onAction("toggleStatus", dept),
                      },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
