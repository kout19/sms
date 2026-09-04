// shared/components/DropdownMenu.jsx
import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";

export default function DropdownMenu({ trigger, items, sections }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Backward compatible: plain `items` becomes a single unnamed section.
  const groups = sections || [{ items }];

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen((prev) => !prev)}>{trigger}</div>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-10">
          {groups.map((group, gi) => (
            <div key={gi}>
              {group.title && (
                <div className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {group.title}
                </div>
              )}
              {group.items.map((item, ii) => (
                <button
                  key={ii}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                    item.variant === "danger" ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.dotColor && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dotColor}`} />}
                  {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
                  <span className="flex-1">{item.label}</span>
                  {item.selected && <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />}
                </button>
              ))}
              {gi < groups.length - 1 && <div className="my-1 border-t border-gray-100" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}