import { Info } from "lucide-react";
import Toggle from "@shared/components/Toggle";
import SettingsCard from "../cards/SettingsCard";
import SettingRow from "./SettingRow";

export default function SecuritySettingsSection({ data, onChange }) {
  const set = (field, value) => onChange({ ...data, [field]: value });

  return (
    <SettingsCard title="Security Settings">
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-sky-50 text-sky-700 text-sm mb-2">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        Changes to security settings take effect immediately and may require
        users to re-authenticate.
      </div>

      <SettingRow
        label="Session Timeout"
        description="Automatically log out users after inactivity"
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={5}
            value={data.sessionTimeoutMinutes}
            onChange={(e) =>
              set("sessionTimeoutMinutes", Number(e.target.value))
            }
            className="w-20 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-center"
          />
          <span className="text-sm text-gray-500">min</span>
        </div>
      </SettingRow>
      <SettingRow
        label="Require Strong Passwords"
        description="Passwords must be 8+ chars with uppercase, number, and symbol"
      >
        <Toggle
          checked={data.requireStrongPasswords}
          onChange={(v) => set("requireStrongPasswords", v)}
        />
      </SettingRow>
      <SettingRow
        label="Two-Factor Authentication"
        description="Require 2FA for all administrator accounts"
      >
        <Toggle
          checked={data.twoFactorAuth}
          onChange={(v) => set("twoFactorAuth", v)}
        />
      </SettingRow>
      <SettingRow
        label="Login Notifications"
        description="Notify administrators of new login events"
      >
        <Toggle
          checked={data.loginNotifications}
          onChange={(v) => set("loginNotifications", v)}
        />
      </SettingRow>
      <SettingRow
        label="Password Expiration"
        description="Days before users must change their password"
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={data.passwordExpirationDays}
            onChange={(e) =>
              set("passwordExpirationDays", Number(e.target.value))
            }
            className="w-20 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-center"
          />
          <span className="text-sm text-gray-500">days</span>
        </div>
      </SettingRow>
      <SettingRow
        label="Failed Login Protection"
        description="Lock account after this many failed attempts"
        badge="Recommended"
        isLast
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={data.failedLoginAttempts}
            onChange={(e) => set("failedLoginAttempts", Number(e.target.value))}
            className="w-20 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-center"
          />
          <span className="text-sm text-gray-500">attempts</span>
        </div>
      </SettingRow>
    </SettingsCard>
  );
}
