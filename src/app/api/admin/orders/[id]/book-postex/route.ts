import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/src/lib/admin/auth';
import { getSupabaseOrder } from '@/src/lib/orders/supabase-store';
import { createAdminDataSupabase } from '@/src/lib/supabase/admin-data-client';
import { createPostExOrder, addPostExTrackingToNotes, getPostExPickupAddresses } from '@/src/lib/shipping/postex';

type RouteContext = { params: { id: string } };

export async function POST(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orderId = params.id;
    const order = await getSupabaseOrder(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentMethod.toLowerCase() !== 'cod') {
      return NextResponse.json(
        { error: 'Only Cash on Delivery (COD) orders can be booked on PostEx.' },
        { status: 400 }
      );
    }

    // Parse existing notes to see if it is already booked
    const existingNotes = order.notes || '';
    if (existingNotes.includes('[PostEx Tracking:')) {
      return NextResponse.json(
        { error: 'This order is already booked on PostEx.' },
        { status: 400 }
      );
    }

    // Read custom payload options if sent from client (e.g. pickup address, custom city)
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty body
    }

    // Sum item quantities and list items
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const orderDetail = order.items
      .map((item) => `${item.quantity}x ${item.title}${item.size ? ` (${item.size})` : ''}`)
      .join(', ')
      .substring(0, 500); // Truncate if too long

    // Fetch pickup addresses to ensure a default one is available, or use what was sent
    let pickupCode = body.pickupAddressCode;
    if (!pickupCode) {
      try {
        const pickups = await getPostExPickupAddresses();
        if (pickups && pickups.length > 0) {
          pickupCode = pickups[0].pickupAddressCode;
        }
      } catch (err) {
        console.warn('Could not fetch pickup addresses from PostEx, falling back to default:', err);
      }
    }

    // Destination city validation or clean
    const cityName = body.cityName || order.shippingCity || '';
    if (!cityName.trim()) {
      return NextResponse.json(
        { error: 'Order shipping city is required for PostEx booking.' },
        { status: 400 }
      );
    }

    // Full delivery address
    const fullAddress = [order.shippingLine1, order.shippingLine2]
      .filter(Boolean)
      .join(', ')
      .trim();

    if (!fullAddress) {
      return NextResponse.json(
        { error: 'Order shipping address is required for PostEx booking.' },
        { status: 400 }
      );
    }

    // Book order on PostEx
    const postExResponse = await createPostExOrder({
      orderRefNumber: order.orderNumber,
      invoicePayment: order.totalPkr,
      customerName: order.shippingFullName || order.guestName || 'Customer',
      customerPhone: order.shippingPhone || order.guestPhone || '',
      deliveryAddress: fullAddress,
      cityName: cityName.trim(),
      pickupAddressCode: pickupCode,
      orderType: 'Normal',
      items: itemCount,
      orderDetail: orderDetail,
      transactionNotes: order.notes ? order.notes.substring(0, 200) : '',
    });

    const trackingNumber = postExResponse.trackingNumber;

    // Save tracking details to order notes
    const newNotes = addPostExTrackingToNotes(order.notes, trackingNumber);

    // Update orders table in Supabase
    // We update the notes and we change the status to 'shipped' (or keep 'processing' if preferred, let's change to 'shipped' since it is booked on courier)
    const supabase = createAdminDataSupabase();
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        notes: newNotes,
        status: 'shipped', // Automatically mark as shipped on successful booking
      })
      .eq('id', orderId);

    if (updateError) {
      throw new Error(`Failed to update order in database: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      trackingNumber,
      orderNumber: order.orderNumber,
      status: 'shipped',
    });
  } catch (err: any) {
    console.error('POST /api/admin/orders/[id]/book-postex error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to book order on PostEx.' },
      { status: 500 }
    );
  }
}
