import { useState } from "react";
import {
  Search,
  Filter,
  RotateCcw,
  MoreHorizontal,
  Eye,
  Pencil,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Avatar from "@shared/components/Avatar";
import DropdownMenu from "@shared/components/DropdownMenu";
import { ATTENDANCE_STATUSES } from "../constants/colorConstants";

function SortHeader({ label, sortKey, activeSort, onSort }) {
  const isActive = activeSort.key === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wide hover:text-gray-600"
    >
      {label}
      {isActive &&
        (activeSort.dir === "asc" ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        ))}
    </button>
  );
}

export default function AttendanceTable({
  records,
  search,
  onSearchChange,
  date,
  onDateChange,
  classFilter,
  onClassFilterChange,
  statusFilter,
  onStatusFilterChange,
  classOptions,
  onReset,
  onSetStatus,
  onAction,
}) {
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState({ key: "studentName", dir: "asc" });

  const toggleAll = () =>
    setSelected(
      selected.length === records.length ? [] : records.map((r) => r.id),
    );
  const toggleOne = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  const sorted = [...records].sort((a, b) => {
    const aVal = a[sort.key] ?? "";
    const bVal = b[sort.key] ?? "";
    const cmp = String(aVal).localeCompare(String(bVal));
    return sort.dir === "asc" ? cmp : -cmp;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 flex-wrap px-6 py-4 border-b border-gray-100">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search students or IDs..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={classFilter}
          onChange={(e) => onClassFilterChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Classes</option>
          {classOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Statuses</option>
          {Object.entries(ATTENDANCE_STATUSES).map(([key, s]) => (
            <option key={key} value={key}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[0.3fr_1.6fr_1fr_1fr_0.9fr_1fr_1.4fr_0.5fr] gap-4 px-6 py-3 items-center border-b border-gray-100">
            <input
              type="checkbox"
              checked={selected.length === records.length && records.length > 0}
              onChange={toggleAll}
              className="rounded border-gray-300"
            />
            <SortHeader
              label="Student"
              sortKey="studentName"
              activeSort={sort}
              onSort={handleSort}
            />
            <SortHeader
              label="ID"
              sortKey="studentCode"
              activeSort={sort}
              onSort={handleSort}
            />
            <SortHeader
              label="Class"
              sortKey="className"
              activeSort={sort}
              onSort={handleSort}
            />
            <SortHeader
              label="Status"
              sortKey="status"
              activeSort={sort}
              onSort={handleSort}
            />
            <SortHeader
              label="Check-in"
              sortKey="checkIn"
              activeSort={sort}
              onSort={handleSort}
            />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Remarks
            </span>
            <span></span>
          </div>

          <div>
            {sorted.map((record) => {
              const style = ATTENDANCE_STATUSES[record.status];
              return (
                <div
                  key={record.id}
                  className="grid grid-cols-[0.3fr_1.6fr_1fr_1fr_0.9fr_1fr_1.4fr_0.5fr] gap-4 px-6 py-3 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(record.id)}
                    onChange={() => toggleOne(record.id)}
                    className="rounded border-gray-300"
                  />
                  <div className="flex items-center gap-2.5">
                    <Avatar name={record.studentName} colorful />
                    <span className="text-sm font-medium text-gray-900">
                      {record.studentName}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 font-mono">
                    {record.studentCode}
                  </span>
                  <span className="text-sm text-gray-600">
                    {record.className}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${style.bg} ${style.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    {style.label}
                  </span>
                  <span className="text-sm text-gray-500">
                    {record.checkIn || "—"}
                  </span>
                  <span className="text-sm text-gray-400 truncate">
                    {record.remarks || "—"}
                  </span>
                  <div className="flex justify-end">
                    <DropdownMenu
                      trigger={
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      }
                      sections={[
                        {
                          title: "Set Status",
                          items: Object.entries(ATTENDANCE_STATUSES).map(
                            ([key, s]) => ({
                              label: s.label,
                              dotColor: s.dot,
                              selected: record.status === key,
                              onClick: () => onSetStatus(record.id, key),
                            }),
                          ),
                        },
                        {
                          items: [
                            {
                              label: "View History",
                              icon: Eye,
                              onClick: () => onAction("viewHistory", record),
                            },
                            {
                              label: "Add Remark",
                              icon: Pencil,
                              onClick: () => onAction("addRemark", record),
                            },
                          ],
                        },
                      ]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
