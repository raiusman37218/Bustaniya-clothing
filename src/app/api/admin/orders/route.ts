import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/src/lib/admin/auth';
import { AdminSupabaseConfigError } from '@/src/lib/supabase/admin-data-client';
import { listSupabaseOrders, createAdminSupabaseOrder } from '@/src/lib/orders/supabase-store';
import { generateOrderNumber } from '@/src/lib/orders/formatOrderNumber';

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await listSupabaseOrders();
    return NextResponse.json({ orders });
  } catch (err) {
    console.error('GET /api/admin/orders:', err);
    if (err instanceof AdminSupabaseConfigError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: 503 },
      );
    }
    const message =
      err instanceof Error && err.message.includes('Unauthorized')
        ? 'Admin order access is misconfigured. Ensure ADMIN_PASSWORD matches app_admin_config, or set SUPABASE_SERVICE_ROLE_KEY.'
        : 'Could not load orders.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      customer_email,
      customer_name,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_country = 'Pakistan',
      shipping_postal_code = '',
      shipping_fee = 0,
      discount_amount = 0,
      notes = '',
      items = [],
    } = body;

    if (
      !customer_email?.trim() ||
      !customer_name?.trim() ||
      !customer_phone?.trim() ||
      !shipping_address?.trim() ||
      !shipping_city?.trim()
    ) {
      return NextResponse.json(
        { error: 'Please provide all customer and shipping address details.' },
        { status: 400 },
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Please add at least one item to the order.' },
        { status: 400 },
      );
    }

    // Calculate subtotal and total
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity),
      0,
    );
    const total = subtotal + Number(shipping_fee) - Number(discount_amount);

    const orderNumber = generateOrderNumber();

    const saved = await createAdminSupabaseOrder({
      user_id: null,
      order_number: orderNumber,
      guest_email: customer_email.trim(),
      customer_email: customer_email.trim(),
      guest_name: customer_name.trim(),
      guest_phone: customer_phone.trim(),
      shipping_full_name: customer_name.trim(),
      shipping_phone: customer_phone.trim(),
      shipping_line1: shipping_address.trim(),
      shipping_line2: null,
      shipping_city: shipping_city.trim(),
      shipping_region: null,
      shipping_country: shipping_country.trim(),
      shipping_postal_code: shipping_postal_code?.trim() || null,
      subtotal_pkr: subtotal,
      shipping_fee_pkr: Number(shipping_fee),
      total_pkr: total,
      discount_amount_pkr: Number(discount_amount),
      discount_code: discount_amount > 0 ? 'ADMIN_CUSTOM' : null,
      billing_address: null,
      payment_method: 'cod',
      notes: notes?.trim() || null,
      items: items.map((item: any) => ({
        product_id: item.product_id || null,
        title: item.title,
        unit_price_pkr: Number(item.price),
        quantity: Number(item.quantity),
        line_total_pkr: Number(item.price) * Number(item.quantity),
        size: item.size || null,
        color: item.color || null,
        image_url: item.image_url || null,
      })),
    });

    return NextResponse.json({ success: true, order: saved });
  } catch (err) {
    console.error('POST /api/admin/orders:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Could not create custom order' },
      { status: 500 },
    );
  }
}
