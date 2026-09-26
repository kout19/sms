import Toggle from "@shared/components/Toggle";
import SettingsCard from "../cards/SettingsCard";
import SettingRow from "./SettingRow";

export default function AttendanceSettingsSection({ data, onChange }) {
  const set = (field, value) => onChange({ ...data, [field]: value });

  return (
    <SettingsCard title="Attendance Settings">
      <SettingRow
        label="Enable Attendance"
        description="Allow attendance tracking across the school"
      >
        <Toggle
          checked={data.enableAttendance}
          onChange={(v) => set("enableAttendance", v)}
        />
      </SettingRow>
      <SettingRow
        label="Allow Teachers to Mark Attendance"
        description="Teachers can record attendance for their classes"
      >
        <Toggle
          checked={data.allowTeachersToMark}
          onChange={(v) => set("allowTeachersToMark", v)}
        />
      </SettingRow>
      <SettingRow
        label="Late Threshold"
        description="Minutes after start time before marked as late"
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={data.lateThresholdMinutes}
            onChange={(e) =>
              set("lateThresholdMinutes", Number(e.target.value))
            }
            className="w-20 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-center"
          />
          <span className="text-sm text-gray-500">min</span>
        </div>
      </SettingRow>
      <SettingRow
        label="Absence Notification"
        description="Send notifications when a student is absent"
      >
        <Toggle
          checked={data.absenceNotification}
          onChange={(v) => set("absenceNotification", v)}
        />
      </SettingRow>
      <SettingRow
        label="Parent Attendance Notifications"
        description="Notify parents when their child is absent or late"
        isLast
      >
        <Toggle
          checked={data.parentAttendanceNotifications}
          onChange={(v) => set("parentAttendanceNotifications", v)}
        />
      </SettingRow>
    </SettingsCard>
  );
}
