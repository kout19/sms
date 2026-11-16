import { useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { Download, Printer, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  exportAttendanceReport,
} from "../api/attendanceApi";
import {
  useAttendanceReport,
  useAttendanceReportDetail,
  useAttendanceReportOptions,
  useAttendanceReportRecords,
  useAttendanceReportStudents,
} from "../hooks/useAttendanceReport";

const EMPTY_COUNTS = { total: 0, present: 0, absent: 0, late: 0, excused: 0, attendancePercentage: 0 };
const STATUS_COLORS = { present: "#10b981", absent: "#f43f5e", late: "#f59e0b", excused: "#6366f1" };
const STATUS_LABELS = { present: "Present", absent: "Absent", late: "Late", excused: "Excused" };
const initialFilters = { academicYearId: "__current__", startDate: "", endDate: "", classId: "", sectionId: "", subjectId: "", status: "", type: "", groupBy: "weekly" };
const PAGE_SIZE = 10;

const queryFilters = (filters) => Object.fromEntries(
  Object.entries(filters).filter(([, value]) => value !== "" && value !== "all"),
);
const percent = (value) => `${Number(value || 0).toFixed(1)}%`;

function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages < 2) return null;
  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-sm text-gray-500">
      <span>{pagination.total} results · Page {pagination.page} of {pagination.pages}</span>
      <div className="flex gap-2">
        <button aria-label="Previous page" disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)} className="rounded border p-1.5 disabled:opacity-40"><ChevronLeft size={16} /></button>
        <button aria-label="Next page" disabled={pagination.page >= pagination.pages} onClick={() => onPageChange(pagination.page + 1)} className="rounded border p-1.5 disabled:opacity-40"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

function Empty({ children = "No attendance records match these filters." }) {
  return <p className="px-5 py-8 text-center text-sm text-gray-500">{children}</p>;
}

function ReportTable({ title, children, isLoading, isError, empty }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <h2 className="border-b border-gray-100 px-5 py-4 font-semibold text-gray-900">{title}</h2>
      {isLoading ? <p className="px-5 py-8 text-sm text-gray-400">Loading report…</p>
        : isError ? <p role="alert" className="px-5 py-8 text-sm text-rose-600">Could not load this report.</p>
          : children || <Empty>{empty}</Empty>}
    </section>
  );
}

