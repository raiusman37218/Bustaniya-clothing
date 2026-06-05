import { OrderConfirmation } from '@/src/types/order';
import { buildOrderEmailHtml } from '@/src/lib/email/buildOrderEmailHtml';

export async function sendViaResend(order: OrderConfirmation): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;

  const to = order.customer.email.trim();
  if (!to) return false;

  const from =
    process.env.EMAIL_FROM?.trim() ?? 'Bustaniya <onboarding@resend.dev>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Bustaniya — Your order is confirmed — ${order.orderNumber}`,
      html: buildOrderEmailHtml(order),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error('Resend API error:', res.status, detail);
    return false;
  }

  return true;
}
