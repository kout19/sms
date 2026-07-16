import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  id,
  label,
  error,
  registration,
  placeholder = "Enter your password",
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete="current-password"
          className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
            error ? "border-red-400" : "border-slate-300"
          }`}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default PasswordInput;
