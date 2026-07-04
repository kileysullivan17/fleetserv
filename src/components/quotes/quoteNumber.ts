export function quoteDisplayNumber(quoteId: string): string {
  return `Q-${quoteId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}
