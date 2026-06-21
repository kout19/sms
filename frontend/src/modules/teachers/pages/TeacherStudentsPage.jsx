import { useMemo, useState } from "react";
import { GraduationCap, Search } from "lucide-react";
import PageHeader from "../../../shared/components/dashboard/PageHeader";
import SectionCard from "../../../shared/components/dashboard/SectionCard";
import ViewSelect from "../../../shared/components/dashboard/ViewSelect";
import { allTeacherStudents, teacherClasses } from "../data/teacherMockData";

const TeacherStudentsPage = () => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const classOptions = [
    { value: "all", label: "All Classes" },
    ...teacherClasses.map((cls) => ({ value: cls.section, label: cls.section })),
  ];

  const filteredStudents = useMemo(() => {
    return allTeacherStudents.filter((student) => {
      const matchesClass =
        classFilter === "all" || student.class === classFilter;
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.rollNo.includes(query);
      return matchesClass && matchesSearch;
    });
  }, [search, classFilter]);

  return (
    <div className="p-6 w-full bg-gray-50 min-h-full">
      <PageHeader
        icon={GraduationCap}
        title="Students"
        subtitle="Search and browse students across your classes"
      />

      <SectionCard className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <ViewSelect
            label="Filter by class"
            value={classFilter}
            onChange={setClassFilter}
            options={classOptions}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Student List"
        badge={`${filteredStudents.length} found`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="pb-3 font-medium">Roll No</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Class</th>
                <th className="pb-3 font-medium">Course</th>
                <th className="pb-3 font-medium">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={`${student.class}-${student.id}`}
                    className="border-b border-slate-50 hover:bg-gray-50"
                  >
                    <td className="py-3 text-slate-600">{student.rollNo}</td>
                    <td className="py-3 font-medium text-slate-800">
                      {student.name}
                    </td>
                    <td className="py-3">
                      <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                        {student.class}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{student.course}</td>
                    <td className="py-3 text-slate-600">{student.attendance}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No students match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

export default TeacherStudentsPage;
