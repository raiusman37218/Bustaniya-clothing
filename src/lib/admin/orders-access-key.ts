import { createHmac } from 'crypto';

const ORDERS_ACCESS_MESSAGE = 'bustaniya-admin-orders-v1';

/** Server-only key for admin order RPC fallback (must match app_admin_config.orders_access_key). */
export function getAdminOrdersAccessKey(): string {
  const secret = process.env.ADMIN_PASSWORD?.trim();
  if (!secret) {
    throw new Error('ADMIN_PASSWORD is not set.');
  }
  return createHmac('sha256', secret)
    .update(ORDERS_ACCESS_MESSAGE)
    .digest('hex');
}
