import { Container, Grid } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { Product } from '@/src/types/productTypes';
import ProductCard from '@/src/components/ui/ProductCard';

interface Types {
  loading: boolean;
  count: number;
  items: Product[];
}

export default function GridItemsSearch(props: PropsWithChildren<Types>) {
  const { items } = props;

  return (
    <Container sx={{ mt: 6, display: { xs: 'flex', md: 'none' }, mb: 5 }}>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={6} key={item.id}>
            <ProductCard
              product={item}
              href={`/shop/${item.id}`}
              layout="grid"
              sizes="50vw"
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
