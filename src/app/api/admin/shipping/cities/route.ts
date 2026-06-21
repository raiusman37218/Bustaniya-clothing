import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/src/lib/admin/auth';
import { getPostExOperationalCities } from '@/src/lib/shipping/postex';

export async function GET(req: NextRequest) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type') as '1' | '2' | 'Pickup' | 'Delivery' | null;

    // Fetch operational cities from PostEx
    // Cache control is good so it does not fetch on every single click
    const cities = await getPostExOperationalCities(type || undefined);

    return NextResponse.json({
      success: true,
      cities,
    });
  } catch (err: any) {
    console.error('GET /api/admin/shipping/cities error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch operational cities from PostEx.' },
      { status: 500 }
    );
  }
}
