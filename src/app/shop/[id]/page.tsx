'use client';

import ProductDetail from '@/src/components/layout/ProductDetail';
import SpinnerLoader from '@/src/components/layout/SpinnerLoader';
import { getSingleproduct } from '@/src/helper';
import { Product } from '@/src/types/productTypes';
import { useEffect, useState } from 'react';

export default function ShopProductPage({ params }: { params: { id: string } }) {
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const { id } = params;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const { singleProduct: p } = await getSingleproduct(id);
      if (!cancelled) setSingleProduct(p ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!singleProduct) return <SpinnerLoader />;

  return <ProductDetail product={singleProduct} ItemMiddle="Shop" ItemLink="shop" />;
}
