export function generateOrderNumber(): string {
  const part1 = Math.floor(1000 + Math.random() * 9000);
  const part2 = Math.floor(1000 + Math.random() * 9000);
  return `BST-${part1}-${part2}`;
}

/** @deprecated Prices are PKR end-to-end; kept for any legacy imports. */
export const USD_TO_PKR = 1;

export function usdToPkr(amount: number): number {
  return Math.round(amount);
}
