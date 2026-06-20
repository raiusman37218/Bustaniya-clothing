'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { PAKISTANI_FASHION } from '@/src/data/pakistaniFashionImages';
import { fonts } from '@/src/lib/designTokens';

const HERO_SLIDES = PAKISTANI_FASHION.heroSlides;
const AUTO_PLAY_INTERVAL = 6000; // 6 seconds for a relaxed feel



// Leaf branch sketch next to "SPIRIT"
const LeafTwigIcon = () => (
  <Box
    component="svg"
    viewBox="0 0 80 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    sx={{
      width: { xs: '26px', sm: '32px', md: '40px', lg: '45px' },
      height: 'auto',
      display: 'inline-block',
      verticalAlign: 'middle',
      ml: { xs: 1, sm: 1.5, md: 2 },
      transform: 'rotate(5deg)',
      opacity: 0.9,
    }}
  >
    {/* Main Stem */}
    <path
      d="M5 42 C 20 34, 42 24, 72 15"
      stroke="#354531"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Leaves */}
    <path
      d="M18 34 C 16 23, 26 16, 30 22 C 32 27, 26 32, 18 34 Z"
      fill="#354531"
    />
    <path
      d="M32 28 C 32 16, 44 12, 46 18 C 46 24, 40 27, 32 28 Z"
      fill="#354531"
    />
    <path
      d="M47 22 C 49 10, 60 8, 61 14 C 60 20, 54 21, 47 22 Z"
      fill="#354531"
    />
    <path
      d="M63 16 C 67 7, 74 9, 73 13 C 70 16, 67 16, 63 16 Z"
      fill="#354531"
    />
    {/* Opposite side leaves */}
    <path
      d="M23 36 C 28 44, 40 43, 38 36 C 34 32, 27 33, 23 36 Z"
      fill="#354531"
    />
    <path
      d="M41 28 C 48 36, 58 32, 54 26 C 48 23, 44 25, 41 28 Z"
      fill="#354531"
    />
  </Box>
);

// Diamond Line Divider
const DividerWithDiamond = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: { xs: '180px', sm: '240px', md: '300px' },
      my: { xs: 1.5, md: 2 },
    }}
  >
    <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'rgba(53, 69, 49, 0.25)' }} />
    <Box
      sx={{
        mx: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="span"
        sx={{
          width: 7,
          height: 7,
          bgcolor: '#354531',
          transform: 'rotate(45deg)',
          display: 'block',
        }}
      />
    </Box>
    <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'rgba(53, 69, 49, 0.25)' }} />
  </Box>
);

