'use client';

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import Image from 'next/image';
import Link from 'next/link';
import { ImagesMansory } from '@/src/lib/utilits/ImageData';
import SectionHeading from '@/src/components/ui/SectionHeading';
import SectionContainer from '@/src/components/ui/SectionContainer';
import MediaFrame, {
  mediaFrameImageClass,
  mediaFrameImageStyle,
} from '@/src/components/ui/MediaFrame';
import { brand, fonts, radius } from '@/src/lib/designTokens';

function Collection() {
  const [items, setItems] = useState<any[]>(ImagesMansory);

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
                height: [400, 520, 480, 360][idx % 4] ?? 400,
                name: img.alt_text || 'Shop',
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

  return (
    <SectionContainer>
      <SectionHeading
        eyebrow="Curated looks"
        title="The collection"
        subtitle="Explore mood boards and shop the edit — from occasion wear to everyday ease."
      />

      <Masonry
        columns={{ xs: 1, sm: 2 }}
        spacing={{ xs: 2, md: 2.5 }}
        defaultHeight={450}
        defaultColumns={2}
        sx={{
          width: 'auto',
          '& .MuiBox-root': { breakInside: 'avoid' },
        }}
      >
        {items.map((item) => (
          <Link key={item.id} href={item.link || '/shop'} style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                '&:hover .coll-cta': {
                  bgcolor: brand.ink,
                  color: brand.white,
                },
              }}
            >
            <MediaFrame
              aspectRatio={`500 / ${item.height}`}
              hoverScale
              gradient="bottom"
              sx={{ mb: { xs: 0, md: 0 } }}
            >
              <Image
                src={item.src}
                alt={item.name}
                fill
                className={mediaFrameImageClass}
                sizes="(max-width: 600px) 100vw, 50vw"
                style={mediaFrameImageStyle}
              />
              <Box
                className="coll-cta"
                sx={{
                  position: 'absolute',
                  bottom: { xs: '1.25rem', md: '1.75rem' },
                  left: { xs: '1.25rem', md: '1.75rem' },
                  zIndex: 2,
                  bgcolor: brand.white,
                  color: brand.ink,
                  px: 2.5,
                  py: 1,
                  borderRadius: radius.button,
                  transition:
                    'background-color 0.3s ease, color 0.3s ease',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 600,
                    fontFamily: fonts.sans,
                    letterSpacing: '0.04em',
                    textTransform: 'capitalize',
                  }}
                >
                  {item.name}
                </Typography>
              </Box>
            </MediaFrame>
            </Box>
          </Link>
        ))}
      </Masonry>
    </SectionContainer>
  );
}

export default Collection;
