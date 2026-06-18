'use client';

import { useEffect, useMemo, useState } from 'react';
import ProductCard from '@/src/components/ui/ProductCard';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Grid,
  Skeleton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BannerHeader from '@/src/components/headers/BannerHeader';
import NavBar from '@/src/components/layout/NavBar';
import Footer from '@/src/components/layout/Footer';
import SectionContainer from '@/src/components/ui/SectionContainer';
import SectionHeading from '@/src/components/ui/SectionHeading';
import UseProductsReturn from '@/src/hooks/UseProductsReturn';
import type { Product } from '@/src/types/productTypes';
import { brand, fonts } from '@/src/lib/designTokens';

function matchesCategoryAndSub(product: Product, category: string, sub: string): boolean {
  const cat = product.product_category?.toLowerCase() ?? '';
  const desc = product.product_description?.toLowerCase() ?? '';

  // 1. Check main category
  let matchesMain = false;
  if (category === 'all') {
    matchesMain = true;
  } else if (category === 'new-in') {
    matchesMain = product.product_new;
  } else if (category === 'unstitched') {
    matchesMain = cat.includes('unstitch');
  } else if (category === 'ready-to-wear') {
    matchesMain = cat.includes('ready to wear') || cat.includes('ready-to-wear') || cat === 'ready to wear' || (!cat.includes('unstitch') && !cat.includes('accessories'));
  } else if (category === 'bottoms') {
    matchesMain = cat.includes('pants') || cat.includes('bottom') || cat.includes('trouser') || cat.includes('shalwar');
  } else if (category === 'accessories') {
    matchesMain = cat.includes('accessories') || desc.includes('accessories');
  } else {
    matchesMain = cat === category.toLowerCase();
  }

  if (!matchesMain) return false;

  // 2. Check sub category
  if (!sub || sub === 'all') return true;

  if (sub === '2-piece') {
    return cat.includes('2-piece') || cat.includes('two piece') || cat.includes('2 piece');
  }
  if (sub === '3-piece') {
    return cat.includes('3-piece') || cat.includes('three piece') || cat.includes('3 piece');
  }
  if (sub === 'formal') {
    return cat.includes('formal') || desc.includes('formal');
  }
  if (sub === 'causal' || sub === 'casual') {
    return cat.includes('causal') || cat.includes('casual') || desc.includes('casual');
  }
  if (sub === 'informal') {
    return cat.includes('informal') || desc.includes('informal');
  }
  if (sub === 'pants') {
    return cat.includes('pants') || cat.includes('trouser') || cat.includes('shalwar') || cat.includes('bottom');
  }

  return true;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Products',
  'new-in': 'New In',
  'ready-to-wear': 'Ready To Wear',
  unstitched: 'Unstitched',
  bottoms: 'Bottoms',
  accessories: 'Accessories',
  '2-piece': '2 Piece',
  '3-piece': '3 Piece',
  formal: 'Formal',
  causal: 'Causal',
  informal: 'Informal',
  pants: 'Pants & Trousers',
};

const MAIN_CATEGORIES = [
  { label: 'All Products', value: 'all' },
  { label: 'Unstitched', value: 'unstitched' },
  { label: 'Ready To Wear', value: 'ready-to-wear' },
  { label: 'Bottoms', value: 'bottoms' },
  { label: 'Accessories', value: 'accessories' },
];

const SUB_CATEGORIES: Record<string, { label: string; value: string }[]> = {
  unstitched: [
    { label: 'All Unstitched', value: 'all' },
    { label: '2 Piece', value: '2-piece' },
    { label: '3 Piece', value: '3-piece' },
  ],
  'ready-to-wear': [
    { label: 'All Ready To Wear', value: 'all' },
    { label: '2 Piece Stitched', value: '2-piece' },
    { label: '3 Piece Stitched', value: '3-piece' },
    { label: 'Formal', value: 'formal' },
    { label: 'Causal', value: 'causal' },
    { label: 'Informal', value: 'informal' },
  ],
  bottoms: [
    { label: 'All Bottoms', value: 'all' },
    { label: 'Pants & Trousers', value: 'pants' },
  ],
  accessories: [
    { label: 'All Accessories', value: 'all' },
  ],
};

