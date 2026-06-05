import React, { PropsWithChildren } from 'react';
import { Product } from '@/src/types/productTypes';
import ProductCard from '@/src/components/ui/ProductCard';

interface Types {
  item: Product;
  link: string;
}

export default function ProductMobile(props: PropsWithChildren<Types>) {
  const { item, link } = props;
  return <ProductCard product={item} href={link} layout="carousel" />;
}
