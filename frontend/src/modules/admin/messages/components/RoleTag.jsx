import { ROLE_TAG_STYLES } from "../utils/messageConstants";

export default function RoleTag({ role }) {
  const style = ROLE_TAG_STYLES[role];
  if (!style) return null;
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}
