import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/src/lib/admin/auth';
import { AdminSupabaseConfigError } from '@/src/lib/supabase/admin-data-client';
import {
  getSupabaseOrder,
  updateSupabaseOrder,
  deleteSupabaseOrder,
} from '@/src/lib/orders/supabase-store';
import { ORDER_STATUSES, OrderStatus } from '@/src/types/adminOrder';

function adminOrderErrorResponse(err: unknown) {
  if (err instanceof AdminSupabaseConfigError) {
    return NextResponse.json(
      { error: err.message, code: err.code },
      { status: 503 },
    );
  }
  const message =
    err instanceof Error && err.message.includes('Unauthorized')
      ? 'Admin order access is misconfigured. Ensure ADMIN_PASSWORD matches app_admin_config, or set SUPABASE_SERVICE_ROLE_KEY.'
      : 'Could not load order.';
  return NextResponse.json({ error: message }, { status: 500 });
}

type RouteContext = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const order = await getSupabaseOrder(params.id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error('GET /api/admin/orders/[id]:', err);
    return adminOrderErrorResponse(err);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updates: any = {};
    
    // Whitelist update fields
    const allowedKeys = [
      'status',
      'guest_name',
      'shipping_full_name',
      'guest_email',
      'customer_email',
      'guest_phone',
      'shipping_phone',
      'shipping_line1',
      'shipping_line2',
      'shipping_city',
      'shipping_postal_code',
      'shipping_country',
      'notes',
      'payment_method',
      'discount_amount_pkr',
      'discount_code',
      'shipping_fee_pkr',
      'subtotal_pkr',
      'total_pkr',
    ];

    for (const key of allowedKeys) {
      if (key in body) {
        updates[key] = body[key];
      }
    }

    if (updates.status && !ORDER_STATUSES.includes(updates.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const order = await updateSupabaseOrder(params.id, updates);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error('PATCH /api/admin/orders/[id]:', err);
    if (err instanceof AdminSupabaseConfigError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: 'Could not update order.' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const success = await deleteSupabaseOrder(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Could not delete order' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/orders/[id]:', err);
    if (err instanceof AdminSupabaseConfigError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: 'Could not delete order.' },
      { status: 500 },
    );
  }
}
