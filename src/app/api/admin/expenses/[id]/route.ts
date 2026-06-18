import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/src/lib/admin/auth';
import { createAdminDataSupabase } from '@/src/lib/supabase/admin-data-client';
import { createAnonSupabase, createCatalogSupabase } from '@/src/lib/supabase/service';
import { getAdminOrdersAccessKey } from '@/src/lib/admin/orders-access-key';

function useServiceRoleForAdmin(): boolean {
  return Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  try {
    const { description, expenses } = await req.json();

    const supabase = useServiceRoleForAdmin()
      ? createAdminDataSupabase()
      : createCatalogSupabase();

    let resultData: any;
    if (useServiceRoleForAdmin()) {
      const { data, error } = await supabase
        .from('stock_entries')
        .update({
          description: description ?? null,
          expenses: Array.isArray(expenses) ? expenses : [],
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      resultData = data[0];
    } else {
      const anonSupabase = createAnonSupabase();
      const accessKey = getAdminOrdersAccessKey();
      const { data, error } = await anonSupabase.rpc('admin_update_stock_entry_rpc', {
        access_key: accessKey,
        p_id: id,
        p_description: description ?? null,
        p_expenses: Array.isArray(expenses) ? expenses : [],
      });

      if (error) throw error;
      resultData = data;
    }

    return NextResponse.json({ success: true, stockEntry: resultData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update stock entry' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  try {
    const supabase = useServiceRoleForAdmin()
      ? createAdminDataSupabase()
      : createCatalogSupabase();

    if (useServiceRoleForAdmin()) {
      const { error } = await supabase
        .from('stock_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } else {
      const anonSupabase = createAnonSupabase();
      const accessKey = getAdminOrdersAccessKey();
      const { error } = await anonSupabase.rpc('admin_delete_stock_entry_rpc', {
        access_key: accessKey,
        p_id: id,
      });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete stock entry' }, { status: 500 });
  }
}
