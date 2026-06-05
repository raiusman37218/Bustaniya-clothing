'use client';

import { Button, SxProps, Theme } from '@mui/material';
import { Product } from '@/src/types/productTypes';
import useAddToCart from '@/src/hooks/useAddToCart';

interface Props {
  product: Product;
  compact?: boolean;
  fullWidth?: boolean;
  variant?: 'default' | 'nishat';
  sx?: SxProps<Theme>;
}

export default function AddToCartButton({
  product,
  compact = false,
  fullWidth = false,
  variant = 'default',
  sx,
}: Props) {
  const { addToCart } = useAddToCart();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product);
  };

  const nishatSx: SxProps<Theme> = {
    bgcolor: '#fff',
    color: '#111',
    border: '1px solid #111',
    textTransform: 'uppercase',
    fontWeight: 500,
    fontSize: '11px',
    letterSpacing: '0.14em',
    py: 1.15,
    px: 2,
    borderRadius: 0,
    boxShadow: 'none',
    '&:hover': {
      bgcolor: '#111',
      color: '#fff',
      borderColor: '#111',
      boxShadow: 'none',
    },
  };

  const defaultSx: SxProps<Theme> = {
    bgcolor: '#5A6D57',
    color: '#fff',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: compact ? '0.72rem' : '0.85rem',
    py: compact ? 0.5 : 0.75,
    px: compact ? 1.25 : 2,
    borderRadius: '6px',
    '&:hover': { bgcolor: '#4a5a48' },
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      size="small"
      variant={variant === 'nishat' ? 'outlined' : 'contained'}
      disableElevation
      fullWidth={fullWidth}
      sx={{
        ...(variant === 'nishat' ? nishatSx : defaultSx),
        ...sx,
      }}
    >
      Add to cart
    </Button>
  );
}
