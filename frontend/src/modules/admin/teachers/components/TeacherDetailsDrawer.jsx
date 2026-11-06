import SlideOver from "@shared/components/SlideOver";
import { useTeacher } from "../hooks/useTeachers";
import { getApiError, homeroomLabel, toDateInput } from "../utils/teacherForm";

const Row = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 text-sm text-slate-800">{value || "—"}</p>
  </div>
);

export default function TeacherDetailsDrawer({ teacherId, isOpen, onClose }) {
  const teacherQuery = useTeacher(isOpen ? teacherId : null);
  const teacher = teacherQuery.data;
  const profile = teacher?.teacherProfile;
  const classes = (teacher?.homeroomClasses || []).map(homeroomLabel).join(", ");

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Teacher details"
      subtitle="Record stored for this school"
      width="max-w-md"
    >
      {teacherQuery.isLoading ? <p className="text-sm text-slate-500">Loading teacher...</p> : null}
      {teacherQuery.isError ? (
        <p className="text-sm text-rose-600">{getApiError(teacherQuery.error)}</p>
      ) : null}
      {teacher ? (
        <div className="space-y-4">
          <Row label="Name" value={`${teacher.firstName} ${teacher.lastName}`} />
          <Row label="Email" value={teacher.email} />
          <Row label="Phone" value={teacher.phone} />
          <Row label="Status" value={teacher.isActive ? "Active" : "Inactive"} />
          <Row label="Employee ID" value={profile?.employeeId} />
          <Row label="Hire date" value={toDateInput(profile?.hireDate)} />
          <Row label="Qualifications" value={profile?.qualifications} />
          <Row label="Homeroom classes" value={classes} />
        </div>
      ) : null}
    </SlideOver>
  );
}
