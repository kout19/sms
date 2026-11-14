import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Eye,
  Edit,
  Power,
  UserPlus,
  Trash2,
  Filter,
} from "lucide-react";
import { useToggleSubjectStatus, useDeleteSubject } from "../hooks/useSubjects";
import SubjectDetailsModal from "./SubjectDetailModal";
import EditSubjectModal from "./EditSubjectModal";
import AssignTeacherModal from "./AssignTeacherModal";

const DEPARTMENT_COLORS = {
  Sciences: "bg-blue-50 text-blue-600 border-blue-100",
  Technology: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Humanities: "bg-purple-50 text-purple-600 border-purple-100",
  Languages: "bg-amber-50 text-amber-600 border-amber-100",
  Arts: "bg-pink-50 text-pink-600 border-pink-100",
  Sports: "bg-orange-50 text-orange-600 border-orange-100",
};

const SubjectsTable = ({
  subjects,
  totalCount,
  totalPages,
  isLoading,
  filters,
  departments,
  academicYears,
  onFilterChange,
  onPageChange,
}) => {
  const toggleStatusMutation = useToggleSubjectStatus();
  const deleteSubjectMutation = useDeleteSubject();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignTeacherOpen, setIsAssignTeacherOpen] = useState(false);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Popover menu state
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sort Handler
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Toggle Action Trigger
  const handleToggleStatus = (id) => {
    toggleStatusMutation.mutate(id);
    setActiveMenuId(null);
  };

  // Delete Action Trigger
  const handleDelete = (id) => {
    deleteSubjectMutation.mutate(id);
    setActiveMenuId(null);
  };

  // Local sorting pipeline
  const sortedSubjects = useMemo(() => {
    if (!sortConfig.key) return subjects;

    return [...subjects].sort((a, b) => {
      const key = sortConfig.key;
      let aVal = a[key];
      let bVal = b[key];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [subjects, sortConfig]);

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return (
        <ChevronDown className="w-3 h-3 text-slate-300 group-hover:text-slate-400" />
      );
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-3 h-3 text-blue-600" />
    ) : (
      <ChevronDown className="w-3 h-3 text-blue-600" />
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-xs space-y-4">
      {/* Search and Filters Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects, codes, teachers..."
              value={filters.search}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value })
              }
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Filter:</span>
          </div>

          {/* Department Filter */}
          <select
            value={filters.departmentId}
            onChange={(e) =>
              onFilterChange({ ...filters, departmentId: e.target.value })
            }
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-600 focus:outline-none"
          >
            <option value="All">All Departments</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>

          {/* Academic year filter */}
          <select
            value={filters.academicYear}
            onChange={(e) =>
              onFilterChange({ ...filters, academicYear: e.target.value })
            }
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-600 focus:outline-none"
          >
            <option value="All">All Academic Years</option>
            {academicYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({ ...filters, status: e.target.value })
            }
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-600 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/50 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-100 font-medium">
            <tr>
              <th
                onClick={() => handleSort("name")}
                className="px-5 py-3 cursor-pointer select-none hover:text-slate-600"
              >
                <div className="flex items-center gap-1 group">
                  <span>SUBJECT NAME</span>
                  {renderSortIcon("name")}
                </div>
              </th>
              <th
                onClick={() => handleSort("code")}
                className="px-5 py-3 cursor-pointer select-none hover:text-slate-600"
              >
                <div className="flex items-center gap-1 group">
                  <span>CODE</span>
                  {renderSortIcon("code")}
                </div>
              </th>
              <th
                onClick={() => handleSort("department")}
                className="px-5 py-3 cursor-pointer select-none hover:text-slate-600"
              >
                <div className="flex items-center gap-1 group">
                  <span>DEPARTMENT</span>
                  {renderSortIcon("department")}
                </div>
              </th>
              <th
                onClick={() => handleSort("grade")}
                className="px-5 py-3 cursor-pointer select-none hover:text-slate-600"
              >
                <div className="flex items-center gap-1 group">
                  <span>GRADE</span>
                  {renderSortIcon("grade")}
                </div>
              </th>
              <th
                onClick={() => handleSort("classCount")}
                className="px-5 py-3 cursor-pointer select-none hover:text-slate-600"
              >
                <div className="flex items-center gap-1 group">
                  <span>CLASSES</span>
                  {renderSortIcon("classCount")}
                </div>
              </th>
              <th
                onClick={() => handleSort("status")}
                className="px-5 py-3 cursor-pointer select-none hover:text-slate-600"
              >
                <div className="flex items-center gap-1 group">
                  <span>STATUS</span>
                  {renderSortIcon("status")}
                </div>
              </th>
              <th className="px-5 py-3">TEACHER</th>
              <th className="px-5 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {isLoading ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-12 text-center text-slate-400"
                >
                  Loading subjects data...
                </td>
              </tr>
            ) : sortedSubjects.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-12 text-center text-slate-400"
                >
                  No subjects found.
                </td>
              </tr>
            ) : (
              sortedSubjects.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-5 py-3.5 font-bold text-slate-800">
                    {row.name}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                    {row.code}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                        DEPARTMENT_COLORS[row.department] ||
                        "bg-slate-50 text-slate-600"
                      }`}
                    >
                      {row.department}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{row.grade}</td>
                  <td className="px-5 py-3.5 text-slate-700 font-semibold">
                    {row.classCount}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        row.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.status === "Active"
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }`}
                      />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold text-[10px] flex items-center justify-center">
                        {row.teacher?.initials || "NA"}
                      </div>
                      <span className="text-slate-700 text-xs">
                        {row.teacher?.name || "Unassigned"}
                      </span>
                    </div>
                  </td>
                  {/* Action Menu */}
                  <td className="px-5 py-3.5 text-right relative">
                    <button
                      onClick={() =>
                        setActiveMenuId(activeMenuId === row.id ? null : row.id)
                      }
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {activeMenuId === row.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-5 top-10 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 text-left space-y-0.5"
                      >
                        <button
                          onClick={() => {
                            setSelectedSubject(row);
                            setIsDetailsOpen(true);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" /> View
                          Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSubject(row);
                            setIsEditOpen(true);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-400" /> Edit
                          Subject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSubject(row);
                            setIsAssignTeacherOpen(true);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-slate-400" />{" "}
                          Assign Teacher
                        </button>
                        <button
                          onClick={() => handleToggleStatus(row.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <Power className="w-3.5 h-3.5 text-amber-500" />
                          {row.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />{" "}
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                  <SubjectDetailsModal
                    isOpen={isDetailsOpen}
                    onClose={() => setIsDetailsOpen(false)}
                    subject={selectedSubject}
                    onEdit={(sub) => {
                      setSelectedSubject(sub);
                      setIsEditOpen(true);
                    }}
                  />
                  <EditSubjectModal
                    key={`edit-${selectedSubject?.id || "none"}`}
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    subject={selectedSubject}
                    onEdit={(sub) => {
                      setSelectedSubject(sub);
                      setIsEditOpen(true);
                    }}
                  />
                  <AssignTeacherModal
                    key={`assign-${selectedSubject?.id || "none"}`}
                    isOpen={isAssignTeacherOpen}
                    onClose={() => setIsAssignTeacherOpen(false)}
                    subject={selectedSubject}
                  />
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
        <span>
          Showing <strong>{sortedSubjects.length}</strong> of{" "}
          <strong>{totalCount}</strong> subjects
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="disabled:opacity-40"
            disabled={filters.page <= 1 || isLoading}
            onClick={() => onPageChange(filters.page - 1)}
          >
            Previous
          </button>
          <span>
            Page {filters.page} of {totalPages}
          </span>
          <button
            type="button"
            className="disabled:opacity-40"
            disabled={filters.page >= totalPages || isLoading}
            onClick={() => onPageChange(filters.page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectsTable;
