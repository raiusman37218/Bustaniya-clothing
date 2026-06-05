export function generateOrderNumber(): string {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `BST-${suffix}`;
}

/** @deprecated Prices are PKR end-to-end; kept for any legacy imports. */
export const USD_TO_PKR = 1;

export function usdToPkr(amount: number): number {
  return Math.round(amount);
}
