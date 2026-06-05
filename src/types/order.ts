import { CartItem } from '@/src/types/CartItemTypes';

export interface CheckoutCustomer {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface PlaceOrderPayload {
  customer: CheckoutCustomer;
  billing?: BillingAddress;
  items: CartItem[];
  discountCode?: string;
}

export interface OrderLineItem {
  id: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
  size: string;
  color?: string;
  lineTotal: number;
}

export interface OrderConfirmation {
  orderId: string;
  orderNumber: string;
  createdAt: string;
  customer: CheckoutCustomer;
  items: OrderLineItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  emailSent: boolean;
}

export const LAST_ORDER_STORAGE_KEY = 'bustaniya_last_order';
