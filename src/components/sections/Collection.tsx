'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Grid, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ImagesMansory } from '@/src/lib/utilits/ImageData';
import SectionHeading from '@/src/components/ui/SectionHeading';
import SectionContainer from '@/src/components/ui/SectionContainer';
import { brand, fonts } from '@/src/lib/designTokens';

const COLLECTION_NAMES = [
  'Kurti',
  'Freshi Shalwar',
  'Full Dress',
  'Customized Dress',
];

function Collection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [items, setItems] = useState<any[]>(ImagesMansory);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function loadCollectionImages() {
      try {
        const res = await fetch('/api/homepage');
        const data = await res.json();
        if (data && data.images) {
          const collectionImages = data.images.filter((img: any) => img.section === 'collection');
          if (collectionImages.length > 0) {
            setItems(
              collectionImages.map((img: any, idx: number) => ({
                src: img.image_url,
                name: COLLECTION_NAMES[idx % COLLECTION_NAMES.length],
                id: img.id,
                link: img.link_url || '/shop',
              }))
            );
          }
        }
      } catch (err) {
        console.error('Failed to load collection images, using fallbacks:', err);
      }
    }
    loadCollectionImages();
  }, []);

  const activeItem = items[activeIndex] || items[0] || {};

  return (
    <SectionContainer sx={{ py: { xs: 4, md: 8 } }}>
      {isMobile ? (
        // MOBILE LAYOUT: Clean horizontal scroll of cards
        <Box>
          <SectionHeading
            eyebrow="Curated looks"
            title="The collection"
            align="center"
          />
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              pb: 2,
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {items.slice(0, 4).map((item) => (
              <Box
                key={item.id}
                component={Link}
                href={item.link || '/shop'}
                sx={{
                  minWidth: '240px',
                  width: '240px',
                  scrollSnapAlign: 'start',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '3/4',
                    bgcolor: brand.imageBg,
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    sizes="240px"
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                <Box sx={{ pt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: brand.ink,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {item.name}
                  </Typography>
                  <ArrowForwardIcon sx={{ fontSize: 16, color: brand.muted }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        // DESKTOP LAYOUT: High-End Split-Screen Interactive Menu
        <Grid container spacing={8} alignItems="center">
          {/* Left Side: Editorial Typography Menu List */}
          <Grid item xs={12} md={7}>
            <Box sx={{ pl: { lg: 4 } }}>
              {/* Section Header */}
              <Box sx={{ mb: 6 }}>
                <Typography
                  sx={{
                    fontSize: '12px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: brand.muted,
                    fontWeight: 500,
                    fontFamily: fonts.sans,
                    mb: 1.5,
                  }}
                >
                  Curated looks
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: '2.75rem',
                    fontWeight: 400,
                    letterSpacing: '0.03em',
                    lineHeight: 1.15,
                    color: brand.ink,
                    fontFamily: fonts.display,
                    textTransform: 'uppercase',
                  }}
                >
                  The collection
                </Typography>
              </Box>

              {/* Menu Items */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {items.slice(0, 4).map((item, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <Box
                      key={item.id}
                      onMouseEnter={() => setActiveIndex(idx)}
                      component={Link}
                      href={item.link || '/shop'}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 3.5,
                        borderBottom: `1px solid ${brand.border}`,
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        '&:first-of-type': {
                          borderTop: `1px solid ${brand.border}`,
                        },
                      }}
                    >
                      {/* Number Indicator */}
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontSize: '12px',
                          fontWeight: 500,
                          color: isActive ? brand.ink : brand.muted,
                          letterSpacing: '0.15em',
                          mr: 4,
                          width: '32px',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        0{idx + 1}
                      </Typography>

                      {/* Collection Name */}
                      <Typography
                        sx={{
                          fontFamily: fonts.display,
                          fontSize: '2.25rem',
                          fontWeight: isActive ? 400 : 300,
                          color: isActive ? brand.ink : 'rgba(17, 17, 17, 0.45)',
                          letterSpacing: '0.02em',
                          textTransform: 'uppercase',
                          flexGrow: 1,
                          transition: 'all 0.3s ease',
                          transform: isActive ? 'translateX(8px)' : 'translateX(0)',
                        }}
                      >
                        {item.name}
                      </Typography>

                      {/* Hover Arrow Link indicator */}
                      <Box
                        sx={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? 'translateX(0)' : 'translateX(-10px)',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: fonts.sans,
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: brand.ink,
                          }}
                        >
                          Explore
                        </Typography>
                        <ArrowForwardIcon sx={{ fontSize: 16, color: brand.ink }} />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Grid>

          {/* Right Side: Interactive Image Preview Box */}
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component={Link}
              href={activeItem.link || '/shop'}
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: '420px',
                aspectRatio: '3/4',
                overflow: 'hidden',
                bgcolor: brand.imageBg,
                transition: 'all 0.3s ease',
                '&:hover img': {
                  transform: 'scale(1.03)',
                },
                '&:hover .coll-shop-btn': {
                  bgcolor: brand.white,
                  color: brand.ink,
                  borderColor: brand.white,
                },
              }}
            >
              {items.slice(0, 4).map((item, idx) => (
                <Box
                  key={item.id}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: activeIndex === idx ? 1 : 0,
                    zIndex: activeIndex === idx ? 1 : 0,
                    transition: 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    sizes="420px"
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.8s ease',
                    }}
                  />
                </Box>
              ))}

              {/* Centered Discover Button on Hover */}
              <Box
                className="coll-shop-btn"
                sx={{
                  position: 'absolute',
                  bottom: '2rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 2,
                  bgcolor: '#111111',
                  color: '#ffffff',
                  border: '1px solid #111111',
                  px: 4,
                  py: 1.5,
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: fonts.sans,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s ease',
                }}
              >
                Discover Collection
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </SectionContainer>
  );
}

export default Collection;