function DetailPanel({ detail, loading, error, onClose, onSessionOpen, onPageChange }) {
  if (!detail && !loading && !error) return null;
  const rows = detail?.records || detail?.sessions || [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-label="Attendance detail">
      <div className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              {detail?.student?.name || detail?.teacher?.name || `${detail?.className || ""} ${detail?.sectionName || ""}` || "Attendance details"}
            </h2>
            <p className="text-sm text-gray-500">
              {detail?.student ? `Admission no. ${detail.student.admissionNo} · Student history`
                : detail?.teacher ? "Teacher attendance session history"
                  : [detail?.date, detail?.academicYear, detail?.subject].filter(Boolean).join(" · ")}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close detail"><X size={20} /></button>
        </div>
        {loading ? <p className="p-6 text-sm text-gray-500">Loading detail…</p>
          : error ? <p role="alert" className="p-6 text-sm text-rose-600">Could not load attendance detail.</p>
            : detail?.summary ? (
              <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-5">
                {["total", "present", "absent", "late", "excused"].map((key) => (
                  <div key={key} className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs capitalize text-gray-500">{key}</p><p className="text-lg font-semibold">{detail.summary[key]}</p>
                  </div>
                ))}
                <p className="col-span-2 text-sm text-gray-500 sm:col-span-5">
                  Teacher: {detail.teacher} · {detail.className} {detail.sectionName} · {detail.type} · Updated {new Date(detail.updatedAt).toLocaleString()}
                </p>
              </div>
            ) : null}
        {!loading && !error && rows.length > 0 && (
          <div className="overflow-x-auto px-6 pb-6">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b text-xs uppercase text-gray-400">
                {(detail?.sessions ? ["Date", "Class / section", "Subject", "Type", "Students recorded", ""] :
                  ["Date", "Student / admission number", "Class / section", "Subject / type", "Status"]).map((heading) => <th key={heading} className="px-3 py-3">{heading}</th>)}
              </tr></thead>
              <tbody>{rows.map((row, index) => (
                <tr key={row.id || `${row.date}-${row.subject}-${row.type}-${row.status}-${index}`} className="border-b last:border-0">
                  {detail?.sessions ? <>
                    <td className="px-3 py-3">{row.date}</td>
                    <td className="px-3 py-3">{row.className} {row.sectionName}</td>
                    <td className="px-3 py-3">{row.subject}</td>
                    <td className="px-3 py-3">{row.type}</td>
                    <td className="px-3 py-3">{row.recordedStudents}</td>
                    <td className="px-3 py-3"><button className="text-indigo-600 hover:underline" onClick={() => onSessionOpen(row.id)}>View</button></td>
                  </> : <>
                    <td className="px-3 py-3">{row.date}</td>
                    <td className="px-3 py-3">{row.studentName || `${detail.student?.name} · ${detail.student?.admissionNo}`}</td>
                    <td className="px-3 py-3">{row.className ? `${row.className} ${row.sectionName}` : `${detail.className} ${detail.sectionName}`}</td>
                    <td className="px-3 py-3">{row.subject || detail.subject} · {row.type || detail.type}</td>
                    <td className="px-3 py-3 capitalize">{row.status}</td>
                  </>}
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {!loading && !error && rows.length === 0 && <Empty>No matching submitted attendance was found.</Empty>}
        {detail?.pagination && <Pagination pagination={detail.pagination} onPageChange={onPageChange} />}
      </div>
    </div>
  );
}

export default function AttendanceReportsPage() {
  const optionsQuery = useAttendanceReportOptions();
  const [pending, setPending] = useState(initialFilters);
  const [applied, setApplied] = useState(initialFilters);
  const [formError, setFormError] = useState("");
  const [studentPage, setStudentPage] = useState(1);
  const [latePage, setLatePage] = useState(1);
  const [recordPage, setRecordPage] = useState(1);
  const [sortBy, setSortBy] = useState("absent");
  const [sortOrder, setSortOrder] = useState("desc");
  const [minAbsent, setMinAbsent] = useState(3);
  const [minLate, setMinLate] = useState(2);
  const [detailRequest, setDetailRequest] = useState(null);
  const [exportError, setExportError] = useState("");
  const [exporting, setExporting] = useState(false);
  const options = optionsQuery.data;
  const defaultYear = options?.academicYears?.find((year) => year.isCurrent)?.id || "";
  const selectedAcademicYearId = (value) => value === "__current__" ? defaultYear : value;
  const effective = queryFilters({ ...applied, academicYearId: selectedAcademicYearId(applied.academicYearId) });
  const dateRangeValid = Boolean(effective.startDate) === Boolean(effective.endDate)
    && (!effective.startDate || (effective.startDate <= effective.endDate
      && (Date.parse(`${effective.endDate}T00:00:00Z`) - Date.parse(`${effective.startDate}T00:00:00Z`)) / 86400000 + 1 <= 366));
  const reportQuery = useAttendanceReport(effective, dateRangeValid && Boolean(options));
  const studentParams = { ...effective, kind: "absences", page: studentPage, limit: PAGE_SIZE, sortBy, sortOrder, minAbsent };
  const lateParams = { ...effective, kind: "late", page: latePage, limit: PAGE_SIZE, sortBy, sortOrder, minLate };
  const recordsParams = { ...effective, kind: "records", page: recordPage, limit: PAGE_SIZE };
  const studentsQuery = useAttendanceReportStudents(studentParams, dateRangeValid && Boolean(options));
  const lateQuery = useAttendanceReportStudents(lateParams, dateRangeValid && Boolean(options));
  const recordsQuery = useAttendanceReportRecords(recordsParams, dateRangeValid && Boolean(options));
  const detailParams = detailRequest ? { ...effective, ...detailRequest, page: detailRequest.page || 1, limit: 50 } : null;
  const detailQuery = useAttendanceReportDetail(detailParams, Boolean(detailParams));

  const selectedSections = (options?.sections || []).filter((section) =>
    (!selectedAcademicYearId(pending.academicYearId) || section.academicYearId === selectedAcademicYearId(pending.academicYearId))
    && (!pending.classId || section.class.id === pending.classId));
  const summary = reportQuery.data?.summary || EMPTY_COUNTS;

  const updateFilter = (key, value) => {
    setPending((current) => ({ ...current, [key]: value, ...(key === "classId" ? { sectionId: "" } : {}) }));
  };
  const applyFilters = () => {
    if (Boolean(pending.startDate) !== Boolean(pending.endDate)) {
      setFormError("Select both a start and end date.");
      return;
    }
    if (pending.startDate && pending.startDate > pending.endDate) {
      setFormError("Start date must be on or before end date.");
      return;
    }
    if (pending.startDate && (Date.parse(`${pending.endDate}T00:00:00Z`) - Date.parse(`${pending.startDate}T00:00:00Z`)) / 86400000 + 1 > 366) {
      setFormError("Choose a reporting period of 366 calendar days or less.");
      return;
    }
    setFormError("");
    setApplied({ ...pending });
    setStudentPage(1);
    setLatePage(1);
    setRecordPage(1);
  };
  const resetFilters = () => {
    setPending(initialFilters);
    setApplied(initialFilters);
    setFormError("");
    setStudentPage(1);
    setLatePage(1);
    setRecordPage(1);
  };
  const openDetail = (kind, id) => setDetailRequest({ kind, id });
  const exportExcel = async () => {
    setExporting(true);
    setExportError("");
    try {
      await exportAttendanceReport(effective);
    } catch (error) {
      setExportError(error?.response?.data?.message || "Excel export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-full space-y-6 bg-gray-50 p-6">
      <style>{`@media print { .report-actions,.report-filters,.pagination-control { display:none !important } body { background:#fff } }`}</style>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-600">Reports / Attendance</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Attendance Reports</h1>
          <p className="mt-1 text-sm text-gray-500">Detailed analysis of teacher-submitted attendance records.</p>
        </div>
        <div className="report-actions flex gap-2">
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"><Printer size={16} /> Print / Save PDF</button>
          <button disabled={exporting || !reportQuery.data} onClick={exportExcel} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"><Download size={16} /> {exporting ? "Exporting…" : "Export Excel"}</button>
        </div>
      </header>

      <section className="report-filters rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-medium text-gray-600">Academic year
            <select value={selectedAcademicYearId(pending.academicYearId)} onChange={(event) => updateFilter("academicYearId", event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              <option value="">All academic years</option>{options?.academicYears?.map((year) => <option key={year.id} value={year.id}>{year.name}{year.isCurrent ? " (Current)" : ""}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-gray-600">Minimum absences for absenteeism report
            <input type="number" min="1" max="100" value={minAbsent} onChange={(event) => setMinAbsent(Math.min(100, Math.max(1, Number(event.target.value) || 1)))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-medium text-gray-600">Minimum late arrivals
            <input type="number" min="2" max="100" value={minLate} onChange={(event) => setMinLate(Math.min(100, Math.max(2, Number(event.target.value) || 2)))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-medium text-gray-600">Start date
            <input type="date" value={pending.startDate} max={pending.endDate || undefined} onChange={(event) => updateFilter("startDate", event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-medium text-gray-600">End date
            <input type="date" value={pending.endDate} min={pending.startDate || undefined} onChange={(event) => updateFilter("endDate", event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-medium text-gray-600">Class
            <select value={pending.classId} onChange={(event) => updateFilter("classId", event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              <option value="">All classes</option>{options?.classes?.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-gray-600">Section
            <select value={pending.sectionId} onChange={(event) => updateFilter("sectionId", event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              <option value="">All sections</option>{selectedSections.map((item) => <option key={item.id} value={item.id}>{item.class.name} · {item.name} ({item.academicYear.name})</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-gray-600">Subject
            <select value={pending.subjectId} onChange={(event) => updateFilter("subjectId", event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              <option value="">All subjects</option>{options?.subjects?.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-gray-600">Attendance status
            <select value={pending.status} onChange={(event) => updateFilter("status", event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              <option value="">All statuses</option>{Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-gray-600">Session type
            <select value={pending.type} onChange={(event) => updateFilter("type", event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              <option value="">All session types</option><option value="daily">Daily</option><option value="subject">Subject</option><option value="period">Period</option>
            </select>
          </label>
          <label className="text-xs font-medium text-gray-600">Trend grouping
            <select value={pending.groupBy} onChange={(event) => updateFilter("groupBy", event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-rose-600" role="alert">{formError || exportError}</div>
          <div className="flex gap-2">
            <button onClick={resetFilters} className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">Reset</button>
            <button onClick={applyFilters} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Apply filters</button>
          </div>
        </div>
      </section>

      {optionsQuery.isLoading ? <p className="text-sm text-gray-500">Loading report filters…</p>
        : optionsQuery.isError ? <p role="alert" className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">Could not load attendance report options. Please retry.</p>
          : null}
      {!dateRangeValid && <p role="alert" className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">Provide a valid reporting date range; reports are paused until the dates are valid.</p>}
      {reportQuery.isError && <p role="alert" className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">Attendance report failed to load.</p>}
      {reportQuery.isLoading && <p className="text-sm text-gray-500">Loading attendance report…</p>}
      {reportQuery.data && (
        <>
          <div className="text-sm text-gray-500">
            {options?.schoolName && <span className="font-medium text-gray-700">{options.schoolName} · </span>}
            {options?.academicYears?.find((year) => year.id === effective.academicYearId)?.name || "All academic years"} ·
            {" "}{effective.startDate ? `${effective.startDate} to ${effective.endDate}` : "All submitted dates"}
            <span className="ml-2">· Generated {new Date().toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-500">Attendance percentage = (present + late records) ÷ all recorded attendance statuses, including absent and excused. Missing or unsubmitted records are excluded; multiple subject/period records are counted as separate sessions.</p>
          <section className="grid gap-4 grid-cols-2 xl:grid-cols-6">
            {[
              ["Total attendance records", summary.total, "text-slate-800"],
              ["Present", summary.present, "text-emerald-600"],
              ["Absent", summary.absent, "text-rose-600"],
              ["Late", summary.late, "text-amber-600"],
              ["Excused", summary.excused, "text-indigo-600"],
              ["Attendance percentage", percent(summary.attendancePercentage), "text-slate-800"],
            ].map(([label, value, color]) => <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">{label}</p><p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
            </div>)}
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900">Attendance trend</h2>
              <p className="mb-4 text-xs text-gray-500">Present + late ÷ all recorded statuses</p>
              {reportQuery.data.trend.length ? <ResponsiveContainer width="100%" height={280}>
                <BarChart data={reportQuery.data.trend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <YAxis yAxisId="right" orientation="right" allowDecimals={false} />
                  <Tooltip formatter={(value, name) => name === "percentage" ? `${value}%` : value} />
                  <Legend /><Bar yAxisId="left" dataKey="percentage" name="Attendance %" fill="#4f46e5" />
                  <Bar yAxisId="right" dataKey="total" name="Recorded" fill="#94a3b8" />
                </BarChart>
              </ResponsiveContainer> : <Empty />}
            </section>
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900">Attendance distribution</h2>
              <p className="mb-4 text-xs text-gray-500">Count of recorded student-session statuses</p>
              {summary.total ? <ResponsiveContainer width="100%" height={280}>
                <PieChart><Pie data={reportQuery.data.distribution} dataKey="count" nameKey="status" innerRadius={55} outerRadius={95} paddingAngle={3} label={({ status, count }) => `${STATUS_LABELS[status]} ${count}`}>
                  {reportQuery.data.distribution.map((item) => <Cell key={item.status} fill={STATUS_COLORS[item.status]} />)}
                </Pie><Tooltip formatter={(value, name) => [value, STATUS_LABELS[name] || name]} /></PieChart>
              </ResponsiveContainer> : <Empty />}
            </section>
          </div>

          <ReportTable title="Class and section comparison" isLoading={false} isError={false} empty="No enrolled classes match these filters.">
            {reportQuery.data.comparison.length ? <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{["Class", "Section", "Enrolled", "Recorded attendance", "Present", "Absent", "Late", "Excused", "Attendance %"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead>
              <tbody>{reportQuery.data.comparison.map((row) => <tr key={row.sectionId} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium">{row.className}</td><td className="px-4 py-3">{row.sectionName}</td><td className="px-4 py-3">{row.totalEnrolled}</td><td className="px-4 py-3">{row.recordedAttendance}</td>
                {["present", "absent", "late", "excused"].map((key) => <td key={key} className="px-4 py-3">{row[key]}</td>)}<td className="px-4 py-3 font-semibold">{percent(row.attendancePercentage)}</td>
              </tr>)}</tbody>
            </table></div> : null}
          </ReportTable>

          <div className="grid gap-6 xl:grid-cols-2">
            <ReportTable title={`Frequent student absenteeism (at least ${minAbsent} absences)`} isLoading={studentsQuery.isLoading} isError={studentsQuery.isError} empty="No students meet the selected recorded-absence threshold.">
              {studentsQuery.data?.items?.length ? <>
                <div className="flex flex-wrap items-center gap-2 px-5 py-3 text-sm">
                  <label className="text-gray-500">Sort:
                    <select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setStudentPage(1); setLatePage(1); }} className="ml-2 rounded border px-2 py-1 text-gray-700">
                      <option value="absent">Absences</option><option value="late">Late</option><option value="attendancePercentage">Attendance %</option><option value="studentName">Student name</option>
                    </select>
                  </label>
                  <button className="text-indigo-600" onClick={() => setSortOrder((current) => current === "desc" ? "asc" : "desc")}>{sortOrder === "desc" ? "Descending" : "Ascending"}</button>
                </div>
                <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{["Admission no.", "Student", "Class / section", "Recorded", "Absent", "Late", "Attendance %"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead>
                  <tbody>{studentsQuery.data.items.map((row) => <tr key={row.id + row.sectionId} className="border-t border-gray-100">
                    <td className="px-4 py-3">{row.admissionNo}</td><td className="px-4 py-3"><button className="font-medium text-indigo-600 hover:underline" onClick={() => openDetail("student", row.id)}>{row.name}</button></td>
                    <td className="px-4 py-3">{row.className} · {row.sectionName}</td><td className="px-4 py-3">{row.totalRecordedSessions}</td><td className="px-4 py-3 text-rose-600">{row.absent}</td><td className="px-4 py-3 text-amber-600">{row.late}</td><td className="px-4 py-3">{percent(row.attendancePercentage)}</td>
                  </tr>)}</tbody>
                </table></div><div className="pagination-control"><Pagination pagination={studentsQuery.data.pagination} onPageChange={setStudentPage} /></div>
              </> : null}
            </ReportTable>
            <ReportTable title={`Repeated late arrivals (at least ${minLate})`} isLoading={lateQuery.isLoading} isError={lateQuery.isError} empty="No students meet the selected late-arrival threshold.">
              {lateQuery.data?.items?.length ? <>
                <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{["Admission no.", "Student", "Class / section", "Late", "Recorded"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead>
                  <tbody>{lateQuery.data.items.map((row) => <tr key={row.id + row.sectionId} className="border-t border-gray-100">
                    <td className="px-4 py-3">{row.admissionNo}</td><td className="px-4 py-3"><button className="font-medium text-indigo-600 hover:underline" onClick={() => openDetail("student", row.id)}>{row.name}</button></td>
                    <td className="px-4 py-3">{row.className} · {row.sectionName}</td><td className="px-4 py-3 font-semibold text-amber-600">{row.late}</td><td className="px-4 py-3">{row.totalRecordedSessions}</td>
                  </tr>)}</tbody>
                </table></div><div className="pagination-control"><Pagination pagination={lateQuery.data.pagination} onPageChange={setLatePage} /></div>
              </> : null}
            </ReportTable>
          </div>

          <ReportTable title="Teacher attendance submissions" isLoading={false} isError={false} empty="No teacher-attributed submissions match these filters.">
            <p className="px-5 pt-4 text-sm text-amber-800">Teacher names come from the session’s teacher attribution, not an immutable submitted-by audit field. The count below is sessions with one or more student records, not proof that the full register was completed. Expected sessions, pending sessions, and submission percentage are unavailable because no authoritative timetable or expected-session source exists. Sessions without teacher attribution are listed as unassigned.</p>
            {reportQuery.data.teachers.length ? <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm">
              <thead className="text-xs uppercase text-gray-500"><tr>{["Teacher", "Assigned class / section / subject", "Submitted sessions", "Expected", "Pending", "Submission %", "Last session update"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead>
              <tbody>{reportQuery.data.teachers.map((teacher, index) => <tr key={teacher.id || `unassigned-${index}`} className="border-t border-gray-100">
                <td className="px-4 py-3"><button disabled={!teacher.id} onClick={() => openDetail("teacher", teacher.id)} className="font-medium text-indigo-600 hover:underline disabled:text-gray-500">{teacher.name}</button></td>
                <td className="px-4 py-3">{teacher.assignedSections.map((item) => `${item.className} ${item.sectionName} · ${item.subject}`).join("; ")}</td>
                <td className="px-4 py-3">{teacher.recordedSessions}</td><td className="px-4 py-3">Unavailable</td><td className="px-4 py-3">Unavailable</td><td className="px-4 py-3">Unavailable</td>
                <td className="px-4 py-3">{teacher.lastSessionUpdatedAt ? new Date(teacher.lastSessionUpdatedAt).toLocaleString() : "—"}</td>
              </tr>)}</tbody>
            </table></div> : null}
          </ReportTable>

          <ReportTable title="Detailed attendance records" isLoading={recordsQuery.isLoading} isError={recordsQuery.isError} empty="No detailed attendance records match these filters.">
            {recordsQuery.data?.items?.length ? <>
              <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{["Date", "Admission no.", "Student", "Class / section", "Subject", "Type", "Status", "Details"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead>
                <tbody>{recordsQuery.data.items.map((row) => <tr key={row.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{row.date}</td><td className="px-4 py-3">{row.admissionNo}</td><td className="px-4 py-3">{row.studentName}</td>
                  <td className="px-4 py-3">{row.className} · {row.sectionName}</td><td className="px-4 py-3">{row.subject}</td><td className="px-4 py-3 capitalize">{row.type}</td>
                  <td className="px-4 py-3 capitalize" style={{ color: STATUS_COLORS[row.status] }}>{row.status}</td><td className="px-4 py-3"><button className="text-indigo-600 hover:underline" onClick={() => openDetail("session", row.sessionId)}>View date / section</button></td>
                </tr>)}</tbody>
              </table></div><div className="pagination-control"><Pagination pagination={recordsQuery.data.pagination} onPageChange={setRecordPage} /></div>
            </> : null}
          </ReportTable>
        </>
      )}
      <DetailPanel
        detail={detailQuery.data}
        loading={detailQuery.isLoading}
        error={detailQuery.isError}
        onClose={() => setDetailRequest(null)}
        onSessionOpen={(id) => openDetail("session", id)}
        onPageChange={(page) => setDetailRequest((current) => ({ ...current, page }))}
      />
    </div>
  );
}
