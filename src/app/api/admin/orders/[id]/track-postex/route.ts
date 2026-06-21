import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/src/lib/admin/auth';
import { getSupabaseOrder } from '@/src/lib/orders/supabase-store';
import { createAdminDataSupabase } from '@/src/lib/supabase/admin-data-client';
import { trackPostExOrder, extractPostExTrackingNumber, getPostExPaymentStatus } from '@/src/lib/shipping/postex';
import { OrderStatus } from '@/src/types/adminOrder';

type RouteContext = { params: { id: string } };

export async function GET(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orderId = params.id;
    const order = await getSupabaseOrder(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const trackingNumber = extractPostExTrackingNumber(order.notes);
    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'This order does not have a PostEx tracking number.' },
        { status: 400 }
      );
    }

    // Call PostEx Track API
    const trackDetails = await trackPostExOrder(trackingNumber);
    
    // Call PostEx Payment/Settlement API (optional, wrap in try-catch)
    let paymentDetails = null;
    try {
      paymentDetails = await getPostExPaymentStatus(trackingNumber);
    } catch {
      // Payment details might not be settled/available yet
    }

    // Map PostEx status to our OrderStatus
    let targetStatus: OrderStatus | null = null;
    const postExStatus = trackDetails.status.toLowerCase();

    if (postExStatus.includes('delivered')) {
      targetStatus = 'delivered';
    } else if (
      postExStatus.includes('cancel') || 
      postExStatus.includes('returned') || 
      postExStatus.includes('return to sender') ||
      postExStatus.includes('rts')
    ) {
      targetStatus = 'cancelled';
    } else if (
      postExStatus.includes('transit') || 
      postExStatus.includes('out for delivery') ||
      postExStatus.includes('dispatched')
    ) {
      targetStatus = 'shipped';
    }

    // If status needs syncing, update database
    let synced = false;
    if (targetStatus && targetStatus !== order.status) {
      const supabase = createAdminDataSupabase();
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: targetStatus })
        .eq('id', orderId);

      if (!updateError) {
        synced = true;
        order.status = targetStatus;
      }
    }

    return NextResponse.json({
      success: true,
      trackingNumber,
      trackDetails,
      paymentDetails,
      orderStatus: order.status,
      synced,
    });
  } catch (err: any) {
    console.error('GET /api/admin/orders/[id]/track-postex error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to track order on PostEx.' },
      { status: 500 }
    );
  }
}
