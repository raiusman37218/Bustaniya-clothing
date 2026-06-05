import React, { PropsWithChildren } from 'react';
import { Product } from '@/src/types/productTypes';
import ProductCard from '@/src/components/ui/ProductCard';

interface PropsType {
  item: Product;
  link: string;
}

export default function Products(props: PropsWithChildren<PropsType>) {
  const { item, link } = props;
  return <ProductCard product={item} href={link} layout="grid" />;
}
