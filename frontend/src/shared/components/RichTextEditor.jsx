import { useRef, useEffect } from "react";
import { Bold, Italic, List, Link } from "lucide-react";

export default function RichTextEditor({ value, onChange, placeholder, disabled = false }) {
  const editorRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current && editorRef.current) {
      editorRef.current.innerHTML = value || "";
      isFirstRender.current = false;
    }
  }, [value]);

  const exec = (command, arg) => {
    if (disabled) return;
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML || "");
  };

  const handleLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) exec("createLink", url);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-100 bg-gray-50">
        <button
          type="button"
          disabled={disabled}
          onClick={() => exec("bold")}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => exec("italic")}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => exec("insertUnorderedList")}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={handleLink}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
        >
          <Link className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => !disabled && onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
        contentEditable={!disabled}
        aria-disabled={disabled}
        className="min-h-[140px] px-4 py-3 text-sm text-gray-800 focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 disabled:bg-gray-50"
      />
    </div>
  );
}
