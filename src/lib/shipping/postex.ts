import { toast } from 'sonner';

export interface PostExConfig {
  token: string;
  baseUrl: string;
  defaultPickupCode: string;
}

export function getPostExConfig(): PostExConfig {
  const token = process.env.POSTEX_TOKEN || '';
  const baseUrl = process.env.POSTEX_BASE_URL || 'https://api.postex.pk/services/integration/api';
  const defaultPickupCode = process.env.POSTEX_DEFAULT_PICKUP_ADDRESS_CODE || '001';

  if (!token) {
    throw new Error('PostEx API token is not configured in environment variables.');
  }

  return { token, baseUrl, defaultPickupCode };
}

// Utility to clean phone number to format: 03xxxxxxxxx (11 digits, starting with 03)
export function formatPakistaniPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  // Remove non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 92, replace 92 with 0
  if (cleaned.startsWith('92')) {
    cleaned = '0' + cleaned.substring(2);
  }
  
  // If it starts with 3, prepend 0
  if (cleaned.startsWith('3') && cleaned.length === 10) {
    cleaned = '0' + cleaned;
  }
  
  return cleaned;
}

export async function fetchPostEx(path: string, options: RequestInit = {}) {
  const { token, baseUrl } = getPostExConfig();
  
  const url = `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`;
  
  const headers = new Headers(options.headers || {});
  headers.set('token', token);
  headers.set('Content-Type', 'application/json');
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorJson;
    try {
      errorJson = JSON.parse(errorText);
    } catch {
      // Not JSON
    }
    throw new Error(
      errorJson?.statusMessage || errorJson?.error || `PostEx API Error (${response.status}): ${errorText || response.statusText}`
    );
  }
  
  const data = await response.json();
  return data;
}

export interface PostExCity {
  operationalCityName: string;
  countryName: string;
  isPickupCity: boolean;
  isDeliveryCity: boolean;
}

export async function getPostExOperationalCities(type?: '1' | '2' | 'Pickup' | 'Delivery'): Promise<PostExCity[]> {
  const queryParams = new URLSearchParams();
  if (type) {
    queryParams.set('operationalCityType', type);
  }
  queryParams.set('active', 'true');
  
  const data = await fetchPostEx(`/city/v1/get-cities?${queryParams.toString()}`, {
    method: 'GET',
  });
  
  if (data.statusCode === '200' && Array.isArray(data.dist)) {
    return data.dist;
  }
  
  throw new Error(data.statusMessage || 'Failed to fetch operational cities from PostEx.');
}

export interface PostExPickupAddress {
  pickupAddressCode: string;
  phone1: string;
  phone2?: string;
  contactPersonName: string;
  cityName: string;
  address: string;
}

export async function getPostExPickupAddresses(): Promise<PostExPickupAddress[]> {
  const data = await fetchPostEx('/merchant/profile/v1/get-pickup-address', {
    method: 'GET',
  });
  
  if (data.statusCode === '200' && Array.isArray(data.dist)) {
    return data.dist;
  }
  
  throw new Error(data.statusMessage || 'Failed to fetch pickup addresses from PostEx.');
}

export interface CreatePickupAddressInput {
  phone1: string;
  phone2?: string;
  contactPersonName: string;
  cityName: string;
  address: string;
}

