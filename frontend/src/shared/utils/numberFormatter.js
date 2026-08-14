/**
 * Formats numbers into human-readable strings.
 * * @param {number|string} value - The number to format.
 * @param {Object} options - Formatting configuration.
 * @param {boolean} [options.compact=false] - If true, converts large numbers to compact forms (e.g. 1.2M, 45K).
 * @param {number} [options.decimals=1] - Maximum fraction digits for compact numbers.
 * @param {string} [options.currency] - Currency code if formatting monetary values (e.g., 'ETB', 'USD').
 * @returns {string} Formatted number string.
 */
export const formatNumber = (value, options = {}) => {
  const { compact = true, decimals = 1, currency } = options;

  // Handle invalid inputs gracefully
  const num = Number(value);
  if (isNaN(num)) return "0";

  // Option A: Currency formatting (e.g., ETB 8.4M or 8,400,000 ETB)
  if (currency) {
    if (compact && num >= 1_000_000) {
      const millions = (num / 1_000_000).toFixed(decimals).replace(/\.0$/, "");
      return `${currency} ${millions}M`;
    }
    if (compact && num >= 1_000) {
      const thousands = (num / 1_000).toFixed(decimals).replace(/\.0$/, "");
      return `${currency} ${thousands}K`;
    }
    return `${currency} ${new Intl.NumberFormat("en-US").format(num)}`;
  }

  // Option B: Native Compact Formatting (e.g., 8.4M, 42.8K)
  if (compact) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: decimals,
    }).format(num);
  }

  // Option C: Standard Comma Formatting (e.g., 42,840)
  return new Intl.NumberFormat("en-US").format(num);
};