const SORT_OPTIONS = [
  { value: 'new', label: 'New Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'popular', label: 'Popularity' },
];

export default function ShopCatalog() {
  const searchParams = useSearchParams();
  const qRaw = searchParams.get('q') ?? '';
  const q = qRaw.trim().toLowerCase();
  const initialCategory = searchParams.get('category') ?? 'all';
  const initialSub = searchParams.get('sub') ?? 'all';
  const { items, loading } = UseProductsReturn();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSub, setSelectedSub] = useState(initialSub);
  const [sortBy, setSortBy] = useState('new');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(qRaw);
  const products = items ?? [];

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSelectedSub(initialSub);
  }, [initialSub]);

  const priceRange = useMemo(() => {
    const values = products.map((product) => Number(product.procuct_price) || 0);
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 20000);
    return [min, max] as [number, number];
  }, [products]);

  const [selectedPrice] = useState<[number, number]>(priceRange);

  const filteredItems = useMemo(() => {
    let list = products;

    if (selectedCategory) {
      list = list.filter((product) => matchesCategoryAndSub(product, selectedCategory, selectedSub));
    }

    if (q) {
      list = list.filter((product) =>
        product.product_name.toLowerCase().includes(q),
      );
    }

    list = list.filter((product) => {
      const price = Number(product.procuct_price) || 0;
      return price >= selectedPrice[0] && price <= selectedPrice[1];
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort(
        (a, b) => Number(a.procuct_price) - Number(b.procuct_price),
      );
    } else if (sortBy === 'popular') {
      list = [...list].sort((a, b) => Number(b.product_bestsellere) - Number(a.product_bestsellere));
    } else if (sortBy === 'new') {
      list = [...list].sort((a, b) => Number(b.product_new) - Number(a.product_new));
    }

    return list;
  }, [products, selectedCategory, selectedSub, q, selectedPrice, sortBy]);

  const itemsPerPage = 16; // 4 items per row layout fits multiples of 4 (16 is perfect)
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const pageItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const pageTitle = selectedCategory && selectedCategory !== 'all'
    ? CATEGORY_LABELS[selectedCategory] ?? selectedCategory
    : 'All Products';

  const subCats = SUB_CATEGORIES[selectedCategory] || [];

  return (
    <>
      <BannerHeader />
      <NavBar />
      
      <Box component="main" sx={{ bgcolor: brand.white, minHeight: '100vh', pt: { xs: 4, md: 6 } }}>
        <SectionContainer sx={{ py: { xs: 2, md: 4 } }}>
          
          {/* Header Cover Title */}
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <SectionHeading
              title={pageTitle}
              align="center"
            />
          </Box>

          {/* Minimal Text Tab Menu Category Selector */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 3.5, md: 5 },
              overflowX: 'auto',
              pb: 1.5,
              mb: 6,
              borderBottom: `1px solid ${brand.border}`,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {selectedCategory === 'all'
              ? MAIN_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.value;
                  return (
                    <Box
                      key={cat.value}
                      onClick={() => {
                        setPage(1);
                        setSelectedCategory(cat.value);
                        setSelectedSub('all');
                      }}
                      sx={{
                        cursor: 'pointer',
                        pb: 1.5,
                        borderBottom: isSelected ? '1px solid #111111' : '1px solid transparent',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          borderBottom: '1px solid #111111',
                          '& p': { color: '#111111' },
                        }
                      }}
                    >
                      <Typography
                        sx={{
                          textTransform: 'uppercase',
                          fontSize: '11px',
                          fontWeight: isSelected ? 600 : 500,
                          letterSpacing: '0.18em',
                          fontFamily: fonts.sans,
                          color: isSelected ? '#111111' : 'rgba(0,0,0,0.4)',
                          transition: 'color 0.25s ease',
                        }}
                      >
                        {cat.label}
                      </Typography>
                    </Box>
                  );
                })
              : (
                  <>
                    {/* Back link */}
                    <Box
                      onClick={() => {
                        setPage(1);
                        setSelectedCategory('all');
                        setSelectedSub('all');
                      }}
                      sx={{
                        cursor: 'pointer',
                        pb: 1.5,
                        mr: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          textTransform: 'uppercase',
                          fontSize: '11px',
                          fontWeight: 500,
                          letterSpacing: '0.18em',
                          fontFamily: fonts.sans,
                          color: 'rgba(0,0,0,0.4)',
                          transition: 'color 0.2s ease',
                          '&:hover': { color: '#111111' },
                        }}
                      >
                        ← All
                      </Typography>
                    </Box>

                    {/* Subcategories */}
                    {subCats.map((sub) => {
                      const isSelected = selectedSub === sub.value;
                      return (
                        <Box
                          key={sub.value}
                          onClick={() => {
                            setPage(1);
                            setSelectedSub(sub.value);
                          }}
                          sx={{
                            cursor: 'pointer',
                            pb: 1.5,
                            borderBottom: isSelected ? '1px solid #111111' : '1px solid transparent',
                            transition: 'all 0.25s ease',
                            '&:hover': {
                              borderBottom: '1px solid #111111',
                              '& p': { color: '#111111' },
                            }
                          }}
                        >
                          <Typography
                            sx={{
                              textTransform: 'uppercase',
                              fontSize: '11px',
                              fontWeight: isSelected ? 600 : 500,
                              letterSpacing: '0.18em',
                              fontFamily: fonts.sans,
                              color: isSelected ? '#111111' : 'rgba(0,0,0,0.4)',
                              transition: 'color 0.25s ease',
                            }}
                          >
                            {sub.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </>
                )
            }
          </Box>

          <Box>
            {/* Elegant Header Controls Block: Search & Sort aligned on same row */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                mb: 5,
              }}
            >
              {/* Subtle bottom-line-only search */}
              <Box
                component="form"
                action="/shop"
                method="GET"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid #e0e0e0',
                  width: { xs: '100%', sm: '280px' },
                  transition: 'border-color 0.25s ease',
                  '&:focus-within': {
                    borderBottom: '1px solid #111111',
                  },
                }}
              >
                <InputAdornment position="start" sx={{ mr: 1, ml: 0.5 }}>
                  <SearchIcon sx={{ color: '#888', fontSize: 16 }} />
                </InputAdornment>
                <input
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    padding: '8px 0',
                    fontSize: '12px',
                    fontFamily: fonts.sans,
                    letterSpacing: '0.05em',
                    color: '#111111',
                    background: 'transparent',
                  }}
                />
              </Box>

              {/* Minimalist Meta Details & Sorting Dropdown */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 3,
                }}
              >
                <Typography sx={{ color: brand.muted, fontWeight: 400, fontSize: '12.5px', fontFamily: fonts.sans, display: { xs: 'none', sm: 'block' } }}>
                  Showing {filteredItems.length} {filteredItems.length === 1 ? 'product' : 'products'}
                </Typography>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel sx={{ fontSize: '12px', fontFamily: fonts.sans, '&.Mui-focused': { color: '#111' } }}>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort by"
                    onChange={(event) => {
                      setSortBy(event.target.value);
                      setPage(1);
                    }}
                    sx={{
                      fontSize: '12px',
                      fontFamily: fonts.sans,
                      borderRadius: 0,
                      '&.MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#111111', borderWidth: '1px' }
                      }
                    }}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value} sx={{ fontSize: '12px', fontFamily: fonts.sans }}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Main Full-Width Grid */}
            <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Grid item xs={6} sm={4} md={3} key={i}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Skeleton variant="rectangular" sx={{ aspectRatio: '3/4', borderRadius: 0 }} />
                        <Skeleton width="80%" height={16} />
                        <Skeleton width="50%" height={14} />
                      </Box>
                    </Grid>
                  ))
                : pageItems.map((item) => (
                    <Grid item xs={6} sm={4} md={3} key={item.id}>
                      <ProductCard
                        product={item}
                        href={`/shop/${item.id}`}
                        layout="grid"
                        sizes="(max-width:600px) 50vw, (max-width:900px) 33vw, 25vw"
                      />
                    </Grid>
                  ))}
            </Grid>

            {/* Empty State */}
            {!loading && pageItems.length === 0 && (
              <Box sx={{ py: 10, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '1.25rem', fontFamily: fonts.display, color: brand.ink, mb: 1 }}>
                  No Products Found
                </Typography>
                <Typography sx={{ color: brand.muted, fontSize: '14px', fontFamily: fonts.sans }}>
                  Try adjusting your search query or filters.
                </Typography>
              </Box>
            )}

            {/* Pagination */}
            {pageCount > 1 && (
              <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  variant="outlined"
                  shape="rounded"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 0,
                      fontFamily: fonts.sans,
                      fontSize: '12px',
                      fontWeight: 500,
                      '&.Mui-selected': {
                        bgcolor: '#111111',
                        color: '#ffffff',
                        borderColor: '#111111',
                        '&:hover': { bgcolor: '#222222' }
                      }
                    }
                  }}
                />
              </Box>
            )}
          </Box>
        </SectionContainer>
      </Box>
      <Footer />
    </>
  );
}
