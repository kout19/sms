import { useState, useRef } from "react";
import {
  User,
  Lock,
  Bell,
  Palette,
  Camera,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from "lucide-react";

// ─── Reusable Components ───────────────────────────────────────────────────

function SectionCard({ title, description, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}

function InputField({ label, id, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        className={`h-10 px-3 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 transition-all
          ${
            error
              ? "border-red-400 focus:ring-red-200"
              : "border-slate-300 focus:ring-blue-200 focus:border-blue-400"
          }`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

function PasswordField({ label, id, error, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className={`w-full h-10 px-3 pr-10 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 transition-all
            ${
              error
                ? "border-red-400 focus:ring-red-200"
                : "border-slate-300 focus:ring-blue-200 focus:border-blue-400"
            }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

function SaveButton({ loading, saved }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="h-9 px-5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-60 transition-all flex items-center gap-2"
    >
      {saved ? (
        <>
          <Check className="w-4 h-4" /> Saved
        </>
      ) : loading ? (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Saving...
        </span>
      ) : (
        "Save changes"
      )}
    </button>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
        ${checked ? "bg-slate-900" : "bg-slate-200"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
          ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
];

// ─── Sections ─────────────────────────────────────────────────────────────

function ProfileSection() {
  const fileRef = useRef();
  const [avatar, setAvatar] = useState(null);
  const [form, setForm] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@edusystems.com",
    username: "admin",
    phone: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.username.trim()) e.username = "Username is required";
    else if (form.username.length < 3) e.username = "At least 3 characters";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 1200);
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  }

  return (
    <SectionCard
      title="Profile Information"
      description="Update your personal details and public profile."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden text-slate-500">
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-7 h-7" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <Camera className="w-3 h-3" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">Profile photo</p>
            <p className="text-xs text-slate-500 mt-0.5">
              JPG, PNG or GIF · Max 2MB
            </p>
          </div>
        </div>

        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="First name"
            id="firstName"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            error={errors.firstName}
            placeholder="John"
          />
          <InputField
            label="Last name"
            id="lastName"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            error={errors.lastName}
            placeholder="Doe"
          />
        </div>

        <InputField
          label="Username"
          id="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          error={errors.username}
          placeholder="johndoe"
        />
        <InputField
          label="Email address"
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          placeholder="john@example.com"
        />
        <InputField
          label="Phone number"
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+1 (555) 000-0000"
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="bio" className="text-sm font-medium text-slate-700">
            Bio
          </label>
          <textarea
            id="bio"
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell us a little about yourself..."
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none transition-all"
          />
        </div>

        <div className="flex justify-end pt-2">
          <SaveButton loading={loading} saved={saved} />
        </div>
      </form>
    </SectionCard>
  );
}

function PasswordSection() {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  function validate() {
    const e = {};
    if (!form.current) e.current = "Current password is required";
    if (!form.newPass) e.newPass = "New password is required";
    else if (form.newPass.length < 8) e.newPass = "At least 8 characters";
    else if (!/[A-Z]/.test(form.newPass))
      e.newPass = "Include at least one uppercase letter";
    else if (!/[0-9]/.test(form.newPass))
      e.newPass = "Include at least one number";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.confirm !== form.newPass)
      e.confirm = "Passwords do not match";
    return e;
  }

  const strength = !form.newPass
    ? 0
    : [
        form.newPass.length >= 8,
        /[A-Z]/.test(form.newPass),
        /[0-9]/.test(form.newPass),
        /[^A-Za-z0-9]/.test(form.newPass),
      ].filter(Boolean).length;

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-blue-400",
    "bg-green-500",
  ];

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setForm({ current: "", newPass: "", confirm: "" });
      setTimeout(() => setSaved(false), 2500);
    }, 1200);
  }

  return (
    <SectionCard
      title="Change Password"
      description="Make sure your account uses a strong password."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordField
          label="Current password"
          id="current"
          value={form.current}
          onChange={(e) => setForm({ ...form, current: e.target.value })}
          error={errors.current}
          placeholder="Enter current password"
        />

        <div className="space-y-1.5">
          <PasswordField
            label="New password"
            id="newPass"
            value={form.newPass}
            onChange={(e) => setForm({ ...form, newPass: e.target.value })}
            error={errors.newPass}
            placeholder="Enter new password"
          />
          {form.newPass && (
            <div className="space-y-1 pt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={`h-1 flex-1 rounded-full transition-all ${n <= strength ? strengthColor[strength] : "bg-slate-200"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Strength:{" "}
                <span className="font-medium text-slate-700">
                  {strengthLabel[strength]}
                </span>
              </p>
            </div>
          )}
        </div>

        <PasswordField
          label="Confirm new password"
          id="confirm"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          error={errors.confirm}
          placeholder="Repeat new password"
        />

        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
          {[
            ["At least 8 characters", form.newPass.length >= 8],
            ["One uppercase letter", /[A-Z]/.test(form.newPass)],
            ["One number", /[0-9]/.test(form.newPass)],
            ["One special character", /[^A-Za-z0-9]/.test(form.newPass)],
          ].map(([rule, met]) => (
            <li
              key={rule}
              className={`text-xs flex items-center gap-1.5 ${met ? "text-green-600" : "text-slate-400"}`}
            >
              <Check
                className={`w-3.5 h-3.5 ${met ? "opacity-100" : "opacity-30"}`}
              />
              {rule}
            </li>
          ))}
        </ul>

        <div className="flex justify-end pt-2">
          <SaveButton loading={loading} saved={saved} />
        </div>
      </form>
    </SectionCard>
  );
}

function NotificationsSection() {
  const [settings, setSettings] = useState({
    emailAttendance: true,
    emailGrades: true,
    emailAnnouncements: false,
    pushAttendance: true,
    pushGrades: false,
    pushMessages: true,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 1000);
  }

  const rows = [
    {
      group: "Email notifications",
      items: [
        {
          key: "emailAttendance",
          label: "Attendance alerts",
          desc: "Get emailed when a student is marked absent",
        },
        {
          key: "emailGrades",
          label: "Grade updates",
          desc: "Receive grade submission notifications",
        },
        {
          key: "emailAnnouncements",
          label: "Announcements",
          desc: "School-wide news and announcements",
        },
      ],
    },
    {
      group: "Push notifications",
      items: [
        {
          key: "pushAttendance",
          label: "Attendance alerts",
          desc: "Real-time push for attendance changes",
        },
        {
          key: "pushGrades",
          label: "Grade updates",
          desc: "Instant push when grades are posted",
        },
        {
          key: "pushMessages",
          label: "New messages",
          desc: "Notify me when I receive a new message",
        },
      ],
    },
  ];

  return (
    <SectionCard
      title="Notifications"
      description="Choose what you want to be notified about."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {rows.map(({ group, items }) => (
          <div key={group}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {group}
            </p>
            <div className="space-y-4">
              {items.map(({ key, label, desc }) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {label}
                    </p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                  <Toggle
                    checked={settings[key]}
                    onChange={() => toggle(key)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-end pt-2">
          <SaveButton loading={loading} saved={saved} />
        </div>
      </form>
    </SectionCard>
  );
}

function AppearanceSection() {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [density, setDensity] = useState("comfortable");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 1000);
  }

  const themes = [
    {
      id: "light",
      label: "Light",
      bg: "bg-white",
      border: "border-slate-200",
      dot: "bg-slate-200",
    },
    {
      id: "dark",
      label: "Dark",
      bg: "bg-slate-900",
      border: "border-slate-700",
      dot: "bg-slate-600",
    },
    {
      id: "system",
      label: "System",
      bg: "bg-gradient-to-br from-white to-slate-900",
      border: "border-slate-300",
      dot: "bg-slate-400",
    },
  ];

  return (
    <SectionCard
      title="Appearance"
      description="Customize how EduSystems looks for you."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Theme</p>
          <div className="flex gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  theme === t.id
                    ? "border-slate-900"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-12 h-8 rounded-md border ${t.bg} ${t.border} flex items-end justify-end p-1`}
                >
                  <div className={`w-3 h-1.5 rounded-sm ${t.dot}`} />
                </div>
                <span className="text-xs font-medium text-slate-700">
                  {t.label}
                </span>
                {theme === t.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="language"
            className="text-sm font-medium text-slate-700"
          >
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
          >
            <option value="en">English</option>
            <option value="am">Amharic</option>
            <option value="fr">French</option>
            <option value="ar">Arabic</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        {/* Density */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">
            Display density
          </p>
          <div className="flex gap-2">
            {["compact", "comfortable", "spacious"].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDensity(d)}
                className={`flex-1 h-9 rounded-lg border text-sm font-medium capitalize transition-all ${
                  density === d
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <SaveButton loading={loading} saved={saved} />
        </div>
      </form>
    </SectionCard>
  );
}

// ─── Main Settings Page ────────────────────────────────────────────────────

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const sections = {
    profile: <ProfileSection />,
    password: <PasswordSection />,
    notifications: <NotificationsSection />,
    appearance: <AppearanceSection />,
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen w-full overflow-hidden">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-slate-900 text-xl md:text-2xl font-semibold">
          Settings
        </h1>
        <p className="text-slate-500 text-sm">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar tabs */}
        <aside className="w-full md:w-52 flex-shrink-0">
          <nav className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left border-b border-slate-100 last:border-0
                    ${
                      activeTab === tab.id
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Active section */}
        <div className="flex-1 min-w-0">{sections[activeTab]}</div>
      </div>
    </div>
  );
};

export default Settings;