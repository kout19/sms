export default function StatusBadge({ isActive }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
