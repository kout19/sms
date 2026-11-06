import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDebouncedValue } from "@shared/hooks/useDebouncedValue";
import {
  Plus,
  Search,
  Mail,
  Phone,
  Trash2,
  Pencil,
  Eye,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Modal from "@shared/components/AttendanceModal";
import {
  useDeleteStudent,
  useStudentClasses,
  useStudents,
} from "../hooks/useStudents";
import { getApiError, studentClassLabel } from "../utils/studentForm";
import StudentFormModal from "../components/StudentFormModal";
import StudentDetailsDrawer from "../components/StudentDetailsDrawer";
import ImportStudentsModal from "../components/ImportStudentsModal";

const ROWS_PER_PAGE = 7;

const visiblePages = (current, total) => {
  const windowSize = 5;
  let start = Math.max(1, current - 2);
  const end = Math.min(total, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

const Students = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [deactivating, setDeactivating] = useState(null);
  const [banner, setBanner] = useState("");
  const [actionError, setActionError] = useState("");

  const addOpen = location.pathname.endsWith("/students/add");
  const importOpen = location.pathname.endsWith("/students/import");

  const searchTerm = useDebouncedValue(
    searchInput.trim().replace(/\s+/g, " "),
    450,
  );
  const [trackedSearch, setTrackedSearch] = useState(searchTerm);
  if (trackedSearch !== searchTerm) {
    setTrackedSearch(searchTerm);
    setCurrentPage(1);
  }

  const classesQuery = useStudentClasses();
  const classes = classesQuery.data || [];
  const deleteStudent = useDeleteStudent();

  const { data, isLoading, isError, error, refetch, isFetching } = useStudents({
    search: searchTerm,
    classId: selectedClass,
    page: currentPage,
    limit: ROWS_PER_PAGE,
  });

  const students = data?.data || [];
  const totalStudents = data?.meta?.total ?? students.length;
  const totalPages = data?.meta?.totalPages || 1;
  const pages = useMemo(
    () => visiblePages(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const getInitials = (student) => {
    const name = [student?.firstName, student?.lastName].filter(Boolean).join(" ");
    if (!name) return "";
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const closeForm = () => {
    if (addOpen) navigate("/admin/students");
    setEditingId(null);
  };

  const confirmDeactivate = async () => {
    if (!deactivating) return;
    try {
      setActionError("");
      await deleteStudent.mutateAsync(deactivating.id);
      setBanner(`${deactivating.firstName} ${deactivating.lastName} was deactivated. The record is still kept.`);
      setDeactivating(null);
    } catch (deactivateError) {
      setActionError(getApiError(deactivateError));
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading students...</p>
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load students: {getApiError(error)}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  const startIndex = totalStudents === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ROWS_PER_PAGE, totalStudents);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen flex flex-col">
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-slate-900 text-xl md:text-2xl font-semibold">Students</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all student information here.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/students/import")}
            className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            <Upload size={16} />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/students/add")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm text-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Student</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {banner ? (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {banner}
        </p>
      ) : null}
      {actionError ? (
        <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {actionError}
        </p>
      ) : null}

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex items-center flex-1">
          <Search size={16} className="text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or admission number…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <div className="w-full sm:w-64">
          <select
            value={selectedClass}
            onChange={(event) => {
              setSelectedClass(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700"
          >
            <option value="">All Classes</option>
            {classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.grade}
                {schoolClass.section} · {schoolClass.academicYear}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {startIndex}–{endIndex}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">{totalStudents}</span>{" "}
            students
            {isFetching ? <span className="ml-2 text-xs text-slate-400">Updating...</span> : null}
          </p>
          <span className="text-xs text-slate-400">Page {currentPage} of {totalPages}</span>
        </div>

        <div className="overflow-x-auto md:overflow-x-visible flex-1">
          <table className="w-full min-w-[700px] md:min-w-0">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[28%]">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[30%]">Contact</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[14%]">Grade</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[14%]">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[14%]">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {students.length > 0 ? (
                students.map((student) => {
                  const fullName = [student.firstName, student.lastName].filter(Boolean).join(" ");
                  const status = student.isActive ? "Active" : "Inactive";

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm border border-indigo-200 shrink-0">
                            {getInitials(student)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{fullName}</p>
                            <p className="text-xs text-slate-400">
                              {student.studentProfile?.admissionNo || `ID: #${student.id.slice(0, 8)}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <p className="text-sm">{student.email}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <p className="text-xs text-slate-500">{student.phone || "—"}</p>
                        </div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-xs font-medium border border-slate-200">
                          {studentClassLabel(student)}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                            status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingId(student.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(student.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActionError("");
                              setDeactivating(student);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            title="Deactivate"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <p className="text-slate-400 text-sm font-medium">No students match your search.</p>
                    <p className="text-slate-300 text-xs mt-1">Try adjusting your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <p className="text-xs text-slate-400">{totalStudents} total students</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {pages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === page ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <StudentFormModal
        mode="create"
        isOpen={addOpen}
        classes={classes}
        onClose={() => navigate("/admin/students")}
        onSaved={setBanner}
      />
      <StudentFormModal
        mode="edit"
        studentId={editingId}
        isOpen={Boolean(editingId)}
        classes={classes}
        onClose={closeForm}
        onSaved={setBanner}
      />
      <StudentDetailsDrawer
        studentId={viewingId}
        isOpen={Boolean(viewingId)}
        onClose={() => setViewingId(null)}
      />
      <ImportStudentsModal
        isOpen={importOpen}
        onClose={() => navigate("/admin/students")}
        onImported={setBanner}
      />

      <Modal
        isOpen={Boolean(deactivating)}
        onClose={() => setDeactivating(null)}
        title="Deactivate student"
        subtitle="The student record stays in the school. The account can no longer sign in. Edit the student later to make the account active again."
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeactivating(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDeactivate}
              disabled={deleteStudent.isPending}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {deleteStudent.isPending ? "Deactivating..." : "Deactivate"}
            </button>
          </div>
        }
      >
        <p className="p-6 text-sm text-slate-600">
          Deactivate {deactivating?.firstName} {deactivating?.lastName}? This does not erase grades or enrollment history, because those records are not deleted with the account.
        </p>
      </Modal>
    </div>
  );
};

export default Students;
