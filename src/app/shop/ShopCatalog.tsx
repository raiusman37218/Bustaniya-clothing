'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/src/components/ui/ProductCard';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Grid,
  Skeleton,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Stack,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import BannerHeader from '@/src/components/headers/BannerHeader';
import NavBar from '@/src/components/layout/NavBar';
import Footer from '@/src/components/layout/Footer';
import SectionContainer from '@/src/components/ui/SectionContainer';
import SectionHeading from '@/src/components/ui/SectionHeading';
import UseProductsReturn from '@/src/hooks/UseProductsReturn';
import type { Product } from '@/src/types/productTypes';
import { brand, sectionSpacing, shadows } from '@/src/lib/designTokens';

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
  { value: 'new', label: 'New' },
  { value: 'price-asc', label: 'Price: Low - High' },
  { value: 'popular', label: 'Popular' },
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
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('new');
  const [page, setPage] = useState(1);
  const products = items ?? [];

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSelectedSub(initialSub);
  }, [initialSub]);

  const colorOptions = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((product) =>
      product.product_color.forEach((color) => colors.add(color.name)),
    );
    return Array.from(colors).sort();
  }, [products]);

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    products.forEach((product) =>
      product.product_color.forEach((color) => {
        map[color.name] = color.hex || color.currentColor || '#cccccc';
      }),
    );
    return map;
  }, [products]);

  const sizeOptions = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((product) => product.product_size.forEach((size) => sizes.add(size)));
    return Array.from(sizes).sort((a, b) => (a.length === b.length ? a.localeCompare(b) : a.length - b.length));
  }, [products]);

  const priceRange = useMemo(() => {
    const values = products.map((product) => Number(product.procuct_price) || 0);
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 20000);
    return [min, max] as [number, number];
  }, [products]);

  const [selectedPrice, setSelectedPrice] = useState<[number, number]>(priceRange);

  useEffect(() => {
    if (priceRange[0] !== selectedPrice[0] || priceRange[1] !== selectedPrice[1]) {
      setSelectedPrice(priceRange);
    }
  }, [priceRange]);

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

    if (selectedColors.length > 0) {
      list = list.filter((product) =>
        product.product_color.some((color) => selectedColors.includes(color.name)),
      );
    }

    if (selectedSizes.length > 0) {
      list = list.filter((product) =>
        product.product_size.some((size) => selectedSizes.includes(size)),
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
  }, [products, selectedCategory, selectedSub, q, selectedColors, selectedSizes, selectedPrice, sortBy]);

  const itemsPerPage = 12;
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const pageItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleToggleColor = (color: string) => {
    setPage(1);
    setSelectedColors((current) =>
      current.includes(color)
        ? current.filter((item) => item !== color)
        : [...current, color],
    );
  };

  const handleToggleSize = (size: string) => {
    setPage(1);
    setSelectedSizes((current) =>
      current.includes(size)
        ? current.filter((item) => item !== size)
        : [...current, size],
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedSub('all');
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedPrice(priceRange);
    setSortBy('new');
    setPage(1);
  };

  const pageTitle = selectedCategory && selectedCategory !== 'all'
    ? CATEGORY_LABELS[selectedCategory] ?? selectedCategory
    : 'All Products';

  const subCats = SUB_CATEGORIES[selectedCategory] || [];

  return (
    <>
      <BannerHeader />
      <NavBar />
      <Box component="main" sx={{ bgcolor: brand.surface, minHeight: '100vh' }}>
        <Box sx={{ bgcolor: brand.surface }}>
          <SectionContainer sx={{ py: sectionSpacing.py }}>
            
            {/* Header section inspired by Limelight */}
            <Box sx={{ mb: { xs: 4, md: 5 }, maxWidth: 960 }}>
              <SectionHeading
                eyebrow="Bustaniya Collection"
                title={pageTitle}
                subtitle={`Explore the refined ${pageTitle.toLowerCase()} collection with Limelight-inspired premium styling and seamless subcategories.`}
                align="left"
              />
            </Box>

            {/* Horizontal Subcategory Bar (Limelight-Style Navigation) */}
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                overflowX: 'auto',
                pb: 2.5,
                mb: 4.5,
                borderBottom: '1px solid #eef0ed',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none', // Hide Firefox scrollbar
                '&::-webkit-scrollbar': { display: 'none' }, // Hide Chrome/Safari scrollbar
              }}
            >
              {selectedCategory === 'all'
                ? MAIN_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.value;
                    return (
                      <Button
                        key={cat.value}
                        variant="outlined"
                        onClick={() => {
                          setPage(1);
                          setSelectedCategory(cat.value);
                          setSelectedSub('all');
                        }}
                        sx={{
                          flexShrink: 0,
                          px: 3.5,
                          py: 1,
                          borderRadius: '100px',
                          textTransform: 'uppercase',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          fontFamily: "'Inter', sans-serif",
                          bgcolor: isSelected ? '#111111' : 'transparent',
                          color: isSelected ? '#ffffff' : '#555555',
                          borderColor: isSelected ? '#111111' : '#e0e0e0',
                          '&:hover': {
                            bgcolor: isSelected ? '#111111' : '#f5f5f5',
                            borderColor: '#111111',
                            color: isSelected ? '#ffffff' : '#111111',
                          },
                        }}
                      >
                        {cat.label}
                      </Button>
                    );
                  })
                : subCats.map((sub) => {
                    const isSelected = selectedSub === sub.value;
                    return (
                      <Button
                        key={sub.value}
                        variant="outlined"
                        onClick={() => {
                          setPage(1);
                          setSelectedSub(sub.value);
                        }}
                        sx={{
                          flexShrink: 0,
                          px: 3.5,
                          py: 1,
                          borderRadius: '100px',
                          textTransform: 'uppercase',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          fontFamily: "'Inter', sans-serif",
                          bgcolor: isSelected ? '#111111' : 'transparent',
                          color: isSelected ? '#ffffff' : '#555555',
                          borderColor: isSelected ? '#111111' : '#e0e0e0',
                          '&:hover': {
                            bgcolor: isSelected ? '#111111' : '#f5f5f5',
                            borderColor: '#111111',
                            color: isSelected ? '#ffffff' : '#111111',
                          },
                        }}
                      >
                        {sub.label}
                      </Button>
                    );
                  })}
              {selectedCategory !== 'all' && (
                <Button
                  variant="text"
                  onClick={() => {
                    setPage(1);
                    setSelectedCategory('all');
                    setSelectedSub('all');
                  }}
                  sx={{
                    flexShrink: 0,
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: brand.muted,
                    '&:hover': { color: '#111' }
                  }}
                >
                  ← Back to All
                </Button>
              )}
            </Box>

            <Box sx={{ bgcolor: brand.white, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #f2f2f2', p: { xs: 2, md: 4 }, mb: 4 }}>
              
              {/* Search Bar */}
              <Box
                component="form"
                action="/shop"
                method="GET"
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
                  alignItems: 'center',
                  mb: 4,
                }}
              >
                <TextField
                  name="q"
                  defaultValue={qRaw}
                  placeholder="Search products by name…"
                  fullWidth
                  size="small"
                  sx={{
                    bgcolor: '#fafafa',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '4px',
                      '& fieldset': { borderColor: '#e5e5e5' },
                      '&:hover fieldset': { borderColor: '#b5b5b5' },
                      '&.Mui-focused fieldset': { borderColor: '#111111', borderWidth: '1px' },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#999', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  sx={{
                    bgcolor: '#111111',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    fontSize: '12px',
                    px: { xs: 3, md: 4 },
                    borderRadius: '4px',
                    '&:hover': { bgcolor: '#2a2a2a' },
                    height: { xs: 40, md: 40 },
                  }}
                >
                  Search
                </Button>
              </Box>

              <Grid container spacing={4}>
                
                {/* Left Sidebar Filter Section (Limelight Style) */}
                <Grid item xs={12} lg={3}>
                  <Box sx={{ pr: { lg: 2 } }}>
                    
                    <Box sx={{ pb: 2, mb: 1, borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#111' }}>
                        Filters
                      </Typography>
                      <Button
                        onClick={handleClearFilters}
                        sx={{
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          color: '#777',
                          p: 0,
                          minWidth: 0,
                          '&:hover': { color: '#111', bgcolor: 'transparent' }
                        }}
                      >
                        Reset All
                      </Button>
                    </Box>

                    {/* Category Accordion */}
                    <Accordion disableGutters elevation={0} defaultExpanded sx={{ bgcolor: 'transparent', '&::before': { display: 'none' } }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />} sx={{ px: 0, py: 1 }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#111' }}>
                          Category
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 0, py: 1 }}>
                        <Stack spacing={1.25}>
                          {MAIN_CATEGORIES.map((cat) => {
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
                                  display: 'flex',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                  transition: 'color 0.2s',
                                  color: isSelected ? '#111111' : '#666666',
                                  '&:hover': { color: '#111111' },
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    mr: 1.5,
                                    bgcolor: isSelected ? '#111111' : 'transparent',
                                    border: isSelected ? 'none' : '1px solid #ccc',
                                  }}
                                />
                                <Typography sx={{ fontSize: '13px', fontWeight: isSelected ? 700 : 500 }}>
                                  {cat.label}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>

                    {/* Price Slider Accordion */}
                    <Accordion disableGutters elevation={0} defaultExpanded sx={{ bgcolor: 'transparent', '&::before': { display: 'none' } }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />} sx={{ px: 0, py: 1 }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#111' }}>
                          Price Range
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 0, py: 1 }}>
                        <Box sx={{ px: 1 }}>
                          <Slider
                            value={selectedPrice}
                            onChange={(_, value) => {
                              setPage(1);
                              setSelectedPrice(value as [number, number]);
                            }}
                            valueLabelDisplay="auto"
                            min={priceRange[0]}
                            max={priceRange[1]}
                            sx={{
                              color: '#111111',
                              '& .MuiSlider-thumb': {
                                width: 14,
                                height: 14,
                                backgroundColor: '#111111',
                                '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 6px rgba(0,0,0,0.1)' }
                              },
                              '& .MuiSlider-rail': { opacity: 0.2, color: '#999' }
                            }}
                          />
                          <Typography sx={{ color: '#555', fontSize: '12px', fontWeight: 600, mt: 1 }}>
                            Rs. {selectedPrice[0]} - Rs. {selectedPrice[1]}
                          </Typography>
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    {/* Size Accordion (Square Box Grid) */}
                    <Accordion disableGutters elevation={0} defaultExpanded sx={{ bgcolor: 'transparent', '&::before': { display: 'none' } }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />} sx={{ px: 0, py: 1 }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#111' }}>
                          Size
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 0, py: 1 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {sizeOptions.map((size) => {
                            const isSelected = selectedSizes.includes(size);
                            return (
                              <Box
                                key={size}
                                onClick={() => handleToggleSize(size)}
                                sx={{
                                  width: 36,
                                  height: 36,
                                  border: isSelected ? '1px solid #111111' : '1px solid #e0e0e0',
                                  bgcolor: isSelected ? '#111111' : 'transparent',
                                  color: isSelected ? '#ffffff' : '#333333',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                  fontSize: '11px',
                                  fontFamily: "'Inter', sans-serif",
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    borderColor: '#111111',
                                    color: isSelected ? '#ffffff' : '#111111',
                                  }
                                }}
                              >
                                {size}
                              </Box>
                            );
                          })}
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                  </Box>
                </Grid>

                {/* Right Side Product Grid */}
                <Grid item xs={12} lg={9}>
                  <Box sx={{ mb: 3.5, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 500, fontSize: '13.5px' }}>
                      Showing {filteredItems.length} {filteredItems.length === 1 ? 'product' : 'products'}
                      {q ? ` for “${qRaw.trim()}”` : ''}
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                      <InputLabel sx={{ fontSize: '13px', '&.Mui-focused': { color: '#111' } }}>Sort by</InputLabel>
                      <Select
                        value={sortBy}
                        label="Sort by"
                        onChange={(event) => {
                          setSortBy(event.target.value);
                          setPage(1);
                        }}
                        sx={{
                          fontSize: '13px',
                          '&.MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': { borderColor: '#111' }
                          }
                        }}
                      >
                        {SORT_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '13px' }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                    {loading
                      ? Array.from({ length: 8 }).map((_, i) => (
                          <Grid item xs={6} sm={4} md={4} key={i}>
                            <Skeleton variant="rectangular" sx={{ aspectRatio: '4/5', borderRadius: '2px' }} />
                            <Skeleton width="75%" sx={{ mt: 1.5, height: 18 }} />
                            <Skeleton width="45%" sx={{ height: 16 }} />
                          </Grid>
                        ))
                      : pageItems.map((item) => (
                          <Grid item xs={6} sm={4} md={4} key={item.id}>
                            <ProductCard
                              product={item}
                              href={`/shop/${item.id}`}
                              layout="grid"
                              sizes="(max-width:600px) 50vw, 30vw"
                            />
                          </Grid>
                        ))}
                  </Grid>

                  {pageCount > 1 && (
                    <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                      <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        variant="outlined"
                        shape="rounded"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            borderRadius: '2px',
                            '&.Mui-selected': {
                              bgcolor: '#111111',
                              color: '#ffffff',
                              borderColor: '#111111',
                              '&:hover': { bgcolor: '#2a2a2a' }
                            }
                          }
                        }}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          </SectionContainer>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
