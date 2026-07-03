const dynamicGradesData = [
    {
      studentId: "emma",
      studentName: "Emma",
      themeColor: "purple", // Controls the top dot indicator
      grades: [
        { course: "Mathematics", score: 92, gradeValue: "A", colorClass: "bg-indigo-600" },
        { course: "English", score: 88, gradeValue: "A-", colorClass: "bg-sky-500" },
        { course: "Physics", score: 85, gradeValue: "B+", colorClass: "bg-amber-500" }
      ]
    },
    {
      studentId: "jack",
      studentName: "Jack",
      themeColor: "blue",
      grades: [
        { course: "Mathematics", score: 87, gradeValue: "B+", colorClass: "bg-indigo-600" },
        { course: "English", score: 89, gradeValue: "A-", colorClass: "bg-sky-500" },
        { course: "Science", score: 83, gradeValue: "B", colorClass: "bg-emerald-500" }
      ]
    }
];

const dotVariants = {
  purple: 'bg-indigo-600',
  blue: 'bg-sky-500',
};

// Sub-Component: Individual Child Grade Card
function StudentGradesCard({ studentName, themeColor, grades }) {
  const dotColor = dotVariants[themeColor] || dotVariants.purple;

  return (
    <div className="w-full bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col">
      {/* Header with Title and Dot Indicator */}
      <div className="flex items-center gap-2 mb-6 text-left">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
          {studentName}'s Grades
        </h3>
      </div>

      {/* Stacked Grades List */}
      <div className="space-y-5">
        {grades.map((grade) => (
          <div key={grade.course} className="flex flex-col">
            
            {/* Top Text Cluster */}
            <div className="flex items-center justify-between mb-1 text-left">
              <div className="flex-1 min-w-0 flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-slate-700 truncate">
                  {grade.course}
                </span>
                {/* Subtle percentage helper trailing right next to text */}
                <span className="text-xs font-semibold text-slate-300">
                  {grade.score}%
                </span>
              </div>

              {/* Rounded Circular Letter Grade Badge */}
              <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100/80 flex items-center justify-center shadow-2xs shrink-0">
                <span className="text-xs font-black text-indigo-600">
                  {grade.gradeValue}
                </span>
              </div>
            </div>

            {/* Premium Thickness Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${grade.colorClass}`}
                style={{ width: `${grade.score}%` }}
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

// Main Component Wrapper
export function StudentGrades({ studentsData = dynamicGradesData }) {
  return (
    // Wraps cleanly side-by-side on desktop views
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl p-4">
      {studentsData.map((student) => (
        <StudentGradesCard
          key={student.studentId}
          studentName={student.studentName}
          themeColor={student.themeColor}
          grades={student.grades}
        />
      ))}
    </div>
  );
}