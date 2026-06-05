import React, { useState } from "react";
import {
  Plus,
  Search,
  Mail,
  Phone,
  Trash2,
  Pencil,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const classes = [
  { id: 1, name: "Grade 9" },
  { id: 2, name: "Grade 10" },
  { id: 3, name: "Grade 11" },
  { id: 4, name: "Grade 12" },
];

const studentsData = [
  {
    id: 1,
    name: "John Doe",
    email: "jdoe@school.edu",
    phone: "(555) 123-4567",
    grade: "Grade 9",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jsmith@school.edu",
    phone: "(555) 234-5678",
    grade: "Grade 10",
    status: "Active",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "ajohnson@school.edu",
    phone: "(555) 345-6789",
    grade: "Grade 11",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Bob Brown",
    email: "bbrown@school.edu",
    phone: "(555) 456-7890",
    grade: "Grade 12",
    status: "Active",
  },
  {
    id: 5,
    name: "Eva Davis",
    email: "edavis@school.edu",
    phone: "(555) 567-8901",
    grade: "Grade 9",
    status: "Active",
  },
  {
    id: 6,
    name: "Ethan Gray",
    email: "ethan.g@school.edu",
    phone: "(555) 678-9012",
    grade: "Grade 11",
    status: "Inactive",
  },
  {
    id: 7,
    name: "Sophia Rose",
    email: "sophia.r@school.edu",
    phone: "(555) 789-0123",
    grade: "Grade 9",
    status: "Active",
  },
  {
    id: 8,
    name: "Mason Lee",
    email: "mason.l@school.edu",
    phone: "(555) 890-1234",
    grade: "Grade 12",
    status: "Active",
  },
  {
    id: 9,
    name: "Olivia Brown",
    email: "olivia.b@school.edu",
    phone: "(555) 901-2345",
    grade: "Grade 10",
    status: "Active",
  },
  {
    id: 10,
    name: "Noah Diaz",
    email: "noah.d@school.edu",
    phone: "(555) 012-3456",
    grade: "Grade 12",
    status: "Active",
  },
  {
    id: 11,
    name: "Liam Turner",
    email: "liam.t@school.edu",
    phone: "(555) 111-2222",
    grade: "Grade 9",
    status: "Active",
  },
  {
    id: 12,
    name: "Emma Wilson",
    email: "emma.w@school.edu",
    phone: "(555) 333-4444",
    grade: "Grade 10",
    status: "Inactive",
  },
];

const ROWS_PER_PAGE = 7;

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const filteredStudents = studentsData.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "" || s.grade === selectedClass;
    return matchesSearch && matchesClass;
  });

  const totalPages = Math.ceil(filteredStudents.length / ROWS_PER_PAGE);
  const paginated = filteredStudents.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  const handleSearch = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };
  const handleClassFilter = (val) => {
    setSelectedClass(val);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-slate-900 text-xl md:text-2xl font-semibold">
            Students
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage all student information here.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm text-sm">
          <Plus size={16} />
          <span className="hidden sm:inline">Add Student</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex items-center flex-1">
          <Search
            size={16}
            className="text-slate-400 absolute left-3 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={selectedClass}
            onChange={(e) => handleClassFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="flex-1 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Stats */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {(currentPage - 1) * ROWS_PER_PAGE + 1}–
              {Math.min(currentPage * ROWS_PER_PAGE, filteredStudents.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {filteredStudents.length}
            </span>{" "}
            students
          </p>
          <span className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* 
          ✅ KEY FIX:
          - On mobile (default): overflow-x-auto → table scrolls horizontally on its own
          - On md and above: overflow-x-visible → table sits naturally, no scroll needed
        */}
        <div className="overflow-x-auto md:overflow-x-visible flex-1">
          <table className="w-full min-w-[700px] md:min-w-0">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[28%]">
                  Student
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[30%]">
                  Contact
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[14%]">
                  Grade
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[14%]">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[14%]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginated.length > 0 ? (
                paginated.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Student */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm border border-indigo-200 shrink-0">
                          {getInitials(student.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">
                            {student.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: #{student.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <p className="text-sm">{student.email}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <p className="text-xs text-slate-500">
                          {student.phone}
                        </p>
                      </div>
                    </td>

                    {/* Grade */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-xs font-medium border border-slate-200">
                        {student.grade}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border
                        ${
                          student.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${student.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`}
                        />
                        {student.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                          title="More"
                        >
                          <MoreVertical size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                      No students match your search.
                    </p>
                    <p className="text-slate-300 text-xs mt-1">
                      Try adjusting your filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <p className="text-xs text-slate-400">
            {filteredStudents.length} total students
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
                  ${
                    currentPage === page
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
