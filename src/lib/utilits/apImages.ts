import { fetchProductsWithFallback } from '@/src/lib/products/fetchAllProducts';
import type { Product } from '@/src/types/productTypes';

export async function getImages(): Promise<Product[]> {
  return fetchProductsWithFallback();
}
