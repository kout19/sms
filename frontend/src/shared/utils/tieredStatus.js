
export function getTierStatus(value, tiers) {
  for (const tier of tiers) {
    if (value >= tier.min) return tier.key;
  }
  return tiers[tiers.length - 1].key;
}
