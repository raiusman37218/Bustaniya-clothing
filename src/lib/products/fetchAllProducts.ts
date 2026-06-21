import { MOCK_PRODUCTS } from '@/src/data/mockProducts';
import { mapDbProduct } from '@/src/lib/products/mapDbProduct';
import { normalizeProducts } from '@/src/lib/products/productImages';
import { createCatalogSupabase } from '@/src/lib/supabase/service';
import type { Product } from '@/src/types/productTypes';

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}

export async function fetchAllProductsFromSupabase(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = createCatalogSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data?.length) return [];
    return normalizeProducts(data.map(mapDbProduct));
  } catch (err) {
    console.error('fetchAllProductsFromSupabase:', err);
    return [];
  }
}

export async function fetchProductsWithFallback(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    return await fetchAllProductsFromSupabase();
  }
  return normalizeProducts(MOCK_PRODUCTS);
}
