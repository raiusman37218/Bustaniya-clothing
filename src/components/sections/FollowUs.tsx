'use client';

import { Box, IconButton, Typography, Avatar } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { ImageData } from '@/src/lib/utilits/FollowUSDataImage';
import Image from 'next/image';
import { useState, useRef } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SectionHeading from '@/src/components/ui/SectionHeading';
import SectionContainer from '@/src/components/ui/SectionContainer';
import CarouselNavButton from '@/src/components/ui/CarouselNavButton';
import MediaFrame, {
  mediaFrameImageClass,
  mediaFrameImageStyle,
} from '@/src/components/ui/MediaFrame';
import { brand, fonts, radius, shadows } from '@/src/lib/designTokens';

function FollowUs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [likedItems, setLikedItems] = useState<Record<number, boolean>>(
    ImageData.reduce(
      (acc, item) => ({ ...acc, [item.id]: item.liked }),
      {} as Record<number, boolean>,
    ),
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleLike = (id: number) => {
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  const getInitials = (username: string) => username.charAt(0).toUpperCase();

  const getAvatarColor = (id: number) => {
    const colors = ['#E8B4B8', '#B8D4E3', '#D4C5A9', '#A9C5B7', '#C5B8D4', '#D4B8A9'];
    return colors[(id - 1) % colors.length];
  };

  return (
    <SectionContainer sx={{ pb: { xs: 2, md: 0 } }}>
      <SectionHeading
        eyebrow="Community"
        title="Follow @bustaniya"
        subtitle="Style inspiration, behind-the-scenes, and shoppable moments from our feed."
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
          gap: { xs: '14px', sm: '18px', md: '20px' },
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          pb: 2,
          mx: -0.5,
          px: 0.5,
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {ImageData.map((item) => (
          <Box
            key={item.id}
            sx={{
              minWidth: { xs: '260px', sm: '280px', md: '290px' },
              maxWidth: { xs: '260px', sm: '280px', md: '290px' },
              scrollSnapAlign: 'start',
              borderRadius: radius.editorial,
              overflow: 'hidden',
              backgroundColor: brand.white,
              border: `1px solid ${brand.border}`,
              boxShadow: shadows.card,
              transition: 'box-shadow 0.35s ease, transform 0.35s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: shadows.cardHover,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                px: 2,
                py: 1.5,
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: 14,
                  fontWeight: 700,
                  backgroundColor: getAvatarColor(item.id),
                  color: brand.white,
                  border: `2px solid ${brand.white}`,
                }}
              >
                {getInitials(item.username)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: brand.ink,
                    lineHeight: 1.3,
                    fontFamily: fonts.sans,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.username}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '11px',
                    color: brand.muted,
                    lineHeight: 1.3,
                    fontFamily: fonts.sans,
                    fontWeight: 500,
                  }}
                >
                  {item.category}
                </Typography>
              </Box>
            </Box>

            <MediaFrame
              aspectRatio="3/4"
              borderRadius="0"
              hoverScale
              sx={{ borderRadius: 0 }}
            >
              <Image
                src={item.image}
                alt={`${item.username}'s post`}
                fill
                className={mediaFrameImageClass}
                style={mediaFrameImageStyle}
                sizes="(max-width: 600px) 260px, (max-width: 900px) 280px, 290px"
              />
            </MediaFrame>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.5,
                py: 1.2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(item.id);
                  }}
                  size="small"
                  sx={{
                    '&:hover': { backgroundColor: 'transparent' },
                  }}
                >
                  {likedItems[item.id] ? (
                    <FavoriteIcon sx={{ fontSize: 22, color: '#c45c5c' }} />
                  ) : (
                    <FavoriteBorderIcon
                      sx={{ fontSize: 22, color: brand.muted }}
                    />
                  )}
                </IconButton>
                <IconButton size="small">
                  <ChatBubbleOutlineIcon
                    sx={{ fontSize: 20, color: brand.muted }}
                  />
                </IconButton>
                <IconButton size="small">
                  <SendIcon
                    sx={{
                      fontSize: 20,
                      color: brand.muted,
                      transform: 'rotate(-30deg) translateY(-2px)',
                    }}
                  />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: brand.ink,
                    fontFamily: fonts.sans,
                    letterSpacing: '0.02em',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: radius.button,
                    border: `1px solid ${brand.border}`,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      backgroundColor: brand.ink,
                      color: brand.white,
                      borderColor: brand.ink,
                    },
                  }}
                >
                  Shop now
                </Typography>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: brand.surface,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      bgcolor: brand.ink,
                      color: brand.white,
                    },
                  }}
                >
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </SectionContainer>
  );
}

export default FollowUs;
