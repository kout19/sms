import { useRef, useState } from "react";
import { Upload, X, Paperclip } from "lucide-react";

export default function FileDropzone({
  files,
  onChange,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSizeMB = 10,
  hint,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (fileList) => {
    const accepted = Array.from(fileList).filter(
      (f) => f.size <= maxSizeMB * 1024 * 1024,
    );
    onChange([...files, ...accepted]);
  };

  const removeFile = (index) => onChange(files.filter((_, i) => i !== index));

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-1.5 px-6 py-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
          isDragging
            ? "border-indigo-400 bg-indigo-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <Upload className="w-5 h-5 text-gray-400" />
        <p className="text-sm text-gray-600">
          Drop files here or click to upload
        </p>
        {hint && <p className="text-xs text-gray-400">{hint}</p>}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm"
            >
              <span className="flex items-center gap-2 text-gray-600 truncate">
                <Paperclip className="w-3.5 h-3.5 flex-shrink-0" />
                {file.name}
              </span>
              <button
                onClick={() => removeFile(i)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
