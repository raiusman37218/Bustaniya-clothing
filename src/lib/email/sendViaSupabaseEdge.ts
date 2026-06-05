import { createServiceSupabase } from '@/src/lib/supabase/service';
import { OrderConfirmation } from '@/src/types/order';

function toEdgePayload(order: OrderConfirmation) {
  return {
    orderNumber: order.orderNumber,
    customer_email: order.customer.email.trim(),
    customer: order.customer,
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      lineTotal: item.lineTotal,
    })),
    subtotal: order.subtotal,
    discountAmount: order.discountAmount,
    shippingFee: order.shippingFee,
    total: order.total,
    paymentMethod: order.paymentMethod,
  };
}

/** Sends via Supabase Edge Function (Gmail SMTP secrets stored in Supabase). */
export async function sendViaSupabaseEdge(
  order: OrderConfirmation,
): Promise<boolean> {
  const to = order.customer.email.trim();
  if (!to) return false;

  try {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: toEdgePayload(order),
    });

    if (error) {
      console.error('Supabase send-order-email invoke error:', error.message);
      return false;
    }

    const result = data as { ok?: boolean; error?: string } | null;
    if (result?.ok) return true;
    if (result?.error) {
      console.error('Supabase send-order-email:', result.error);
    }
    return false;
  } catch (err) {
    console.error('Supabase edge email failed:', err);
    return false;
  }
}
