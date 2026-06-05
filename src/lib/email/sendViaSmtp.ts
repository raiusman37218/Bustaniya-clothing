import nodemailer from 'nodemailer';
import { buildOrderEmailHtml } from '@/src/lib/email/buildOrderEmailHtml';
import { OrderConfirmation } from '@/src/types/order';

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim(),
  );
}

export async function sendViaSmtp(order: OrderConfirmation): Promise<boolean> {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !pass) return false;

  const to = order.customer.email.trim();
  if (!to) return false;

  const host = process.env.SMTP_HOST?.trim() ?? 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT ?? 587);
  const from =
    process.env.EMAIL_FROM?.trim() ?? `Bustaniya <${user}>`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from,
      to,
      subject: `Bustaniya — Your order is confirmed — ${order.orderNumber}`,
      html: buildOrderEmailHtml(order),
    });
    return true;
  } catch (err) {
    console.error('SMTP send error:', err);
    return false;
  }
}
