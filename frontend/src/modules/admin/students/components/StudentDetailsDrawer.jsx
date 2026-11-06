import SlideOver from "@shared/components/SlideOver";
import { useStudent } from "../hooks/useStudents";
import { getApiError, studentClassLabel, toDateInput } from "../utils/studentForm";

const Row = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 text-sm text-slate-800">{value || "—"}</p>
  </div>
);

export default function StudentDetailsDrawer({ studentId, isOpen, onClose }) {
  const studentQuery = useStudent(isOpen ? studentId : null);
  const student = studentQuery.data;
  const profile = student?.studentProfile;

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Student details"
      subtitle="Record stored for this school"
      width="max-w-md"
    >
      {studentQuery.isLoading ? <p className="text-sm text-slate-500">Loading student...</p> : null}
      {studentQuery.isError ? (
        <p className="text-sm text-rose-600">{getApiError(studentQuery.error)}</p>
      ) : null}
      {student ? (
        <div className="space-y-4">
          <Row label="Name" value={`${student.firstName} ${student.lastName}`} />
          <Row label="Email" value={student.email} />
          <Row label="Phone" value={student.phone} />
          <Row label="Status" value={student.isActive ? "Active" : "Inactive"} />
          <Row label="Admission number" value={profile?.admissionNo} />
          <Row label="Class" value={studentClassLabel(student)} />
          <Row label="Date of birth" value={toDateInput(profile?.dateOfBirth)} />
          <Row label="Gender" value={profile?.gender} />
          <Row label="Enrollment date" value={toDateInput(profile?.enrollmentDate)} />
          <Row label="Previous school" value={profile?.previousSchool} />
          <Row label="Address" value={profile?.address} />
          <Row label="Guardian" value={profile?.guardianName} />
          <Row label="Guardian phone" value={profile?.guardianPhone} />
          <Row label="Guardian email" value={profile?.guardianEmail} />
          <Row label="Medical notes" value={profile?.medicalNotes} />
        </div>
      ) : null}
    </SlideOver>
  );
}
