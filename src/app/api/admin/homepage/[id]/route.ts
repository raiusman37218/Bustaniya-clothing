import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/src/lib/admin/auth';
import { createAdminDataSupabase } from '@/src/lib/supabase/admin-data-client';
import { createAnonSupabase } from '@/src/lib/supabase/service';
import { getAdminOrdersAccessKey } from '@/src/lib/admin/orders-access-key';

function useServiceRoleForAdmin(): boolean {
  return Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const body = await req.json();

    let rawImage: any = null;

    if (useServiceRoleForAdmin()) {
      const supabase = createAdminDataSupabase();
      const { data, error } = await supabase
        .from('homepage_images')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      rawImage = data;
    } else {
      // RPC Fallback
      const supabase = createAnonSupabase();
      const accessKey = getAdminOrdersAccessKey();

      const { data, error: rpcError } = await supabase.rpc('admin_update_homepage_image_rpc', {
        access_key: accessKey,
        p_id: id,
        p_updates: body
      });

      if (rpcError) throw rpcError;
      rawImage = data;
    }

    return NextResponse.json({ image: rawImage });
  } catch (err) {
    console.error(`PATCH /api/admin/homepage/${id}:`, err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update image' },
      { status: 500 }
    );
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
    if (useServiceRoleForAdmin()) {
      const supabase = createAdminDataSupabase();
      const { error } = await supabase
        .from('homepage_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } else {
      // RPC Fallback
      const supabase = createAnonSupabase();
      const accessKey = getAdminOrdersAccessKey();

      const { error: rpcError } = await supabase.rpc('admin_delete_homepage_image_rpc', {
        access_key: accessKey,
        p_id: id
      });

      if (rpcError) throw rpcError;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/admin/homepage/${id}:`, err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete image' },
      { status: 500 }
    );
  }
}
