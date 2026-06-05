/** Prices across the storefront are stored and displayed in PKR. */
export function parsePricePkr(value: string | number): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? Math.round(value) : 0;
  }
  const n = Number.parseFloat(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? Math.round(n) : 0;
}

export function formatPkr(amount: number): string {
  return `Rs ${amount.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
}

/** Nishat-style sale price: Rs. 11,490.00 */
export function formatPkrNishat(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Flat shipping (PKR). Free delivery shown at checkout. */
export const SHIPPING_FEE_PKR = 0;

/** Server-validated discount codes → fraction off subtotal (e.g. 0.1 = 10%). */
export const VALID_DISCOUNT_CODES: Record<string, number> = {
  SAVE10: 0.1,
};

export function applyDiscountCode(
  code: string,
  subtotalPkr: number,
): { discountAmount: number; code: string } | null {
  const normalized = code.trim().toUpperCase();
  const rate = VALID_DISCOUNT_CODES[normalized];
  if (!rate) return null;
  return {
    code: normalized,
    discountAmount: Math.round(subtotalPkr * rate),
  };
}
