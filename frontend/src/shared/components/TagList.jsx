export default function TagList({ items = [], visibleCount = 3 }) {
  const visible = items.slice(0, visibleCount);
  const overflow = items.length - visible.length;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {visible.map((item) => (
        <span
          key={item}
          className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium whitespace-nowrap"
        >
          {item}
        </span>
      ))}
      {overflow > 0 && (
        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
          +{overflow}
        </span>
      )}
    </div>
  );
}
