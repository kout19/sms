import { useState } from "react";
import { X } from "lucide-react";
import { useDirectorySearch } from "../hooks/useMessages";

export default function RecipientPicker({ role, selected, onChange }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data: results = [] } = useDirectorySearch(role, query);

  const availableResults = results.filter(
    (r) => !selected.some((s) => s.id === r.id),
  );

  const addRecipient = (person) => {
    onChange([...selected, person]);
    setQuery("");
    setIsOpen(false);
  };

  const removeRecipient = (id) => {
    onChange(selected.filter((s) => s.id !== id));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500">
        {selected.map((person) => (
          <span
            key={person.id}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium"
          >
            {person.name}
            <button onClick={() => removeRecipient(person.id)}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={
            selected.length === 0 ? "Search and add recipients..." : ""
          }
          className="flex-1 min-w-[120px] text-sm outline-none py-0.5"
        />
      </div>

      {isOpen && availableResults.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-10 max-h-48 overflow-y-auto">
          {availableResults.map((person) => (
            <button
              key={person.id}
              onClick={() => addRecipient(person)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {person.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
