import type { Json } from '@/src/lib/supabase/database.types';
import {
  AdminBillingAddress,
  AdminOrder,
  AdminOrderItem,
  OrderStatus,
} from '@/src/types/adminOrder';

type DbOrderItem = {
  id: number;
  product_id: string | null;
  title: string;
  unit_price_pkr: number | string;
  quantity: number;
  line_total_pkr: number | string;
  size?: string | null;
  color?: string | null;
  image_url?: string | null;
};

export type DbOrder = {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  guest_email: string;
  customer_email?: string | null;
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
  subtotal_pkr: number | string;
  shipping_fee_pkr: number | string;
  total_pkr: number | string;
  discount_amount_pkr?: number | string | null;
  discount_code?: string | null;
  billing_address?: AdminBillingAddress | Json | null;
  payment_method: string;
  notes: string | null;
  order_items?: DbOrderItem[] | null;
};

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number.parseFloat(value);
}

function mapItem(row: DbOrderItem): AdminOrderItem {
  return {
    id: row.id,
    productId: row.product_id,
    title: row.title,
    unitPricePkr: toNumber(row.unit_price_pkr),
    quantity: row.quantity,
    lineTotalPkr: toNumber(row.line_total_pkr),
    size: row.size ?? null,
    color: row.color ?? null,
    imageUrl: row.image_url ?? null,
  };
}

function parseBillingAddress(
  value: unknown,
): AdminBillingAddress | null {
  if (!value || typeof value !== 'object') return null;
  const b = value as Record<string, unknown>;
  if (
    typeof b.firstName !== 'string' ||
    typeof b.lastName !== 'string' ||
    typeof b.address !== 'string'
  ) {
    return null;
  }
  return {
    firstName: b.firstName,
    lastName: b.lastName,
    country: typeof b.country === 'string' ? b.country : '',
    address: b.address,
    city: typeof b.city === 'string' ? b.city : '',
    postalCode: typeof b.postalCode === 'string' ? b.postalCode : '',
    phone: typeof b.phone === 'string' ? b.phone : '',
  };
}

export function mapDbOrder(row: DbOrder): AdminOrder {
  const items = (row.order_items ?? []).map(mapItem);
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: (row.status as OrderStatus) || 'pending',
    createdAt: row.created_at,
    guestEmail: row.guest_email,
    customerEmail: row.customer_email ?? row.guest_email,
    guestName: row.guest_name,
    guestPhone: row.guest_phone,
    shippingFullName: row.shipping_full_name,
    shippingPhone: row.shipping_phone,
    shippingLine1: row.shipping_line1,
    shippingLine2: row.shipping_line2,
    shippingCity: row.shipping_city,
    shippingRegion: row.shipping_region,
    shippingCountry: row.shipping_country,
    shippingPostalCode: row.shipping_postal_code,
    subtotalPkr: toNumber(row.subtotal_pkr),
    shippingFeePkr: toNumber(row.shipping_fee_pkr),
    totalPkr: toNumber(row.total_pkr),
    discountAmountPkr: toNumber(row.discount_amount_pkr ?? 0),
    discountCode: row.discount_code ?? null,
    billingAddress: parseBillingAddress(row.billing_address),
    paymentMethod: row.payment_method,
    notes: row.notes,
    items,
  };
}

export const ORDER_SELECT =
  '*, order_items(id, product_id, title, unit_price_pkr, quantity, line_total_pkr, size, color, image_url)';
