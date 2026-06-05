import type { Product } from '@/src/types/productTypes';
import { PAKISTANI_FASHION } from '@/src/data/pakistaniFashionImages';
import { getStoragePublicUrl } from '@/src/lib/supabase/storage';

export const PRODUCT_IMAGE_FALLBACK = PAKISTANI_FASHION.productStock[0];

/** Parse DB/jsonb/string values into a list of image paths or URLs. */
export function parseProductImageList(raw: unknown): string[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((entry) => {
        if (typeof entry === 'string') return entry.trim();
        if (entry && typeof entry === 'object' && 'url' in entry) {
          return String((entry as { url: string }).url).trim();
        }
        return String(entry).trim();
      })
      .filter(Boolean);
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        return parseProductImageList(JSON.parse(trimmed) as unknown);
      } catch {
        return [trimmed];
      }
    }
    return [trimmed];
  }
  return [];
}

/** Turn a stored path or URL into a value Next.js Image can load. */
export function resolveProductImageUrl(src: string): string {
  const url = src.trim();
  if (!url) return PRODUCT_IMAGE_FALLBACK;

  if (/supabase\.co\/storage\//i.test(url)) return url;

  const fileName = url.split('/').pop() ?? url;
  const stockPath = (name: string) =>
    /^stock-\d+\.(jpg|jpeg|png|webp)$/i.test(name)
      ? `/images/pakistani-fashion/${name}`
      : null;

  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  if (url.includes('/images/mock/')) {
    const mapped = stockPath(fileName);
    if (mapped) return mapped;
  }

  if (url.startsWith('/')) {
    const mapped = stockPath(fileName);
    if (mapped && url.includes('stock-')) return mapped;
    return url;
  }

  const mapped = stockPath(fileName);
  if (mapped) return mapped;

  const storageUrl = getStoragePublicUrl(url);
  if (storageUrl.startsWith('http')) return storageUrl;

  return `/images/pakistani-fashion/${fileName}`;
}

/** Normalize cart/wishlist image strings saved before path migration. */
export function resolveCartImageUrl(src: string | undefined): string {
  if (!src?.trim()) return PRODUCT_IMAGE_FALLBACK;
  return resolveProductImageUrl(src);
}

export function getProductImageSrc(product: Product, index = 0): string {
  const list = parseProductImageList(product.product_img);
  const raw = list[index] ?? list[0];
  return raw ? resolveProductImageUrl(raw) : PRODUCT_IMAGE_FALLBACK;
}

export function normalizeProduct<T extends Product>(product: T): T {
  const parsed = parseProductImageList(product.product_img);
  const product_img = parsed.length
    ? parsed.map(resolveProductImageUrl)
    : [PRODUCT_IMAGE_FALLBACK];

  return {
    ...product,
    id: String(product.id),
    product_img,
  };
}

export function normalizeProducts(products: Product[]): Product[] {
  return products.map(normalizeProduct);
}
