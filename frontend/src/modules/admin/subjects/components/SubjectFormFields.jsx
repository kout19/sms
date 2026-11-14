const inputClass =
  "w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800";

const SubjectFormFields = ({ formData, onChange, options }) => {
  const handleMultiSelect = (event) => {
    const values = Array.from(event.target.selectedOptions, (option) => option.value);
    onChange({ name: event.target.name, value: values });
  };

  return (
    <>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">
          Subject Name <span className="text-rose-500">*</span>
        </label>
        <input
          className={inputClass}
          name="name"
          maxLength={120}
          placeholder="e.g. Advanced Mathematics"
          required
          value={formData.name}
          onChange={(event) =>
            onChange({ name: event.target.name, value: event.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Subject Code <span className="text-rose-500">*</span>
          </label>
          <input
            className={inputClass}
            name="code"
            maxLength={40}
            placeholder="e.g. MATH301"
            required
            value={formData.code}
            onChange={(event) =>
              onChange({ name: event.target.name, value: event.target.value })
            }
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Academic Year
          </label>
          <input
            className={inputClass}
            name="academicYear"
            maxLength={30}
            placeholder="e.g. 2026-2027"
            value={formData.academicYear}
            onChange={(event) =>
              onChange({ name: event.target.name, value: event.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">
          Department
        </label>
        <select
          className={inputClass}
          name="departmentId"
          value={formData.departmentId}
          onChange={(event) =>
            onChange({ name: event.target.name, value: event.target.value })
          }
        >
          <option value="">No department</option>
          {options.departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
              {department.isActive ? "" : " (Inactive)"}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">
          Classes
        </label>
        <select
          className={`${inputClass} min-h-24`}
          multiple
          name="classIds"
          value={formData.classIds}
          onChange={handleMultiSelect}
        >
          {options.classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.name} (Grade {classItem.grade}, Section {classItem.section} -{" "}
              {classItem.academicYear})
            </option>
          ))}
        </select>
        <p className="text-[11px] text-slate-500">
          Use Ctrl or Command to select multiple classes.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">
          Teachers
        </label>
        <select
          className={`${inputClass} min-h-24`}
          multiple
          name="teacherProfileIds"
          value={formData.teacherProfileIds}
          onChange={handleMultiSelect}
        >
          {options.teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.fullName}
              {teacher.isActive ? "" : " (Inactive)"}
              {teacher.employeeId ? ` - ${teacher.employeeId}` : ""}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-slate-500">
          Assign one or more teachers to this subject and academic year.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">
          Description
        </label>
        <textarea
          className={inputClass}
          name="description"
          maxLength={1000}
          rows={3}
          value={formData.description}
          onChange={(event) =>
            onChange({ name: event.target.name, value: event.target.value })
          }
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">Status</label>
        <select
          className={inputClass}
          name="isActive"
          value={formData.isActive ? "true" : "false"}
          onChange={(event) =>
            onChange({
              name: event.target.name,
              value: event.target.value === "true",
            })
          }
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
    </>
  );
};

export default SubjectFormFields;
