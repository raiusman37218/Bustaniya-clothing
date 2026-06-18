'use client';

import { Box, useTheme, useMediaQuery } from '@mui/material';
import { ImageData } from '@/src/lib/utilits/FollowUSDataImage';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InstagramIcon from '@mui/icons-material/Instagram';
import SectionHeading from '@/src/components/ui/SectionHeading';
import SectionContainer from '@/src/components/ui/SectionContainer';
import CarouselNavButton from '@/src/components/ui/CarouselNavButton';
import { brand } from '@/src/lib/designTokens';

function FollowUs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [items, setItems] = useState<any[]>(() =>
    ImageData.map((item) => ({
      id: item.id,
      image: item.image,
      link: 'https://www.instagram.com/wear.aroha',
    }))
  );

  useEffect(() => {
    async function loadFollowImages() {
      try {
        const res = await fetch('/api/homepage');
        const data = await res.json();
        if (data && data.images) {
          const followImages = data.images.filter((img: any) => img.section === 'follow_us');
          if (followImages.length > 0) {
            setItems(
              followImages.map((img: any) => ({
                id: img.id,
                image: img.image_url,
                link: img.link_url || 'https://www.instagram.com/wear.aroha',
              }))
            );
          }
        }
      } catch (err) {
        console.error('Failed to load follow us images, using fallbacks:', err);
      }
    }
    loadFollowImages();
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <SectionContainer sx={{ pb: { xs: 4, md: 6 } }}>
      <SectionHeading
        eyebrow="Follow us on social media"
        title="Follow @wear.aroha"
        action={
          !isMobile ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <CarouselNavButton
                direction="prev"
                onClick={() => scroll('left')}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: 16, ml: 0.5 }} />
              </CarouselNavButton>
              <CarouselNavButton
                direction="next"
                onClick={() => scroll('right')}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
              </CarouselNavButton>
            </Box>
          ) : undefined
        }
      />

      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: { xs: '8px', sm: '12px', md: '16px' },
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          pb: 1,
          mx: -0.5,
          px: 0.5,
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item) => (
          <Box
            key={item.id}
            component="a"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              minWidth: { xs: '150px', sm: '200px', md: '250px' },
              maxWidth: { xs: '150px', sm: '200px', md: '250px' },
              scrollSnapAlign: 'start',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 0,
              bgcolor: brand.imageBg,
              aspectRatio: '1/1',
              display: 'block',
              '&:hover .instagram-overlay': {
                opacity: 1,
              },
              '&:hover img': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Image
              src={item.image}
              alt="Instagram post"
              fill
              sizes="(max-width: 600px) 150px, (max-width: 900px) 200px, 250px"
              style={{
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            />
            
            {/* Instagram Overlay */}
            <Box
              className="instagram-overlay"
              sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                zIndex: 2,
              }}
            >
              <InstagramIcon sx={{ color: '#ffffff', fontSize: 32 }} />
            </Box>
          </Box>
        ))}
      </Box>
    </SectionContainer>
  );
}

export default FollowUs;
