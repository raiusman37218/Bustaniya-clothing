'use client';

import { Box, SxProps, Theme } from '@mui/material';
import {
  brand,
  gradients,
  imageHover,
  radius,
} from '@/src/lib/designTokens';
import type { ReactNode } from 'react';

type MediaFrameProps = {
  children: ReactNode;
  aspectRatio?: string;
  borderRadius?: string;
  hoverScale?: boolean;
  hoverClassName?: string;
  gradient?: 'bottom' | 'bottomStrong' | false;
  sx?: SxProps<Theme>;
};

export default function MediaFrame({
  children,
  aspectRatio = '4/5',
  borderRadius = radius.editorial,
  hoverScale = true,
  hoverClassName = 'media-frame-img',
  gradient = false,
  sx,
}: MediaFrameProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        overflow: 'hidden',
        borderRadius,
        bgcolor: brand.imageBg,
        ...(hoverScale && {
          [`&:hover .${hoverClassName}`]: {
            transform: `scale(${imageHover.hoverScale})`,
          },
        }),
        ...sx,
      }}
    >
      {children}
      {gradient && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              gradient === 'bottomStrong'
                ? gradients.imageBottomStrong
                : gradients.imageBottom,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
}

export const mediaFrameImageClass = 'media-frame-img';

export const mediaFrameImageStyle: React.CSSProperties = {
  objectFit: 'cover',
  transition: imageHover.transition,
};
