import { useState, useRef, useEffect } from "react";

// Generic dropdown - reusable for row actions on any table (Teachers,
// Students, Classes, etc.), not just Departments.
export default function DropdownMenu({ trigger, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen((prev) => !prev)}>{trigger}</div>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48  bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-10">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${
                item.variant === "danger"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.icon && <item.icon className="w-3 h-3" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
