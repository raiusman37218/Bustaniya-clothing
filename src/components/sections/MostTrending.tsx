'use client';
import { Box, Typography, Skeleton } from '@mui/material';
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

const marqueeKeyframes = {
  '@keyframes marqueeMostTrending': {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(-50%)' },
  },
};

export default function MostTrending() {
  const { items, loading } = UseProductsReturn();
  const [activeTab, setActiveTab] = useState(0);

  const filtered = items?.filter(TABS[activeTab].filter) ?? [];
  const displayItems = filtered.length > 0 ? filtered : items ?? [];

  // Limit display to maximum 10 unique products
  const uniqueItems = displayItems.slice(0, 10);
  
  // To ensure the infinite horizontal loop behaves perfectly without gaps,
  // we ensure we have at least 6 base items (repeating if necessary) before duplicating.
  let baseItems = [...uniqueItems];
  if (baseItems.length > 0 && baseItems.length < 6) {
    while (baseItems.length < 6) {
      baseItems = [...baseItems, ...uniqueItems];
    }
  }
  const marqueeItems = [...baseItems, ...baseItems];

  return (
    <Box sx={{ backgroundColor: brand.white, overflow: 'hidden' }}>
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

        <Box 
          sx={{ 
            pb: 2, 
            overflow: 'hidden', 
            width: '100%', 
            position: 'relative' 
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', gap: 3, overflowX: 'hidden' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Box key={i} sx={{ width: { xs: 'calc(50vw - 28px)', sm: '220px', md: '240px' }, flexShrink: 0 }}>
                  <Skeleton variant="rectangular" sx={{ aspectRatio: '3/4', borderRadius: 0 }} />
                  <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="50%" />
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                width: 'max-content',
                animation: 'marqueeMostTrending 35s linear infinite',
                '&:hover': {
                  animationPlayState: 'paused',
                },
                ...marqueeKeyframes,
              }}
            >
              {marqueeItems.map((item, index) => (
                <Box
                  key={`${item.id}-${index}`}
                  sx={{
                    width: { xs: 'calc(50vw - 28px)', sm: '220px', md: '240px' },
                    flexShrink: 0,
                  }}
                >
                  <ProductCard product={item} href={`/shop/${item.id}`} layout="carousel" />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </SectionContainer>
    </Box>
  );
}
