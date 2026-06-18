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
  {
    label: 'KURTI',
    filter: (p: Product) => {
      const cat = p.product_category?.toLowerCase() ?? '';
      const name = p.product_name?.toLowerCase() ?? '';
      return cat.includes('kurti') || name.includes('kurti');
    },
  },
  {
    label: 'FULL DRESS',
    filter: (p: Product) => {
      const cat = p.product_category?.toLowerCase() ?? '';
      const name = p.product_name?.toLowerCase() ?? '';
      return cat.includes('full dress') || cat.includes('dress') || name.includes('full dress') || name.includes('dress');
    },
  },
  {
    label: 'CUSTOMIZED DRESS',
    filter: (p: Product) => {
      const cat = p.product_category?.toLowerCase() ?? '';
      const name = p.product_name?.toLowerCase() ?? '';
      return (
        cat.includes('custom') ||
        cat.includes('custm') ||
        cat.includes('cutom') ||
        name.includes('custom') ||
        name.includes('custm') ||
        name.includes('cutom')
      );
    },
  },
  {
    label: 'FERSHI SHALWAR',
    filter: (p: Product) => {
      const cat = p.product_category?.toLowerCase() ?? '';
      const name = p.product_name?.toLowerCase() ?? '';
      return (
        cat.includes('fershi') ||
        cat.includes('freshi') ||
        cat.includes('shalwar') ||
        name.includes('fershi') ||
        name.includes('freshi') ||
        name.includes('shalwar')
      );
    },
  },
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
          align="center"
          action={<ViewAllLink />}
          sx={{ mb: 2 }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
              gap: { xs: 1.5, md: 2.5 },
              flexWrap: 'wrap',
              justifyContent: 'center',
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
                      ? `1px solid ${brand.ink}`
                      : '1px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'border-color 0.25s ease',
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '10px', sm: '11px', md: '12px' },
                    fontWeight: activeTab === i ? 600 : 500,
                    color: activeTab === i ? brand.ink : brand.muted,
                    letterSpacing: '0.15em',
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
