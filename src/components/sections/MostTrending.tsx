'use client';
import { Box, Typography, Skeleton, Grid } from '@mui/material';
import { useState } from 'react';
import UseProductsReturn from '@/src/hooks/UseProductsReturn';
import { Product } from '@/src/types/productTypes';
import ProductCard from '@/src/components/ui/ProductCard';
import SectionHeading from '@/src/components/ui/SectionHeading';
import SectionContainer from '@/src/components/ui/SectionContainer';
import ViewAllLink from '@/src/components/ui/ViewAllLink';
import { brand, fonts } from '@/src/lib/designTokens';

const TABS = [
  { label: 'NEW ARRIVALS', filter: (p: Product) => p.product_new },
  { label: 'BEST SELLERS', filter: (p: Product) => p.product_bestsellere },
  {
    label: 'UNSTITCHED',
    filter: (p: Product) => p.product_category?.toLowerCase().includes('unstitch'),
  },
  {
    label: 'READY TO WEAR',
    filter: (p: Product) => {
      const cat = p.product_category?.toLowerCase() ?? '';
      return cat.includes('ready to wear') || cat.includes('ready-to-wear') || (!cat.includes('unstitch') && !cat.includes('accessories'));
    },
  },
  {
    label: 'BOTTOMS',
    filter: (p: Product) => {
      const cat = p.product_category?.toLowerCase() ?? '';
      return cat.includes('pants') || cat.includes('bottom') || cat.includes('trouser') || cat.includes('shalwar');
    },
  },
  {
    label: 'ACCESSORIES',
    filter: (p: Product) => {
      const cat = p.product_category?.toLowerCase() ?? '';
      const desc = p.product_description?.toLowerCase() ?? '';
      return cat.includes('accessories') || desc.includes('accessories');
    },
  },
  { label: 'ALL', filter: (_p: Product) => true },
];

export default function MostTrending() {
  const { items, loading } = UseProductsReturn();
  const [activeTab, setActiveTab] = useState(0);

  const filtered = items?.filter(TABS[activeTab].filter) ?? [];
  const displayItems = filtered.length > 0 ? filtered : items ?? [];

  return (
    <Box sx={{ backgroundColor: brand.white }}>
      <SectionContainer>
        <SectionHeading
          eyebrow="Shop the moment"
          title="Most trending"
          subtitle="Filter by category or browse what’s moving fastest right now."
          action={<ViewAllLink />}
          sx={{ mb: 2 }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            mb: 3,
            borderBottom: `1px solid ${brand.border}`,
            pb: 1.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1, md: 2 },
              flexWrap: 'wrap',
              overflowX: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {TABS.map((tab, i) => (
              <Box
                key={tab.label}
                onClick={() => setActiveTab(i)}
                sx={{
                  cursor: 'pointer',
                  pb: 1.5,
                  borderBottom:
                    activeTab === i
                      ? `2px solid ${brand.ink}`
                      : '2px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'border-color 0.25s ease',
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '10px', sm: '11px', md: '12px' },
                    fontWeight: activeTab === i ? 700 : 500,
                    color: activeTab === i ? brand.ink : brand.muted,
                    letterSpacing: '0.08em',
                    fontFamily: fonts.sans,
                    transition: 'color 0.25s ease',
                    '&:hover': { color: brand.ink },
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} />
        </Box>

        <Box sx={{ pb: 2 }}>
          {loading ? (
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2,1fr)', sm: { gridTemplateColumns: 'repeat(3,1fr)' } }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Box key={i}>
                  <Skeleton variant="rectangular" sx={{ aspectRatio: '4/5', borderRadius: '8px' }} />
                  <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="50%" />
                </Box>
              ))}
            </Box>
          ) : (
            <Grid container spacing={2}>
              {displayItems.slice(0, 12).map((item) => (
                <Grid key={item.id} item xs={6} sm={4} md={3} lg={2}>
                  <ProductCard product={item} href={`/shop/${item.id}`} layout="grid" />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </SectionContainer>
    </Box>
  );
}
