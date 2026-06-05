import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/src/lib/admin/auth';
import { AdminSupabaseConfigError } from '@/src/lib/supabase/admin-data-client';
import {
  getSupabaseOrder,
  updateSupabaseOrderStatus,
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
    const body = (await req.json()) as { status?: string };
    const status = body.status as OrderStatus | undefined;

    if (!status || !ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const order = await updateSupabaseOrderStatus(params.id, status);
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
