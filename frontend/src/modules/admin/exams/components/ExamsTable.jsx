import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  Archive,
  Send,
  Trash2,
} from "lucide-react";

import ExamDetailsModal from "./ExamDeatilsModal";
import EditExamModal from "./EditExamModal"; // Assuming Edit modal component exist/created

const TYPE_STYLES = {
  Mock: "bg-amber-50 text-amber-600 border-amber-200/60",
  Quiz: "bg-cyan-50 text-cyan-600 border-cyan-200/60",
  Monthly: "bg-purple-50 text-purple-600 border-purple-200/60",
  Midterm: "bg-amber-50 text-amber-600 border-amber-200/60",
  Final: "bg-rose-50 text-rose-500 border-rose-200/60",
};

const STATUS_STYLES = {
  Completed: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    dot: "bg-purple-500",
  },
  Active: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  Upcoming: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  Draft: { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
};

const COLUMNS = [
  { key: "name", label: "EXAM NAME" },
  { key: "type", label: "TYPE" },
  { key: "term", label: "TERM" },
  { key: "classes", label: "CLASSES", sortable: false },
  { key: "date", label: "DATE" },
  { key: "students", label: "STUDENTS" },
  { key: "status", label: "STATUS" },
];

const ExamsTable = ({
  exams,
  totalCount,
  isLoading,
  filters,
  onFilterChange,
  onPublishExam,
  onArchiveExam,
  onDeleteExam,
}) => {
  // Dropdown menu state
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Modal states internal to the table
  const [selectedExam, setSelectedExam] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (fieldKey) => {
    let order = "asc";
    if (filters.sortField === fieldKey && filters.sortOrder === "asc") {
      order = "desc";
    }
    onFilterChange({ ...filters, sortField: fieldKey, sortOrder: order });
  };

  // Row Action Handlers
  const handleOpenDetails = (row) => {
    setSelectedExam(row);
    setIsDetailsOpen(true);
    setActiveMenuId(null);
  };

  const handleOpenEdit = (row) => {
    setSelectedExam(row);
    setIsEditOpen(true);
    setActiveMenuId(null);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs space-y-4 overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100/80 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search exams, types, classes..."
              value={filters.search}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value })
              }
              className="w-full pl-9 pr-4 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </div>

            <select
              value={filters.year}
              onChange={(e) =>
                onFilterChange({ ...filters, year: e.target.value })
              }
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option>All Years</option>
              <option>2026–2027</option>
            </select>

            <select
              value={filters.term}
              onChange={(e) =>
                onFilterChange({ ...filters, term: e.target.value })
              }
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option>All Terms</option>
              <option>Term 1</option>
              <option>Term 2</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) =>
                onFilterChange({ ...filters, type: e.target.value })
              }
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option>All Types</option>
              <option>Mock</option>
              <option>Quiz</option>
              <option>Monthly</option>
              <option>Midterm</option>
              <option>Final</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) =>
                onFilterChange({ ...filters, status: e.target.value })
              }
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option>All Statuss</option>
              <option>Completed</option>
              <option>Active</option>
              <option>Upcoming</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/40 select-none">
                {COLUMNS.map((col) => {
                  const isSortable = col.sortable !== false;
                  const isSorted = filters.sortField === col.key;
                  return (
                    <th
                      key={col.key}
                      onClick={() => isSortable && handleSort(col.key)}
                      className={`px-5 py-3 ${
                        isSortable ? "cursor-pointer hover:text-slate-700" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span>{col.label}</span>
                        {isSortable && (
                          <div className="flex flex-col text-slate-400">
                            {isSorted ? (
                              filters.sortOrder === "asc" ? (
                                <ChevronUp className="w-3.5 h-3.5 text-indigo-600" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                              )
                            ) : (
                              <ChevronUp className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
                <th className="px-5 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    Loading examinations...
                  </td>
                </tr>
              ) : exams.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    No examinations found.
                  </td>
                </tr>
              ) : (
                exams.map((row) => {
                  const statusStyle =
                    STATUS_STYLES[row.status] || STATUS_STYLES.Draft;
                  const typeStyle =
                    TYPE_STYLES[row.type] || "bg-slate-100 text-slate-600";
                  const isMenuOpen = activeMenuId === row.id;

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleOpenDetails(row)}
                          className="font-bold text-slate-900 hover:text-indigo-600 text-left transition-colors"
                        >
                          {row.name}
                        </button>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                          {row.year} · {row.time} · {row.duration}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${typeStyle}`}
                        >
                          {row.type}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 font-medium text-slate-600">
                        {row.term}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {row.classes.map((cls, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-md"
                            >
                              {cls}
                            </span>
                          ))}
                          {row.extraClassesCount > 0 && (
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[11px] font-medium rounded-md">
                              +{row.extraClassesCount}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-800">
                          {row.date}
                        </div>
                        {row.endDate && (
                          <div className="text-[10px] text-slate-400 font-medium">
                            to {row.endDate}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-3.5 font-semibold text-slate-700">
                        {row.students}
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                          />
                          {row.status}
                        </span>
                      </td>

                      {/* Action 3-Dots Dropdown */}
                      <td className="px-5 py-3.5 text-right relative">
                        <button
                          onClick={() =>
                            setActiveMenuId(isMenuOpen ? null : row.id)
                          }
                          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div
                            ref={menuRef}
                            className="absolute right-6 top-10 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30 text-left animate-in fade-in zoom-in-95 duration-100"
                          >
                            <button
                              onClick={() => handleOpenDetails(row)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400" />{" "}
                              View Details
                            </button>
                            <button
                              onClick={() => handleOpenEdit(row)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                            >
                              <Edit className="w-3.5 h-3.5 text-slate-400" />{" "}
                              Edit Exam
                            </button>
                            <button
                              onClick={() => {
                                onPublishExam(row);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                            >
                              <Send className="w-3.5 h-3.5 text-slate-400" />{" "}
                              Publish
                            </button>
                            <button
                              onClick={() => {
                                onArchiveExam(row);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                            >
                              <Archive className="w-3.5 h-3.5 text-slate-400" />{" "}
                              Archive
                            </button>
                            <div className="my-1 border-t border-slate-100" />
                            <button
                              onClick={() => {
                                onDeleteExam(row);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />{" "}
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-700">{exams.length}</span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">{totalCount}</span>{" "}
            examinations
          </div>
          <div>Academic Year 2026–2027</div>
        </div>
      </div>

      {/* Row-Level Modals mounted inside Table */}
      <ExamDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        examId={selectedExam?.id}
        initialData={selectedExam}
        onEdit={(exam) => handleOpenEdit(exam)}
      />

      {isEditOpen && (
        <EditExamModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          exam={selectedExam}
        />
      )}
    </>
  );
};

export default ExamsTable;
