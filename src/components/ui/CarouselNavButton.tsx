'use client';

import { IconButton, IconButtonProps } from '@mui/material';
import { brand } from '@/src/lib/designTokens';

type CarouselNavButtonProps = IconButtonProps & {
  direction: 'prev' | 'next';
};

export default function CarouselNavButton({
  direction,
  size = 'medium',
  sx,
  ...props
}: CarouselNavButtonProps) {
  const dim = size === 'small' ? 36 : 40;

  return (
    <IconButton
      size={size}
      aria-label={direction === 'prev' ? 'Previous' : 'Next'}
      sx={{
        border: `1.5px solid ${brand.border}`,
        borderRadius: '50%',
        width: dim,
        height: dim,
        color: brand.ink,
        transition: 'all 0.25s ease',
        '&:hover': {
          backgroundColor: brand.ink,
          color: brand.white,
          borderColor: brand.ink,
        },
        ...sx,
      }}
      {...props}
    />
  );
}
