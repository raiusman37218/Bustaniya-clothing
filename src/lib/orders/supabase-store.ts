import { randomUUID } from 'crypto';
import { DbOrder, ORDER_SELECT, mapDbOrder } from '@/src/lib/admin/orders';
import { getAdminOrdersAccessKey } from '@/src/lib/admin/orders-access-key';
import {
  AdminSupabaseConfigError,
  createAdminDataSupabase,
} from '@/src/lib/supabase/admin-data-client';
import { createSupabaseServerClient } from '@/src/lib/supabase/auth-server';
import { createAnonSupabase } from '@/src/lib/supabase/service';
import type { AdminOrder } from '@/src/types/adminOrder';
import { OrderStatus } from '@/src/types/adminOrder';

function useServiceRoleForAdmin(): boolean {
  return Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

function mapRpcOrders(payload: unknown): AdminOrder[] {
  if (!Array.isArray(payload)) return [];
  return payload.map((row) => mapDbOrder(row as DbOrder));
}

async function listOrdersViaRpc(): Promise<AdminOrder[]> {
  const supabase = createAnonSupabase();
  const accessKey = getAdminOrdersAccessKey();
  const { data, error } = await supabase.rpc('admin_list_orders_rpc', {
    access_key: accessKey,
  });
  if (error) throw error;
  return mapRpcOrders(data);
}

async function getOrderViaRpc(id: string): Promise<AdminOrder | null> {
  const supabase = createAnonSupabase();
  const accessKey = getAdminOrdersAccessKey();
  const { data, error } = await supabase.rpc('admin_get_order_rpc', {
    access_key: accessKey,
    p_order_id: id,
  });
  if (error) throw error;
  if (!data) return null;
  return mapDbOrder(data as DbOrder);
}

async function updateOrderStatusViaRpc(
  id: string,
  status: OrderStatus,
): Promise<AdminOrder | null> {
  const supabase = createAnonSupabase();
  const accessKey = getAdminOrdersAccessKey();
  const { data, error } = await supabase.rpc('admin_update_order_status_rpc', {
    access_key: accessKey,
    p_order_id: id,
    p_status: status,
  });
  if (error) throw error;
  if (!data) return null;
  return mapDbOrder(data as DbOrder);
}

export type BillingAddressJson = {
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
};

export type CreateSupabaseOrderInput = {
  user_id: string | null;
  order_number: string;
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
  discount_amount_pkr?: number;
  discount_code?: string | null;
  billing_address?: BillingAddressJson | null;
  payment_method: string;
  notes: string | null;
  items: {
    product_id: string | null;
    title: string;
    unit_price_pkr: number;
    quantity: number;
    line_total_pkr: number;
    size?: string | null;
    color?: string | null;
    image_url?: string | null;
  }[];
};

export type SavedSupabaseOrder = {
  id: string;
  created_at: string;
};

export async function createSupabaseOrder(
  input: CreateSupabaseOrderInput,
): Promise<SavedSupabaseOrder> {
  const orderId = randomUUID();
  const supabase = await createSupabaseServerClient();

  const { error: orderError } = await supabase.from('orders').insert({
    id: orderId,
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
    discount_amount_pkr: input.discount_amount_pkr ?? 0,
    discount_code: input.discount_code ?? null,
    billing_address: input.billing_address ?? null,
    payment_method: input.payment_method,
    notes: input.notes,
    status: 'pending',
  });

  if (orderError) {
    throw new Error(orderError.message);
  }

  const { error: itemsError } = await supabase.from('order_items').insert(
    input.items.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      title: item.title,
      unit_price_pkr: item.unit_price_pkr,
      quantity: item.quantity,
      line_total_pkr: item.line_total_pkr,
      size: item.size ?? null,
      color: item.color ?? null,
      image_url: item.image_url ?? null,
    })),
  );

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return {
    id: orderId,
    created_at: new Date().toISOString(),
  };
}

export async function listSupabaseOrders(): Promise<AdminOrder[]> {
  if (useServiceRoleForAdmin()) {
    const supabase = createAdminDataSupabase();
    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_SELECT)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row) => mapDbOrder(row as unknown as DbOrder));
  }

  try {
    return await listOrdersViaRpc();
  } catch (err) {
    if (err instanceof AdminSupabaseConfigError) throw err;
    throw err;
  }
}

export async function getSupabaseOrder(id: string): Promise<AdminOrder | null> {
  if (useServiceRoleForAdmin()) {
    const supabase = createAdminDataSupabase();
    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_SELECT)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return mapDbOrder(data as unknown as DbOrder);
  }

  return getOrderViaRpc(id);
}

export async function updateSupabaseOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<AdminOrder | null> {
  if (useServiceRoleForAdmin()) {
    const supabase = createAdminDataSupabase();
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (updateError) throw updateError;
    return getSupabaseOrder(id);
  }

  return updateOrderStatusViaRpc(id, status);
}

export async function trackSupabaseOrder(
  orderNumber: string,
  email: string,
): Promise<AdminOrder | null> {
  const emailClean = email.trim().toLowerCase();
  const orderNumClean = orderNumber.trim();

  if (useServiceRoleForAdmin()) {
    const supabase = createAdminDataSupabase();
    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_SELECT)
      .eq('order_number', orderNumClean)
      .or(`guest_email.ilike.${emailClean},customer_email.ilike.${emailClean}`)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return mapDbOrder(data as unknown as DbOrder);
  }

  const allOrders = await listOrdersViaRpc();
  return allOrders.find(
    (o) =>
      o.orderNumber === orderNumClean &&
      (o.guestEmail?.toLowerCase() === emailClean || o.customerEmail?.toLowerCase() === emailClean)
  ) || null;
}

export { AdminSupabaseConfigError };

