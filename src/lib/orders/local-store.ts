import { randomUUID } from 'crypto';
import { OrderStatus } from '@/src/types/adminOrder';

export type LocalOrderItem = {
  id: number;
  product_id: number | null;
  title: string;
  unit_price_pkr: number;
  quantity: number;
  line_total_pkr: number;
};

export type LocalOrder = {
  id: string;
  user_id: string | null;
  order_number: string;
  status: OrderStatus;
  created_at: string;
  guest_email: string;
  customer_email: string;
  guest_name: string | null;
  guest_phone: string | null;
  shipping_full_name: string | null;
  shipping_phone: string | null;
  shipping_line1: string | null;
  shipping_line2: string | null;
  shipping_city: string | null;
  shipping_region: string | null;
  shipping_country: string | null;
  shipping_postal_code: string | null;
  subtotal_pkr: number;
  shipping_fee_pkr: number;
  total_pkr: number;
  payment_method: string;
  notes: string | null;
  order_items: LocalOrderItem[];
};

export type CreateLocalOrderInput = Omit<
  LocalOrder,
  'id' | 'created_at' | 'status' | 'order_items'
> & {
  items: Omit<LocalOrderItem, 'id'>[];
};

const globalStore = globalThis as typeof globalThis & {
  __bustaniyaOrders?: LocalOrder[];
  __bustaniyaOrderItemSeq?: number;
};

function orders(): LocalOrder[] {
  if (!globalStore.__bustaniyaOrders) {
    globalStore.__bustaniyaOrders = [];
  }
  return globalStore.__bustaniyaOrders;
}

function nextItemId(): number {
  const current = globalStore.__bustaniyaOrderItemSeq ?? 0;
  globalStore.__bustaniyaOrderItemSeq = current + 1;
  return globalStore.__bustaniyaOrderItemSeq;
}

export function createLocalOrder(input: CreateLocalOrderInput): LocalOrder {
  const order: LocalOrder = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    status: 'pending',
    user_id: input.user_id,
    order_number: input.order_number,
    guest_email: input.guest_email,
    customer_email: input.customer_email,
    guest_name: input.guest_name,
    guest_phone: input.guest_phone,
    shipping_full_name: input.shipping_full_name,
    shipping_phone: input.shipping_phone,
    shipping_line1: input.shipping_line1,
    shipping_line2: input.shipping_line2,
    shipping_city: input.shipping_city,
    shipping_region: input.shipping_region,
    shipping_country: input.shipping_country,
    shipping_postal_code: input.shipping_postal_code,
    subtotal_pkr: input.subtotal_pkr,
    shipping_fee_pkr: input.shipping_fee_pkr,
    total_pkr: input.total_pkr,
    payment_method: input.payment_method,
    notes: input.notes,
    order_items: input.items.map((item) => ({
      ...item,
      id: nextItemId(),
    })),
  };
  orders().unshift(order);
  return order;
}

export function listLocalOrders(): LocalOrder[] {
  return [...orders()].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function getLocalOrder(id: string): LocalOrder | undefined {
  return orders().find((order) => order.id === id);
}

export function updateLocalOrderStatus(
  id: string,
  status: OrderStatus,
): LocalOrder | undefined {
  const order = getLocalOrder(id);
  if (!order) return undefined;
  order.status = status;
  return order;
}
