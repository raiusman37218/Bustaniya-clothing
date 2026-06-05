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

// Faint wildflower outline sketch for the left background
const WildflowerSketchLeft = () => (
  <Box
    component="svg"
    viewBox="0 0 160 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    sx={{
      position: 'absolute',
      left: { xs: '-20px', sm: '10px', md: '20px', lg: '30px' },
      bottom: 0,
      height: { xs: '35%', sm: '45%', md: '55%', lg: '65%' },
      width: 'auto',
      pointerEvents: 'none',
      zIndex: 1,
      opacity: 0.16,
    }}
  >
    {/* Beautiful Botanical Flower Stem 1 */}
    <path
      d="M30 500 C 40 420, 20 320, 50 220 C 60 180, 40 140, 50 80 C 53 60, 45 40, 48 10"
      stroke="#354531"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Leaves */}
    <path
      d="M44 320 C 20 310, 15 290, 28 285 C 38 295, 41 310, 44 320 Z"
      stroke="#354531"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M48 220 C 70 230, 75 250, 63 255 C 53 250, 50 235, 48 220 Z"
      stroke="#354531"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M50 120 C 30 110, 25 90, 38 85 C 48 95, 49 110, 50 120 Z"
      stroke="#354531"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M48 40 C 65 30, 70 15, 58 10 C 48 15, 47 30, 48 40 Z"
      stroke="#354531"
      strokeWidth="1"
      fill="none"
    />

    {/* Elegant flower sketch details at the top */}
    <circle cx="48" cy="10" r="3" stroke="#354531" strokeWidth="1" fill="none" />
    <circle cx="52" cy="7" r="2" stroke="#354531" strokeWidth="1" fill="none" />
    <circle cx="43" cy="12" r="1.5" stroke="#354531" strokeWidth="1" fill="none" />

    {/* Beautiful Botanical Flower Stem 2 */}
    <path
      d="M100 500 C 90 400, 110 300, 95 200 C 85 150, 100 100, 90 40"
      stroke="#354531"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path
      d="M98 340 C 120 330, 125 310, 113 305 C 103 310, 100 330, 98 340 Z"
      stroke="#354531"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M96 230 C 75 220, 70 200, 83 195 C 93 200, 95 215, 96 230 Z"
      stroke="#354531"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M93 120 C 115 110, 120 90, 108 85 C 98 90, 95 110, 93 120 Z"
      stroke="#354531"
      strokeWidth="1"
      fill="none"
    />
    {/* Tiny flower details at top of stem 2 */}
    <circle cx="90" cy="40" r="2.5" stroke="#354531" strokeWidth="1" fill="none" />
    <circle cx="94" cy="36" r="1.5" stroke="#354531" strokeWidth="1" fill="none" />
  </Box>
);

// Leaf branch sketch next to "SPIRIT"
const LeafTwigIcon = () => (
  <Box
    component="svg"
    viewBox="0 0 80 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    sx={{
      width: { xs: '38px', sm: '50px', md: '65px', lg: '80px' },
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
      my: { xs: 2.5, md: 4 },
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
        bgcolor: '#F5F1EB', // Elegant cream background color matching the shared screenshot
        pt: { xs: '120px', md: '160px' }, // Spacious padding-top for overlapping transparency navbar
        pb: { xs: 6, md: 0 }, // Removed bottom padding on desktop to allow the left image to touch the bottom edge
        px: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 },
        minHeight: { xs: 'auto', md: 'min(98vh, 880px)', lg: 'min(98vh, 920px)' },
        display: 'flex',
        alignItems: 'stretch', // Stretch direct child (grid) to fill the vertical height
        overflow: 'hidden',
      }}
    >
      {/* Delicate Wildflower Sketch on the far left */}
      <WildflowerSketchLeft />

      {/* Main split grid */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '1600px',
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
          gap: { xs: 5, md: 6, lg: 8, xl: 10 },
          alignItems: 'stretch', // Stretch children (left column card and right column content)
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Left Column: Vertical Image Carousel Card */}
        <Box
          sx={{
            gridColumn: { xs: 'span 12', md: 'span 6', lg: 'span 6' }, // Increased size to 50% split for a bolder presence
            position: 'relative',
            width: '100%',
            aspectRatio: { xs: '4/5', sm: '3/4', md: 'auto' }, // Auto ratio on desktop so it stretches vertically
            height: { xs: 'auto', md: '100%' }, // Let it span the full stretched height of the hero section
            minHeight: { md: '600px', lg: '680px' },
            borderRadius: '0px', // Straight edge for a high-end, premium editorial layout
            overflow: 'hidden',
            boxShadow: 'none', // Removed shadow so it integrates seamlessly with the page flow
            border: 'none', // Removed border to blend in without separate borders
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
                  objectFit: 'cover',
                  objectPosition: 'center center',
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
              bgcolor: 'rgba(245, 241, 235, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(53, 69, 49, 0.15)',
              width: 44,
              height: 44,
              opacity: { xs: 1, md: 0 },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#354531',
                color: '#F5F1EB',
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
              bgcolor: 'rgba(245, 241, 235, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(53, 69, 49, 0.15)',
              width: 44,
              height: 44,
              opacity: { xs: 1, md: 0 },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#354531',
                color: '#F5F1EB',
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
            py: { xs: 6, md: 10 }, // Increased vertical padding to maintain balanced breathing room on desktop
            pl: { md: 3, lg: 6, xl: 8 },
            pr: { md: 2, lg: 4 },
          }}
        >
          {/* Main Title Heading */}
          <Box>
            <Typography
              component="h1"
              sx={{
                fontFamily: fonts.display,
                fontSize: { xs: '3.2rem', sm: '4.2rem', md: '5.2rem', lg: '6.2rem', xl: '6.8rem' },
                fontWeight: 300,
                color: '#354531', // Deep forest/olive green matching screenshot
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
              fontSize: { xs: '11px', sm: '12px', md: '13px' },
              fontWeight: 500,
              color: '#5A6D57',
              letterSpacing: '0.22em',
              lineHeight: 1.8,
              textTransform: 'uppercase',
              mb: 5,
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
              fontSize: '13px',
              fontWeight: 600,
              color: '#354531',
              bgcolor: 'transparent',
              border: '1px solid #354531',
              borderRadius: '0px',
              px: { xs: 4, md: 5.5 },
              py: { xs: 1.5, md: 1.875 },
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              '&:hover': {
                bgcolor: '#354531',
                color: '#F5F1EB',
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