function HeroSection() {
  const [index, setIndex] = useState(0);
  const slideCount = HERO_SLIDES.length;

  const go = useCallback(
    (direction: 'prev' | 'next') => {
      setIndex((current) => {
        if (direction === 'next') {
          return (current + 1) % slideCount;
        }
        return (current - 1 + slideCount) % slideCount;
      });
    },
    [slideCount],
  );

  // Autoplay functionality
  useEffect(() => {
    const timer = setInterval(() => {
      go('next');
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [go]);

  return (
    <Box
      position="relative"
      width="100%"
      sx={{
        background: `
          repeating-linear-gradient(0deg, rgba(53, 69, 49, 0.012) 0px, rgba(53, 69, 49, 0.012) 1px, transparent 1px, transparent 4px),
          repeating-linear-gradient(90deg, rgba(53, 69, 49, 0.012) 0px, rgba(53, 69, 49, 0.012) 1px, transparent 1px, transparent 4px),
          radial-gradient(circle at 25% 50%, #cbf598 0%, #bbe983 55%, #b2e079 100%)
        `, // Premium organic linen fabric texture layered over a studio spotlight gradient
        backgroundBlendMode: 'multiply',
        borderBottom: '1px solid rgba(53, 69, 49, 0.15)', // Fine editorial divider
        pt: 0, // Directly attach to navbar edge-to-edge
        pb: 0,
        px: { xs: 2, sm: 4, md: 6, lg: 8 },
        minHeight: { xs: '280px', sm: '340px', md: '380px', lg: '400px' }, // Short and professional like generation.com.pk
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
    >

      {/* Main split grid */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '1600px',
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
          gap: { xs: 2, md: 0 }, // 0 gap on desktop to allow perfectly centered vertical divider
          alignItems: 'stretch',
          position: 'relative',
          zIndex: 2,
          borderLeft: { md: '1px solid rgba(53, 69, 49, 0.12)' }, // Left catalog line
          borderRight: { md: '1px solid rgba(53, 69, 49, 0.12)' }, // Right catalog line
          px: { md: 4, lg: 5 },
        }}
      >
        {/* Left Column: Vertical Image Carousel Card */}
        <Box
          sx={{
            gridColumn: { xs: 'span 12', md: 'span 6', lg: 'span 6' },
            position: 'relative',
            width: '100%',
            aspectRatio: { xs: '4/5', sm: '3/4', md: 'auto' },
            height: { xs: 'auto', md: '100%' },
            minHeight: { md: '320px', lg: '350px' }, // Shorter minHeight for compact layout
            borderRadius: '0px',
            overflow: 'hidden',
            boxShadow: 'none',
            border: 'none',
            borderRight: { md: '1px solid rgba(53, 69, 49, 0.12)' }, // Center magazine divider line
            pr: { md: 4, lg: 6 }, // Push images away from the divider line for breathing room
            '&:hover .carousel-btn': {
              opacity: 1,
            },
          }}
        >
          {/* Slides */}
          {HERO_SLIDES.map((slide, i) => (
            <Box
              key={slide.src}
              sx={{
                position: 'absolute',
                inset: 0,
                opacity: i === index ? 1 : 0,
                transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: i === index ? 'auto' : 'none',
                zIndex: i === index ? 1 : 0,
              }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 900px) 100vw, 40vw"
                style={{
                  objectFit: 'contain',
                  objectPosition: 'bottom center', // Align model image to the bottom so it sits on the base
                }}
                quality={95}
                priority={i === 0}
              />
            </Box>
          ))}

          {/* Clean Carousel Navigation Arrows (visible on hover) */}
          <IconButton
            onClick={() => go('prev')}
            aria-label="Previous slide"
            className="carousel-btn"
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              color: '#354531',
              bgcolor: 'rgba(255, 255, 255, 0.85)', // Glassy white background
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(53, 69, 49, 0.15)',
              width: 44,
              height: 44,
              opacity: { xs: 1, md: 0 },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#354531',
                color: '#bbe983', // Match sage background
                borderColor: '#354531',
                transform: 'translateY(-50%) scale(1.05)',
              },
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 16, ml: 0.5 }} />
          </IconButton>

          <IconButton
            onClick={() => go('next')}
            aria-label="Next slide"
            className="carousel-btn"
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              color: '#354531',
              bgcolor: 'rgba(255, 255, 255, 0.85)', // Glassy white background
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(53, 69, 49, 0.15)',
              width: 44,
              height: 44,
              opacity: { xs: 1, md: 0 },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#354531',
                color: '#bbe983', // Match sage background
                borderColor: '#354531',
                transform: 'translateY(-50%) scale(1.05)',
              },
            }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
          </IconButton>

          {/* Minimal Bottom Indicators */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1.25,
              zIndex: 3,
            }}
          >
            {HERO_SLIDES.map((_, i) => (
              <Box
                key={i}
                onClick={() => setIndex(i)}
                role="button"
                tabIndex={0}
                aria-label={`Go to slide ${i + 1}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setIndex(i);
                }}
                sx={{
                  width: i === index ? 24 : 8,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: i === index ? '#354531' : 'rgba(53, 69, 49, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: '#354531',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Right Column: Premium Text Heading & CTA */}
        <Box
          sx={{
            gridColumn: { xs: 'span 12', md: 'span 6', lg: 'span 6' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            py: { xs: 3, md: 4 }, // Highly compact vertical padding
            pl: { md: 4, lg: 6, xl: 8 }, // Balanced padding to clear the center line divider
            pr: { md: 2, lg: 3 },
          }}
        >
          {/* Main Title Heading */}
          <Box>
            <Typography
              component="h1"
              sx={{
                fontFamily: fonts.display,
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem', lg: '3.8rem', xl: '4.2rem' }, // Refined and scaled down for compact professional look
                fontWeight: 300,
                color: '#354531',
                lineHeight: { xs: 1.1, md: 0.95 },
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                mb: 0.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box component="span" sx={{ display: 'block' }}>
                NATURAL
              </Box>
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                SPIRIT
                <LeafTwigIcon />
              </Box>
            </Typography>
          </Box>

          {/* Diamond Line Divider */}
          <DividerWithDiamond />

          {/* Subheading Description */}
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: { xs: '10px', sm: '11px', md: '12px' }, // Slightly smaller for elegant look
              fontWeight: 500,
              color: '#5A6D57',
              letterSpacing: '0.22em',
              lineHeight: 1.8,
              textTransform: 'uppercase',
              mb: { xs: 2.5, md: 3 }, // Reduced margin
            }}
          >
            INSPIRED BY NATURE.
            <br />
            MADE FOR YOU.
          </Typography>

          {/* Elegant SHOP Button */}
          <Button
            href="/shop"
            sx={{
              fontFamily: fonts.sans,
              fontSize: '12px', // Refined sizing
              fontWeight: 600,
              color: '#354531',
              bgcolor: 'transparent',
              border: '1px solid #354531',
              borderRadius: '0px',
              px: { xs: 3, md: 4.5 }, // More compact button padding
              py: { xs: 1.2, md: 1.4 },
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              '&:hover': {
                bgcolor: '#354531',
                color: '#bbe983', // Match sage background
                borderColor: '#354531',
                '& .btn-arrow': {
                  transform: 'translateX(6px)',
                },
              },
            }}
          >
            SHOP NEW IN
            <Box
              component="span"
              className="btn-arrow"
              sx={{
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'inline-block',
                fontSize: '18px',
                lineHeight: 1,
              }}
            >
              →
            </Box>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default HeroSection;
