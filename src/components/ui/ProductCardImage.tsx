'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Box, SxProps, Theme } from '@mui/material';
import {
  getProductImageSrc,
  PRODUCT_IMAGE_FALLBACK,
} from '@/src/lib/products/productImages';
import { brand, radius } from '@/src/lib/designTokens';
import type { Product } from '@/src/types/productTypes';

const frameBaseSx = {
  bgcolor: brand.imageBg,
  overflow: 'hidden',
  borderRadius: radius.product,
} as const;

type Props = {
  product: Product;
  imageIndex?: number;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  wrapperSx?: SxProps<Theme>;
  aspectRatio?: string;
};

export default function ProductCardImage({
  product,
  imageIndex = 0,
  alt,
  fill = true,
  width = 400,
  height = 400,
  sizes,
  className,
  style,
  wrapperSx,
  aspectRatio = '3/4',
}: Props) {
  const [src, setSrc] = useState(() =>
    getProductImageSrc(product, imageIndex),
  );
  const [useFallbackImg, setUseFallbackImg] = useState(false);

  useEffect(() => {
    setSrc(getProductImageSrc(product, imageIndex));
    setUseFallbackImg(false);
  }, [product, imageIndex]);

  const handleError = () => {
    if (src !== PRODUCT_IMAGE_FALLBACK) {
      setSrc(PRODUCT_IMAGE_FALLBACK);
      setUseFallbackImg(false);
    } else {
      setUseFallbackImg(true);
    }
  };

  const imageStyle = {
    objectFit: 'cover' as const,
    ...style,
  };

  if (useFallbackImg) {
    const boxProps = fill
      ? {
          sx: {
            position: 'relative' as const,
            width: '100%',
            aspectRatio,
            ...frameBaseSx,
            ...wrapperSx,
          },
        }
      : {
          sx: {
            position: 'relative' as const,
            width: '100%',
            lineHeight: 0,
            ...wrapperSx,
          },
        };

    return (
      <Box {...boxProps}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PRODUCT_IMAGE_FALLBACK}
          alt={alt ?? product.product_name}
          className={className}
          style={
            fill
              ? {
                  ...imageStyle,
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                }
              : { ...imageStyle, width: '100%', height: 'auto' }
          }
        />
      </Box>
    );
  }

  if (fill) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio,
          ...frameBaseSx,
          ...wrapperSx,
        }}
      >
        <Image
          src={src}
          alt={alt ?? product.product_name}
          fill
          sizes={sizes ?? '(max-width: 600px) 50vw, 25vw'}
          className={className}
          style={imageStyle}
          onError={handleError}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        lineHeight: 0,
        ...wrapperSx,
      }}
    >
      <Image
        src={src}
        alt={alt ?? product.product_name}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
        style={{ ...imageStyle, width: '100%', height: 'auto' }}
        onError={handleError}
      />
    </Box>
  );
}
