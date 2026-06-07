import { MOCK_PRODUCTS } from '@/src/data/mockProducts';
import { mapDbProduct } from '@/src/lib/products/mapDbProduct';
import { normalizeProduct } from '@/src/lib/products/productImages';
import { createCatalogSupabase } from '@/src/lib/supabase/service';
import { Product } from '@/src/types/productTypes';

export async function fetchProductsByIds(ids: string[]): Promise<Map<string, Product>> {
  const map = new Map<string, Product>();
  if (!ids.length) return map;

  if (ids.length && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = createCatalogSupabase();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', ids);

      if (!error && data?.length) {
        for (const row of data) {
          const product = normalizeProduct(mapDbProduct(row));
          map.set(String(product.id), product);
        }
      }
    } catch (err) {
      console.error('fetchProductsByIds:', err);
    }
  }

  for (const id of ids) {
    if (map.has(String(id))) continue;
    const mock = MOCK_PRODUCTS.find((p) => String(p.id) === String(id));
    if (mock) map.set(String(id), normalizeProduct(mock));
  }

  return map;
}
