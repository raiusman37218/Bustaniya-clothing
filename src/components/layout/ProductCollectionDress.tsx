import React from 'react';
import { Grid } from '@mui/material';
import { PropsWithChildren } from 'react';
import { Product } from '@/src/types/productTypes';
import ProductCard from '@/src/components/ui/ProductCard';

interface ProductValue {
  items: Product[];
  count: number;
}

export default function ProductMainCollectionBlouses(
  props: PropsWithChildren<ProductValue>,
) {
  const { items, count } = props;

  return (
    <>
      {items?.slice(0, count).map((item) => (
        <Grid item xs={12} sm={6} key={item.id} sx={{ mb: 1 }}>
          <ProductCard
            product={item}
            href={`/collection/dresses/products/${item.id}`}
            layout="grid"
          />
        </Grid>
      ))}
    </>
  );
}
