const roleLabels = {
  admin: "Administrators",
  teacher: "Teachers",
  student: "Students",
  parent: "Parents",
  department_head: "Department heads",
  accountant: "Accountants",
};

const toggle = (items, value) =>
  items.includes(value) ? items.filter((item) => item !== value) : [...items, value];

export default function AudienceSelector({ value, onChange, options, disabled = false }) {
  const audience = value || { allUsers: false, roles: [], classIds: [], sectionIds: [] };
  const update = (next) => onChange({ ...audience, ...next });
  const classes = options?.classes || [];

  return (
    <div className="space-y-5">
      {options?.canTargetSchoolWide && (
        <label className="flex items-start gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={audience.allUsers}
            disabled={disabled}
            onChange={(event) => update({ allUsers: event.target.checked })}
            className="mt-1"
          />
          <span><span className="font-medium">Everyone in this school</span><br /><span className="text-xs text-gray-400">All active school users at publication time.</span></span>
        </label>
      )}

      {options?.canTargetSchoolWide && (
        <fieldset disabled={disabled}>
          <legend className="text-sm font-medium text-gray-700 mb-2">Selected roles</legend>
          <div className="grid grid-cols-2 gap-2">
            {(options.roles || []).map((role) => (
              <label key={role} className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={audience.roles.includes(role)} onChange={() => update({ roles: toggle(audience.roles, role) })} />
                {roleLabels[role] || role}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset disabled={disabled}>
        <legend className="text-sm font-medium text-gray-700 mb-2">Classes and sections</legend>
        {!classes.length ? (
          <p className="text-sm text-gray-400">No eligible current sections are available.</p>
        ) : (
          <div className="space-y-3">
            {classes.map((schoolClass) => (
              <div key={schoolClass.id} className="rounded-lg border border-gray-100 p-3">
                {options?.canTargetClasses !== false ? (
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input type="checkbox" checked={audience.classIds.includes(schoolClass.id)} onChange={() => update({ classIds: toggle(audience.classIds, schoolClass.id) })} />
                    {schoolClass.name} <span className="text-xs font-normal text-gray-400">({schoolClass.code})</span>
                  </label>
                ) : (
                  <p className="text-sm font-medium text-gray-700">{schoolClass.name} <span className="text-xs font-normal text-gray-400">({schoolClass.code})</span></p>
                )}
                <div className="mt-2 ml-6 flex flex-wrap gap-x-4 gap-y-2">
                  {schoolClass.sections.map((section) => (
                    <label key={section.id} className="flex items-center gap-2 text-xs text-gray-600">
                      <input type="checkbox" checked={audience.sectionIds.includes(section.id)} onChange={() => update({ sectionIds: toggle(audience.sectionIds, section.id) })} />
                      {section.name} ({section.code})
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </fieldset>
      <p className="text-xs text-gray-400">{options?.canTargetClasses === false ? "You can send to sections assigned to you. Recipients are resolved when the announcement is published." : "A class target includes every current section of that class. Overlapping targets are deduplicated when the announcement is published."}</p>
    </div>
  );
}
