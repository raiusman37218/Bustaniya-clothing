'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/pagination';
import 'swiper/css';
import SectionHeading from '@/src/components/ui/SectionHeading';
import SectionContainer from '@/src/components/ui/SectionContainer';
import MediaFrame, {
  mediaFrameImageClass,
  mediaFrameImageStyle,
} from '@/src/components/ui/MediaFrame';
import { brand, fonts } from '@/src/lib/designTokens';

const ImageWeek = [
  { imageSrc: '/Week1.png', imageWeek: 'Monday' },
  { imageSrc: '/Week2.png', imageWeek: 'Tuesday' },
  { imageSrc: '/Week3.png', imageWeek: 'Wednesday' },
  { imageSrc: '/Week4.png', imageWeek: 'Thursday' },
  { imageSrc: '/Week5.png', imageWeek: 'Friday' },
  { imageSrc: '/Week6.png', imageWeek: 'Saturday' },
  { imageSrc: '/Week7.png', imageWeek: 'Sunday' },
];

function MoodiWeek() {
  const [items, setItems] = useState(ImageWeek);

  useEffect(() => {
    async function loadMoodImages() {
      try {
        const res = await fetch('/api/homepage');
        const data = await res.json();
        if (data && data.images) {
          const moodImages = data.images.filter((img: any) => img.section === 'mood_week');
          if (moodImages.length > 0) {
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            setItems(
              moodImages.map((img: any, idx: number) => ({
                imageSrc: img.image_url,
                imageWeek: img.alt_text || days[idx % 7],
              }))
            );
          }
        }
      } catch (err) {
        console.error('Failed to load mood of the week images, using fallbacks:', err);
      }
    }
    loadMoodImages();
  }, []);

  return (
    <SectionContainer>
      <SectionHeading
        eyebrow="Style diary"
        title="Bustaniya week"
        subtitle="A shalwar kameez look for every day — inspiration from our studio."
      />

      <Swiper
        className="bustaniya-swiper"
        spaceBetween={18}
        breakpoints={{
          0: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        autoplay={{
          delay: 3200,
          disableOnInteraction: false,
        }}
        loop
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
      >
        {items.map((items) => (
          <SwiperSlide key={items.imageWeek}>
            <MediaFrame aspectRatio="3/4">
              <Image
                src={items.imageSrc}
                alt={`Bustaniya week — ${items.imageWeek} shalwar kameez`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={mediaFrameImageClass}
                style={mediaFrameImageStyle}
              />
            </MediaFrame>
            <Typography
              sx={{
                pt: 1.25,
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: brand.muted,
                fontFamily: fonts.sans,
              }}
            >
              {items.imageWeek}
            </Typography>
          </SwiperSlide>
        ))}
      </Swiper>
    </SectionContainer>
  );
}

export default MoodiWeek;
