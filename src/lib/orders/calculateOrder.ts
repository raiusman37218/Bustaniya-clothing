import {
  applyDiscountCode,
  parsePricePkr,
  SHIPPING_FEE_PKR,
} from '@/src/lib/currency/formatCurrency';
import { fetchProductsByIds } from '@/src/lib/products/fetchProductsByIds';
import { CartItem } from '@/src/types/CartItemTypes';
import { OrderLineItem } from '@/src/types/order';

export class OrderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderValidationError';
  }
}

export interface CalculatedOrder {
  lineItems: OrderLineItem[];
  subtotalPkr: number;
  discountAmountPkr: number;
  shippingFeePkr: number;
  totalPkr: number;
  discountCode: string | null;
}

export async function calculateOrderFromCart(
  items: CartItem[],
  discountCodeInput?: string,
): Promise<CalculatedOrder> {
  if (!items?.length) {
    throw new OrderValidationError('Cart is empty');
  }

  const ids = Array.from(new Set(items.map((i) => String(i.id))));
  const catalog = await fetchProductsByIds(ids);

  const lineItems: OrderLineItem[] = [];
  let subtotalPkr = 0;

  for (const item of items) {
    const product = catalog.get(String(item.id));
    if (!product) {
      throw new OrderValidationError(`Product not found: ${item.name}`);
    }
    if (product.product_instock === false) {
      throw new OrderValidationError(`${product.product_name} is out of stock`);
    }

    const qty = Math.max(1, item.quantity ?? 1);
    const unitPkr = parsePricePkr(product.procuct_price);
    const lineTotal = unitPkr * qty;
    subtotalPkr += lineTotal;

    lineItems.push({
      id: String(item.id),
      name: product.product_name,
      image: item.image || product.product_img[0],
      price: String(unitPkr),
      quantity: qty,
      size: item.size,
      color: item.color,
      lineTotal,
    });
  }

  let discountAmountPkr = 0;
  let discountCode: string | null = null;
  if (discountCodeInput?.trim()) {
    const applied = applyDiscountCode(discountCodeInput, subtotalPkr);
    if (!applied) {
      throw new OrderValidationError('Invalid discount code');
    }
    discountAmountPkr = applied.discountAmount;
    discountCode = applied.code;
  }

  const shippingFeePkr = SHIPPING_FEE_PKR;
  const totalPkr = Math.max(0, subtotalPkr - discountAmountPkr + shippingFeePkr);

  return {
    lineItems,
    subtotalPkr,
    discountAmountPkr,
    shippingFeePkr,
    totalPkr,
    discountCode,
  };
}
