'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Skeleton,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import UseProductsReturn from '@/src/hooks/UseProductsReturn';
import ProductCard from '@/src/components/ui/ProductCard';
import {
  brand,
  containerPadding,
  fonts,
  radius,
  shadows,
} from '@/src/lib/designTokens';
import type { Product } from '@/src/types/productTypes';

const PRODUCTS_PER_SLIDE = 2;
const AUTO_INTERVAL_MS = 6500;

function NewInProductCard({ product }: { product: Product }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        bgcolor: brand.white,
      }}
    >
      <ProductCard
        product={product}
        href={`/shop/${product.id}`}
        layout="grid"
        sizes="(max-width: 900px) 50vw, 29vw"
        sx={{ height: '100%' }}
      />
    </Box>
  );
}

export default function NewInSection() {
  const { items, loading } = UseProductsReturn();
  const [index, setIndex] = useState(0);

  const newProducts = useMemo(
    () => items?.filter((p) => p.product_new) ?? [],
    [items],
  );

  const slideCount = Math.max(
    1,
    Math.ceil(newProducts.length / PRODUCTS_PER_SLIDE),
  );

  const slides = useMemo(() => {
    if (newProducts.length === 0) return [] as Product[][];
    const chunks: Product[][] = [];
    for (let i = 0; i < newProducts.length; i += PRODUCTS_PER_SLIDE) {
      chunks.push(newProducts.slice(i, i + PRODUCTS_PER_SLIDE));
    }
    return chunks;
  }, [newProducts]);

  const currentSlide = slides[index] ?? [];

  const go = useCallback(
    (i: number) => {
      if (slideCount <= 1) return;
      setIndex(((i % slideCount) + slideCount) % slideCount);
    },
    [slideCount],
  );

  useEffect(() => {
    setIndex(0);
  }, [newProducts.length]);

  useEffect(() => {
    if (slideCount <= 1) return;
    const t = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slideCount);
    }, AUTO_INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [slideCount]);

  return (
    <Box
      component="section"
      id="new-in"
      sx={{
        bgcolor: brand.white,
        overflow: 'hidden',
        mt: { xs: 2, md: 3 },
        mb: { xs: 1, md: 2 },
      }}
    >
      <Container maxWidth="xl" sx={containerPadding}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: { xs: 'auto', md: 'min(88vh, 820px)' },
            borderRadius: { xs: 0, md: radius.editorial },
            overflow: 'hidden',
            boxShadow: { md: shadows.section },
          }}
        >
          <Box
            sx={{
              flex: { xs: '1 1 auto', md: '0 0 40%' },
              maxWidth: { md: '42%' },
              px: { xs: 3, sm: 4, md: 6 },
              py: { xs: 5, md: 8 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 2.5,
              order: { xs: 2, md: 1 },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '11px', sm: '12px' },
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: brand.muted,
                fontFamily: fonts.sans,
                fontWeight: 600,
              }}
            >
              Just arrived
            </Typography>

            <Typography
              component="h2"
              sx={{
                fontSize: { xs: '2.25rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                color: brand.ink,
                fontFamily: fonts.display,
              }}
            >
              New in
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '15px', md: '16px' },
                lineHeight: 1.65,
                color: brand.charcoal,
                maxWidth: '420px',
                fontFamily: fonts.sans,
              }}
            >
              The latest pieces from Bustaniya — fresh silhouettes, new
              colours, and styles marked as new appear here automatically.
            </Typography>

            <Box sx={{ pt: 1 }}>
              <Button
                component={Link}
                href="/shop?category=new-in"
                variant="contained"
                disableElevation
                endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                sx={{
                  alignSelf: 'flex-start',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '15px',
                  px: 3,
                  py: 1.25,
                  borderRadius: radius.button,
                  bgcolor: brand.sage,
                  color: '#fff',
                  fontFamily: fonts.sans,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: brand.sageLight, boxShadow: 'none' },
                }}
              >
                Shop new in
              </Button>
            </Box>

            {slideCount > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  pt: { xs: 3, md: 5 },
                }}
              >
                {Array.from({ length: slideCount }).map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => go(i)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Show new in products slide ${i + 1}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') go(i);
                    }}
                    sx={{
                      height: '3px',
                      borderRadius: radius.button,
                      cursor: 'pointer',
                      flex: i === index ? '0 0 48px' : '0 0 22px',
                      bgcolor: i === index ? brand.ink : brand.border,
                      transition: 'all 0.35s ease',
                      '&:hover': {
                        bgcolor: i === index ? brand.ink : '#ccc',
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

          <Box
            sx={{
              flex: { xs: '1 1 auto', md: '1 1 58%' },
              display: 'flex',
              minHeight: { xs: 'min(72vw, 420px)', md: 'auto' },
              order: { xs: 1, md: 2 },
            }}
          >
            {loading ? (
              <>
                <Skeleton
                  variant="rectangular"
                  sx={{ flex: 1, minHeight: { xs: 'min(72vw, 420px)', md: '100%' } }}
                />
                <Skeleton
                  variant="rectangular"
                  sx={{
                    flex: 1,
                    display: { xs: 'none', sm: 'block' },
                    minHeight: { xs: 'min(72vw, 420px)', md: '100%' },
                  }}
                />
              </>
            ) : newProducts.length === 0 ? (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: brand.imageBg,
                  px: 3,
                }}
              >
                <Typography
                  sx={{
                    color: brand.muted,
                    textAlign: 'center',
                    fontFamily: fonts.sans,
                    maxWidth: 320,
                  }}
                >
                  New arrivals will appear here. Mark products as new in the
                  admin catalog to feature them.
                </Typography>
              </Box>
            ) : (
              currentSlide.map((product) => (
                <NewInProductCard key={product.id} product={product} />
              ))
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