export async function createPostExPickupAddress(input: CreatePickupAddressInput): Promise<PostExPickupAddress> {
  const data = await fetchPostEx('/merchant/profile/v1/create-pickup-address', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  
  if (data.statusCode === '200' && data.dist) {
    return data.dist;
  }
  
  throw new Error(data.statusMessage || 'Failed to create pickup address in PostEx.');
}

export interface CreatePostExOrderInput {
  orderRefNumber: string;
  invoicePayment: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  cityName: string;
  pickupAddressCode?: string;
  orderType?: 'Normal' | 'Reverse' | 'Replacement';
  invoiceDivision?: number;
  items?: number;
  orderDetail?: string;
  transactionNotes?: string;
}

export interface PostExOrderResponse {
  trackingNumber: string;
  orderRefNumber: string;
  invoicePayment: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  cityName: string;
}

export async function createPostExOrder(input: CreatePostExOrderInput): Promise<PostExOrderResponse> {
  const { defaultPickupCode } = getPostExConfig();
  
  const payload = {
    orderRefNumber: input.orderRefNumber,
    invoicePayment: input.invoicePayment,
    customerName: input.customerName,
    customerPhone: formatPakistaniPhoneNumber(input.customerPhone),
    deliveryAddress: input.deliveryAddress,
    cityName: input.cityName,
    pickupAddressCode: input.pickupAddressCode || defaultPickupCode,
    orderType: input.orderType || 'Normal',
    invoiceDivision: input.invoiceDivision ?? 1,
    items: input.items ?? 1,
    orderDetail: input.orderDetail || '',
    transactionNotes: input.transactionNotes || '',
  };
  
  const data = await fetchPostEx('/order/v1/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  
  if (data.statusCode === '200' && data.dist) {
    return data.dist;
  }
  
  throw new Error(data.statusMessage || 'Failed to create order in PostEx.');
}

export async function cancelPostExOrder(trackingNumber: string): Promise<boolean> {
  const data = await fetchPostEx('/order/v1/cancel', {
    method: 'PUT',
    body: JSON.stringify({ trackingNumber }),
  });
  
  return data.statusCode === '200';
}

export interface PostExTrackingDetails {
  trackingNumber: string;
  orderRefNumber: string;
  status: string;
  remarks: string;
  orderDate: string;
  customerName: string;
  cityName: string;
}

export async function trackPostExOrder(trackingNumber: string): Promise<PostExTrackingDetails> {
  const data = await fetchPostEx(`/order/v1/track/${trackingNumber}`, {
    method: 'GET',
  });
  
  if (data.statusCode === '200' && data.dist) {
    return data.dist;
  }
  
  throw new Error(data.statusMessage || `Failed to track order ${trackingNumber} in PostEx.`);
}

export interface PostExPaymentStatus {
  orderRefNumber: string;
  trackingNumber: string;
  settle: boolean;
  settlementDate: string | null;
  upfrontPaymentDate: string | null;
  cprNumber_1: string | null;
  transactionStatus: string;
  transactionDate: string | null;
  transactionFee: number;
  transactionTax: number;
  upfrontPayment: number;
}

export async function getPostExPaymentStatus(trackingNumber: string): Promise<PostExPaymentStatus> {
  const data = await fetchPostEx(`/order/v1/get-payment-status/${trackingNumber}`, {
    method: 'GET',
  });
  
  if (data.statusCode === '200' && data.dist) {
    return data.dist;
  }
  
  throw new Error(data.statusMessage || `Failed to get payment status for ${trackingNumber} in PostEx.`);
}

// Helpers for serializing/deserializing tracking numbers into order notes
export function extractPostExTrackingNumber(notes: string | null | undefined): string | null {
  if (!notes) return null;
  const match = notes.match(/\[PostEx Tracking:\s*(CX-[A-Z0-9]+)\]/i);
  return match ? match[1] : null;
}

export function addPostExTrackingToNotes(existingNotes: string | null | undefined, trackingNumber: string): string {
  const cleanNotes = existingNotes ? existingNotes.trim() : '';
  const trackingStr = `[PostEx Tracking: ${trackingNumber}]`;
  if (cleanNotes.includes('[PostEx Tracking:')) {
    return cleanNotes.replace(/\[PostEx Tracking:\s*(CX-[A-Z0-9]+)\]/i, trackingStr);
  }
  return cleanNotes ? `${cleanNotes}\n${trackingStr}` : trackingStr;
}

export function removePostExTrackingFromNotes(existingNotes: string | null | undefined): string {
  if (!existingNotes) return '';
  return existingNotes.replace(/\[PostEx Tracking:\s*(CX-[A-Z0-9]+)\]\r?\n?/gi, '').trim();
}
