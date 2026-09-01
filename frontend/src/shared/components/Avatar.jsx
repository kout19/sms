const COLOR_PALETTE = [
  {bg: "bg-indigo-100", text:"text-indigo-6000"},
  {bg: "bg-sky-100", text:"text-sky-600"},
  {bg: "bg-emerald-100", text:"text-emerald-600"},
  {bg: "bg-rose-100", text:"text-rose-600"},
  {bg: "bg-yellow-100", text:"text-yellow-600"},
  {bg: "bg-purple-100", text:"text-purple-600"},
  {bg: "bg-pink-100", text:"text-pink-600"},
  {bg: "bg-amber-100", text:"text-amber-600"},
  {bg: "bg-gray-100", text:"text-gray-600"}
];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function hashName(name="") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
}
  return Math.abs(hash);
}

export default function Avatar({ name , colorful =false}) {
  const colors =colorful ? COLOR_PALETTE[hashName(name) % COLOR_PALETTE.length] : {bg: "bg-indigo-100", text:"text-indigo-600"};
  return (
    <div className={`w-8 h-8 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center text-xs font-semibold flex-shrink-0`}>
      {getInitials(name)}
    </div>
  );
}
