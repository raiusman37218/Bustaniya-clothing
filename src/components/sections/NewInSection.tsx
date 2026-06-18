'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Grid,
  Skeleton,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import UseProductsReturn from '@/src/hooks/UseProductsReturn';
import ProductCard from '@/src/components/ui/ProductCard';
import SectionHeading from '@/src/components/ui/SectionHeading';
import SectionContainer from '@/src/components/ui/SectionContainer';
import {
  fonts,
} from '@/src/lib/designTokens';

export default function NewInSection() {
  const { items, loading } = UseProductsReturn();

  const newProducts = useMemo(
    () => items?.filter((p) => p.product_new) ?? [],
    [items],
  );

  // Show up to 8 new products
  const displayProducts = newProducts.slice(0, 8);

  return (
    <SectionContainer>
      <SectionHeading
        eyebrow="Fresh drops every week"
        title="New arrivals"
        align="center"
      />

      <Grid container spacing={{ xs: 2, md: 2.5 }}>
        {loading ? (
          Array.from({ length: 4 }, (_, index) => (
            <Grid item md={3} xs={6} key={index}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: '3/4', bgcolor: 'rgba(0,0,0,0.05)' }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ bgcolor: 'rgba(0,0,0,0.05)' }} />
                <Skeleton variant="text" width="40%" height={20} sx={{ bgcolor: 'rgba(0,0,0,0.05)' }} />
              </Box>
            </Grid>
          ))
        ) : (
          displayProducts.map((product) => (
            <Grid item md={3} xs={6} key={product.id}>
              <ProductCard
                product={product}
                href={`/shop/${product.id}`}
                layout="grid"
                sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
                sx={{ height: '100%' }}
              />
            </Grid>
          ))
        )}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, md: 6 } }}>
        <Button
          component={Link}
          href="/shop?category=new-in"
          variant="contained"
          disableElevation
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: 'uppercase',
            fontWeight: 600,
            fontSize: '12px',
            px: 5,
            py: 1.75,
            borderRadius: 0,
            bgcolor: '#111111',
            color: '#ffffff',
            fontFamily: fonts.sans,
            boxShadow: 'none',
            letterSpacing: '0.15em',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'transparent',
              color: '#111111',
              border: '1px solid #111111',
              boxShadow: 'none',
            },
          }}
        >
          Shop all
        </Button>
      </Box>
    </SectionContainer>
  );
}
