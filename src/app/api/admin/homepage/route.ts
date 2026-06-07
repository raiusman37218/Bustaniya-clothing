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

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = useServiceRoleForAdmin()
      ? createAdminDataSupabase()
      : createCatalogSupabase();

    const { data, error } = await supabase
      .from('homepage_images')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      // If table doesn't exist yet, return empty list
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        return NextResponse.json({ images: [] });
      }
      throw error;
    }

    return NextResponse.json({ images: data || [] });
  } catch (err) {
    console.error('GET /api/admin/homepage:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { section, image_url, alt_text = '', link_url = '', sort_order = 0 } = body;

    if (!section || !image_url) {
      return NextResponse.json({ error: 'Section and image URL are required' }, { status: 400 });
    }

    let rawImage: any = null;

    if (useServiceRoleForAdmin()) {
      const supabase = createAdminDataSupabase();
      const { data, error } = await supabase
        .from('homepage_images')
        .insert({
          section,
          image_url,
          alt_text,
          link_url,
          sort_order: Number(sort_order) || 0
        })
        .select()
        .single();

      if (error) throw error;
      rawImage = data;
    } else {
      // RPC Fallback
      const supabase = createAnonSupabase();
      const accessKey = getAdminOrdersAccessKey();

      const { data, error: rpcError } = await supabase.rpc('admin_insert_homepage_image_rpc', {
        access_key: accessKey,
        p_section: section,
        p_image_url: image_url,
        p_alt_text: alt_text,
        p_link_url: link_url,
        p_sort_order: Number(sort_order) || 0
      });

      if (rpcError) throw rpcError;
      rawImage = data;
    }

    return NextResponse.json({ image: rawImage });
  } catch (err) {
    console.error('POST /api/admin/homepage:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to add image' },
      { status: 500 }
    );
  }
}
