import { sendViaResend } from '@/src/lib/email/sendViaResend';
import { sendViaSmtp } from '@/src/lib/email/sendViaSmtp';
import { sendViaSupabaseEdge } from '@/src/lib/email/sendViaSupabaseEdge';
import { OrderConfirmation } from '@/src/types/order';

export async function sendOrderConfirmationEmail(
  order: OrderConfirmation,
): Promise<boolean> {
  try {
    const sentSmtp = await sendViaSmtp(order);
    if (sentSmtp) return true;

    const sentEdge = await sendViaSupabaseEdge(order);
    if (sentEdge) return true;

    if (process.env.RESEND_API_KEY?.trim()) {
      return sendViaResend(order);
    }

    return false;
  } catch (err) {
    console.error('send-order-email failed:', err);
    return false;
  }
}
