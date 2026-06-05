'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Typography, SxProps, Theme, Button } from '@mui/material';
import ProductCardImage from '@/src/components/ui/ProductCardImage';
import useAddToCart from '@/src/hooks/useAddToCart';
import {
  formatPkrNishat,
  parsePricePkr,
} from '@/src/lib/currency/formatCurrency';
import { brand, fonts, imageHover } from '@/src/lib/designTokens';
import type { Product } from '@/src/types/productTypes';

export function getProductCardMeta(product: Product): string {
  const category = (product.product_category || 'BUSTANIYA').toUpperCase().trim();
  if (product.product_new) {
    return `${category} — NEW`;
  }
  return category;
}

export type ProductCardLayout = 'grid' | 'carousel';

interface ProductCardProps {
  product: Product;
  href: string;
  layout?: ProductCardLayout;
  sizes?: string;
  sx?: SxProps<Theme>;
  swapImageOnHover?: boolean;
}

const carouselWidths = {
  minWidth: { xs: 'calc(50vw - 28px)', sm: '220px', md: '240px' },
  maxWidth: { xs: 'calc(50vw - 28px)', sm: '220px', md: '240px' },
};

export default function ProductCard({
  product,
  href,
  layout = 'grid',
  sizes,
  sx,
  swapImageOnHover = true,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useAddToCart();
  const hasAltImage =
    swapImageOnHover && (product.product_img?.length ?? 0) > 1;
  const imageIndex = hovered && hasAltImage ? 1 : 0;
  const price = formatPkrNishat(parsePricePkr(product.procuct_price));

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        width: '100%',
        ...(layout === 'carousel' ? { ...carouselWidths, flexShrink: 0 } : {}),
        scrollSnapAlign: layout === 'carousel' ? 'start' : undefined,
        ...sx,
        border: 'none',
        borderRadius: 0,
        bgcolor: 'transparent',
        boxShadow: 'none',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Image Block with Hover Size Selector Overlay */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#f9f9f9',
          '&:hover .product-card-img': {
            transform: `scale(${imageHover.hoverScale})`,
          },
          '&:hover .product-card-quick-sizes': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        }}
      >
        <Link
          href={href}
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
          <ProductCardImage
            product={product}
            imageIndex={imageIndex}
            sizes={
              sizes ??
              (layout === 'carousel'
                ? '(max-width:600px) 50vw, 240px'
                : '(max-width:600px) 50vw, 25vw')
            }
            className="product-card-img"
            style={{
              transition: imageHover.transition,
            }}
            aspectRatio="3/4"
            wrapperSx={{ borderRadius: 0 }} // Clean 0px border radius like Limelight
          />
        </Link>

        {/* Limelight-Style Quick Size Selector Overlay */}
        {product.product_instock !== false && product.product_size?.length > 0 && (
          <Box
            className="product-card-quick-sizes"
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              borderTop: '1px solid #eaeaea',
              py: 1,
              px: 1.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transform: 'translateY(100%)',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
              zIndex: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: '9px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#777777',
                mb: 0.5,
              }}
            >
              Quick Add
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, justifyContent: 'center' }}>
              {product.product_size.map((size) => (
                <Button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product, size);
                  }}
                  sx={{
                    minWidth: 0,
                    p: 0,
                    width: 24,
                    height: 24,
                    fontSize: '10px',
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                    color: '#111111',
                    border: '1px solid #e0e0e0',
                    borderRadius: 0,
                    '&:hover': {
                      borderColor: '#111111',
                      bgcolor: '#111111',
                      color: '#ffffff',
                    },
                  }}
                >
                  {size}
                </Button>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Info Block (Borderless, Clean Text) */}
      <Link
        href={href}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <Box sx={{ pt: 1.5, pb: 1, px: 0.5 }}>
          {/* Category/Tag */}
          <Typography
            component="div"
            sx={{
              fontFamily: fonts.sans,
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: brand.muted,
              mb: 0.5,
            }}
          >
            {getProductCardMeta(product)}
          </Typography>

          {/* Product Name */}
          <Typography
            component="h3"
            sx={{
              fontFamily: fonts.sans,
              fontSize: { xs: '13px', md: '13.5px' },
              fontWeight: 500,
              lineHeight: 1.3,
              color: '#111111',
              letterSpacing: '0.01em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              m: 0,
              mb: 0.75,
              transition: 'color 0.2s',
              '&:hover': { color: '#555555' },
            }}
          >
            {product.product_name}
          </Typography>

          {/* Price */}
          <Typography
            component="p"
            sx={{
              fontFamily: fonts.sans,
              fontSize: { xs: '13.5px', md: '14px' },
              fontWeight: 700,
              color: '#111111',
              mt: 0,
              mb: 1,
            }}
          >
            {price}
          </Typography>
        </Box>
      </Link>
    </Box>
  );
}
