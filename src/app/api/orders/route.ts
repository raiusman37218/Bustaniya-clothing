import { NextRequest, NextResponse } from 'next/server';
import { getUserSessionFromCookies } from '@/src/lib/auth/session';
import { sendOrderConfirmationEmail } from '@/src/lib/email/sendOrderConfirmation';
import { generateOrderNumber } from '@/src/lib/orders/formatOrderNumber';
import {
  calculateOrderFromCart,
  OrderValidationError,
} from '@/src/lib/orders/calculateOrder';
import { createSupabaseOrder } from '@/src/lib/orders/supabase-store';
import {
  OrderConfirmation,
  PlaceOrderPayload,
} from '@/src/types/order';
import { isValidEmail } from '@/src/lib/validation/email';

function parseProductId(id: string): number | null {
  const n = Number.parseInt(id, 10);
  return Number.isFinite(n) ? n : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PlaceOrderPayload & {
      discountCode?: string;
    };
    const { customer, billing, items, discountCode } = body;

    if (
      !customer?.email?.trim() ||
      !customer?.firstName?.trim() ||
      !customer?.lastName?.trim() ||
      !customer?.address?.trim() ||
      !customer?.city?.trim() ||
      !customer?.phone?.trim()
    ) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 },
      );
    }

    if (!isValidEmail(customer.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address for order confirmation.' },
        { status: 400 },
      );
    }

    let calculated;
    try {
      calculated = await calculateOrderFromCart(items, discountCode);
    } catch (err) {
      if (err instanceof OrderValidationError) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }

    const orderNumber = generateOrderNumber();
    const session = await getUserSessionFromCookies();

    const saved = await createSupabaseOrder({
      user_id: session?.sub ?? null,
      order_number: orderNumber,
      guest_email: customer.email.trim(),
      customer_email: customer.email.trim(),
      guest_name: `${customer.firstName.trim()} ${customer.lastName.trim()}`,
      guest_phone: customer.phone.trim(),
      shipping_full_name: `${customer.firstName.trim()} ${customer.lastName.trim()}`,
      shipping_phone: customer.phone.trim(),
      shipping_line1: customer.address.trim(),
      shipping_line2: null,
      shipping_city: customer.city.trim(),
      shipping_region: null,
      shipping_country: customer.country,
      shipping_postal_code: customer.postalCode?.trim() || null,
      subtotal_pkr: calculated.subtotalPkr,
      shipping_fee_pkr: calculated.shippingFeePkr,
      total_pkr: calculated.totalPkr,
      discount_amount_pkr: calculated.discountAmountPkr,
      discount_code: calculated.discountCode,
      billing_address:
        billing?.address?.trim()
          ? {
              firstName: billing.firstName.trim(),
              lastName: billing.lastName.trim(),
              country: billing.country,
              address: billing.address.trim(),
              city: billing.city.trim(),
              postalCode: billing.postalCode?.trim() ?? '',
              phone: billing.phone.trim(),
            }
          : null,
      payment_method: 'cod',
      notes: null,
      items: calculated.lineItems.map((item) => {
        const unitPkr = Number.parseInt(item.price, 10);
        return {
          product_id: parseProductId(item.id),
          title: item.name,
          unit_price_pkr: unitPkr,
          quantity: item.quantity,
          line_total_pkr: item.lineTotal,
          size: item.size || null,
          color: item.color ?? null,
          image_url: item.image || null,
        };
      }),
    });

    const confirmation: OrderConfirmation = {
      orderId: saved.id,
      orderNumber,
      createdAt: saved.created_at,
      customer: {
        email: customer.email.trim(),
        firstName: customer.firstName.trim(),
        lastName: customer.lastName.trim(),
        country: customer.country,
        address: customer.address.trim(),
        city: customer.city.trim(),
        postalCode: customer.postalCode?.trim() ?? '',
        phone: customer.phone.trim(),
      },
      items: calculated.lineItems,
      subtotal: calculated.subtotalPkr,
      discountAmount: calculated.discountAmountPkr,
      shippingFee: calculated.shippingFeePkr,
      total: calculated.totalPkr,
      paymentMethod: 'Cash on Delivery (COD)',
      emailSent: false,
    };

    try {
      confirmation.emailSent = await sendOrderConfirmationEmail(confirmation);
    } catch (emailErr) {
      console.error('Order email failed:', emailErr);
    }

    return NextResponse.json({ order: confirmation });
  } catch (err) {
    console.error('POST /api/orders:', err);
    return NextResponse.json(
      { error: 'Could not place order. Please try again.' },
      { status: 500 },
    );
  }
}
