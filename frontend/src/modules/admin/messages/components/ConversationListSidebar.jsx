import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { useAuth } from "../../../auth/hooks/useAuth";
import { FILTER_TABS, ROLE_TAG_STYLES } from "../utils/messageConstants";
import {
  useConversations,
  useUnreadMessageCount,
} from "../hooks/useMessages";
import ConversationListItem from "./ConversationListItem";

const PAGE_SIZE = 20;

export default function ConversationListSidebar({
  activeConversationId,
  onSelectConversation,
}) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [roleFilter, setRoleFilter] = useState("");
  const [isRoleFilterOpen, setIsRoleFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const conversationsQuery = useConversations(
    { search, folder: tab, role: roleFilter, page, limit: PAGE_SIZE },
    user?.id,
  );
  const conversations = conversationsQuery.data?.data || [];
  const pageInfo = conversationsQuery.data?.meta;
  const unreadQuery = useUnreadMessageCount(user?.id);

  const changeTab = (nextTab) => {
    setTab(nextTab);
    setPage(1);
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
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search messages..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="relative">
            <button
              type="button"
              aria-label="Filter conversations by role"
              onClick={() => setIsRoleFilterOpen((open) => !open)}
              className={
                "p-2 rounded-lg border " +
                (roleFilter
                  ? "border-indigo-500 text-indigo-600"
                  : "border-gray-200 text-gray-400")
              }
            >
              <Filter className="w-4 h-4" />
            </button>
            {isRoleFilterOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg border border-gray-200 shadow-lg p-3 z-10">
                <label
                  htmlFor="message-role-filter"
                  className="text-xs font-semibold text-gray-500 uppercase"
                >
                  Filter by participant role
                </label>
                <select
                  id="message-role-filter"
                  value={roleFilter}
                  onChange={(event) => {
                    setRoleFilter(event.target.value);
                    setPage(1);
                  }}
                  className="mt-2 w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm"
                >
                  <option value="">All roles</option>
                  {Object.entries(ROLE_TAG_STYLES).map(([key, style]) => (
                    <option key={key} value={key}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {FILTER_TABS.map((item) => (
            <button
              type="button"
              key={item.key}
              onClick={() => changeTab(item.key)}
              className={
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap " +
                (tab === item.key
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:bg-gray-50")
              }
            >
              {item.label}
              {item.key === "unread" && unreadQuery.data > 0 && (
                <span
                  className={
                    "text-xs rounded-full px-1.5 " +
                    (tab === "unread"
                      ? "bg-white/20"
                      : "bg-indigo-100 text-indigo-600")
                  }
                >
                  {unreadQuery.data}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversationsQuery.isLoading ? (
          <p className="text-sm text-gray-400 text-center py-8">
            Loading messages...
          </p>
        ) : conversationsQuery.isError ? (
          <p role="alert" className="text-sm text-rose-600 text-center p-4">
            {conversationsQuery.error?.response?.data?.message ||
              conversationsQuery.error?.message ||
              "Messages could not be loaded."}
          </p>
        ) : conversations.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No conversations found.
          </p>
        ) : (
          conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeConversationId}
              onClick={() => onSelectConversation(conversation)}
            />
          ))
        )}
      </div>

      {pageInfo?.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm">
          <button
            type="button"
            disabled={page <= 1 || conversationsQuery.isFetching}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="text-indigo-600 disabled:text-gray-300"
          >
            Previous
          </button>
          <span className="text-gray-500">
            Page {pageInfo.page} of {pageInfo.totalPages}
          </span>
          <button
            type="button"
            disabled={
              page >= pageInfo.totalPages || conversationsQuery.isFetching
            }
            onClick={() =>
              setPage((current) => Math.min(pageInfo.totalPages, current + 1))
            }
            className="text-indigo-600 disabled:text-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
