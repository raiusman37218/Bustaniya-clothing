import type { Tables } from '@/src/lib/supabase/database.types';
import type { ColorData, Product } from '@/src/types/productTypes';
import { parseProductImageList } from '@/src/lib/products/productImages';

function parseColors(raw: unknown): ColorData[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const row = entry as Record<string, unknown>;
      const name = String(row.name ?? '').trim();
      const hex = String(row.hex ?? row.currentColor ?? '').trim();
      if (!name || !hex) return null;
      return {
        name,
        hex,
        currentColor: String(row.currentColor ?? hex),
      };
    })
    .filter((c): c is ColorData => c !== null);
}

function parseSizes(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s) => String(s).trim()).filter(Boolean);
}

export function mapDbProduct(row: Tables<'product'>): Product {
  return {
    id: String(row.id),
    procuct_price: row.procuct_price ?? '0',
    product_bestsellere: row.product_bestsellere,
    product_category: row.product_category ?? '',
    product_color: parseColors(row.product_color),
    product_description: row.product_description ?? '',
    product_img: parseProductImageList(row.product_img),
    product_instock: row.product_instock,
    product_name: row.product_name,
    product_new: row.product_new,
    product_size: parseSizes(row.product_size),
  };
}
