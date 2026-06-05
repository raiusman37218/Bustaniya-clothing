export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export interface AdminBillingAddress {
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface AdminOrderItem {
  id: number;
  productId: number | null;
  title: string;
  unitPricePkr: number;
  quantity: number;
  lineTotalPkr: number;
  size: string | null;
  color: string | null;
  imageUrl: string | null;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  guestEmail: string;
  customerEmail: string;
  guestName: string | null;
  guestPhone: string | null;
  shippingFullName: string | null;
  shippingPhone: string | null;
  shippingLine1: string | null;
  shippingLine2: string | null;
  shippingCity: string | null;
  shippingRegion: string | null;
  shippingCountry: string | null;
  shippingPostalCode: string | null;
  subtotalPkr: number;
  shippingFeePkr: number;
  totalPkr: number;
  discountAmountPkr: number;
  discountCode: string | null;
  billingAddress: AdminBillingAddress | null;
  paymentMethod: string;
  notes: string | null;
  items: AdminOrderItem[];
}
