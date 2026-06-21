import { useState } from "react";
import { BookOpen, Clock, Users } from "lucide-react";
import PageHeader from "../../../shared/components/dashboard/PageHeader";
import SectionCard from "../../../shared/components/dashboard/SectionCard";
import ViewSelect from "../../../shared/components/dashboard/ViewSelect";
import { MyClasses, TodaysSchedule } from "../cards/TeacherStateCard";
import { teacherClasses, teacherSchedule } from "../data/teacherMockData";

const TeacherClassesPage = () => {
  const [selectedClass, setSelectedClass] = useState("all");

  const classOptions = [
    { value: "all", label: "All Classes" },
    ...teacherClasses.map((cls) => ({
      value: cls.id,
      label: `${cls.course} — ${cls.section}`,
    })),
  ];

  const activeClass = teacherClasses.find((cls) => cls.id === selectedClass);
  const totalStudents = teacherClasses.reduce(
    (sum, cls) => sum + cls.students.length,
    0,
  );

  return (
    <div className="p-6 w-full bg-gray-50 min-h-full">
      <PageHeader
        icon={BookOpen}
        title="My Classes"
        subtitle="View students by class and check your weekly schedule"
      />

      <SectionCard className="mb-6">
        <ViewSelect
          label="Select class"
          value={selectedClass}
          onChange={setSelectedClass}
          options={classOptions}
        />
      </SectionCard>

      {selectedClass === "all" ? (
        <SectionCard
          title="All Classes Overview"
          badge={`${teacherClasses.length} classes · ${totalStudents} students`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teacherClasses.map((cls) => (
              <MyClasses
                key={cls.id}
                course={cls.course}
                section={cls.section}
                period={cls.period}
                time={cls.time}
                numberOfStudents={cls.students.length}
              />
            ))}
          </div>
        </SectionCard>
      ) : (
        activeClass && (
          <SectionCard
            title={`Students — ${activeClass.section}`}
            badge={`${activeClass.students.length} students`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-100">
                    <th className="pb-3 font-medium">Roll No</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {activeClass.students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-slate-50 hover:bg-gray-50"
                    >
                      <td className="py-3 text-slate-600">{student.rollNo}</td>
                      <td className="py-3 font-medium text-slate-800">
                        {student.name}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                            student.attendance >= 90
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          <Users className="w-3 h-3" />
                          {student.attendance}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )
      )}

      <SectionCard
        title="Class Schedule"
        badge={`${teacherSchedule.length} sessions`}
        className="mt-6"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teacherSchedule.map((item, index) => (
            <TodaysSchedule
              key={index}
              icon={Clock}
              time={item.time}
              course={item.course}
              grade={item.grade}
              room={item.room}
              task={item.task}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default TeacherClassesPage;
