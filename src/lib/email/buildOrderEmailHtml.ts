import { renderOrderConfirmationEmail } from '../../../shared/email/orderEmailTemplate';
import { OrderConfirmation } from '@/src/types/order';
import { getEmailLogoUrl } from '@/src/lib/email/emailBrand';

export function buildOrderEmailHtml(order: OrderConfirmation): string {
  return renderOrderConfirmationEmail(
    {
      orderNumber: order.orderNumber,
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      shippingFee: order.shippingFee,
      total: order.total,
      paymentMethod: order.paymentMethod,
    },
    getEmailLogoUrl(),
  );
}
