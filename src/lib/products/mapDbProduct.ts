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

export function mapDbProduct(row: any): Product {
  if (!row) {
    return {
      id: '',
      procuct_price: '0',
      product_bestsellere: false,
      product_category: '',
      product_color: [],
      product_description: '',
      product_img: [],
      product_instock: false,
      product_name: '',
      product_new: false,
      product_size: [],
    };
  }

  const name = row.product_name ?? row.name ?? '';
  const price = row.procuct_price ?? String(row.price ?? '0');
  const category = row.product_category ?? row.category ?? '';
  const description = row.product_description ?? row.description ?? '';
  const instock = row.product_instock ?? row.instock ?? false;
  const bestsellere = row.product_bestsellere ?? row.bestsellere ?? false;
  const productNew = row.product_new ?? row.new ?? false;

  const parseJsonField = (field: any) => {
    if (!field) return [];
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return [];
      }
    }
    return Array.isArray(field) ? field : [];
  };

  const rawColors = parseJsonField(row.product_color ?? row.color);
  const rawSizes = parseJsonField(row.product_size ?? row.size);
  const rawImgs = parseJsonField(row.product_img ?? row.img);

  return {
    id: String(row.id),
    procuct_price: price,
    product_bestsellere: bestsellere,
    product_category: category,
    product_color: parseColors(rawColors),
    product_description: description,
    product_img: parseProductImageList(rawImgs),
    product_instock: instock,
    product_name: name,
    product_new: productNew,
    product_size: parseSizes(rawSizes),
  };
}
