import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/src/lib/admin/auth';
import { AdminSupabaseConfigError } from '@/src/lib/supabase/admin-data-client';
import { listSupabaseOrders } from '@/src/lib/orders/supabase-store';

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
