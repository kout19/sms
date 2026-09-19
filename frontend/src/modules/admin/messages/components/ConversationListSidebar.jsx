import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { FILTER_TABS, ROLE_TAG_STYLES } from "../utils/messageConstants";
import { useConversations, useToggleStar } from "../hooks/useMessages";
import ConversationListItem from "./ConversationListItem";

export default function ConversationListSidebar({
  activeConversationId,
  onSelectConversation,
}) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [roleFilter, setRoleFilter] = useState([]);
  const [isRoleFilterOpen, setIsRoleFilterOpen] = useState(false);

  const { data: conversations = [] } = useConversations({
    search,
    tab,
    roles: roleFilter,
  });
  const { data: unreadList = [] } = useConversations({ tab: "unread" });
  const toggleStar = useToggleStar();

  const toggleRole = (role) => {
    setRoleFilter((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  return (
    <div className="w-96 border-r border-gray-100 flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsRoleFilterOpen((prev) => !prev)}
              className={`p-2 rounded-lg border ${roleFilter.length ? "border-indigo-500 text-indigo-600" : "border-gray-200 text-gray-400"}`}
            >
              <Filter className="w-4 h-4" />
            </button>
            {isRoleFilterOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg border border-gray-200 shadow-lg p-2 z-10">
                <p className="text-xs font-semibold text-gray-400 uppercase px-2 py-1">
                  Filter by role
                </p>
                {Object.entries(ROLE_TAG_STYLES).map(([key, style]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={roleFilter.includes(key)}
                      onChange={() => toggleRole(key)}
                      className="rounded border-gray-300"
                    />
                    {style.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {FILTER_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t.label}
              {t.key === "unread" && unreadList.length > 0 && (
                <span
                  className={`text-xs rounded-full px-1.5 ${tab === "unread" ? "bg-white/20" : "bg-indigo-100 text-indigo-600"}`}
                >
                  {unreadList.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No conversations found.
          </p>
        ) : (
          conversations.map((c) => (
            <ConversationListItem
              key={c.id}
              conversation={c}
              isActive={c.id === activeConversationId}
              onClick={() => onSelectConversation(c.id)}
              onToggleStar={() => toggleStar.mutate(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
