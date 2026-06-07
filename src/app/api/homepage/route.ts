import { NextResponse } from 'next/server';
import { createCatalogSupabase } from '@/src/lib/supabase/service';

export async function GET() {
  try {
    const supabase = createCatalogSupabase();
    
    const { data, error } = await supabase
      .from('homepage_images')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('Database error fetching homepage_images (possibly table does not exist yet):', error.message);
      // Fail gracefully so that frontend fallbacks can trigger
      return NextResponse.json({ images: [] });
    }

    return NextResponse.json({ images: data || [] });
  } catch (err) {
    console.error('GET /api/homepage:', err);
    return NextResponse.json({ images: [] });
  }
}
