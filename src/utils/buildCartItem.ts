import { getProductImageSrc } from '@/src/lib/products/productImages';
import { CartItem } from '@/src/types/CartItemTypes';
import { Product } from '@/src/types/productTypes';

export function getDefaultProductColor(product: Product): string | undefined {
  const defaultHex = product.product_color.find((c) => c.currentColor)?.currentColor;
  if (defaultHex) {
    return product.product_color.find((c) => c.hex === defaultHex)?.name;
  }
  return product.product_color[0]?.name;
}

export function getDefaultProductSize(product: Product): string {
  return product.product_size?.[0] ?? 'M';
}

export function buildCartItemFromProduct(product: Product): CartItem {
  return {
    id: product.id,
    name: product.product_name,
    image: getProductImageSrc(product),
    quantity: 1,
    price: product.procuct_price.toString(),
    color: getDefaultProductColor(product),
    size: getDefaultProductSize(product),
  };
}
