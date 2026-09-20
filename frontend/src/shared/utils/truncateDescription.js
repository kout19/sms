export function truncateDescription(content, title = "") {
  if (!content) return "";
  const safeContent = String(content);
  const safeTitleLength = title ? title.length : 30; // Fallback length if title is missing
  const plainText = safeContent.replace(/<[^>]+>/g, "");
  if (plainText.length <= safeTitleLength) return plainText;

  return plainText.slice(0, safeTitleLength).trimEnd() + "...";
}
