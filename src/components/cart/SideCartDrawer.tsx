'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Image from 'next/image';
import {
  getProductImageSrc,
  resolveCartImageUrl,
} from '@/src/lib/products/productImages';
import Link from 'next/link';
import { formatPkr } from '@/src/lib/currency/formatCurrency';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/app/store';
import {
  closeCart,
  RemoveItem,
  updateItemQuantity,
} from '@/src/featuers/cart/cartSlice';
import { CartItem } from '@/src/types/CartItemTypes';
import { Product } from '@/src/types/productTypes';
import useAddToCart from '@/src/hooks/useAddToCart';

function CartLineItem({
  item,
  onRemove,
  onQuantityChange,
}: {
  item: CartItem;
  onRemove: () => void;
  onQuantityChange: (qty: number) => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        p: 1.5,
        bgcolor: '#f4f4f4',
        borderRadius: '12px',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: 88,
          height: 88,
          flexShrink: 0,
          borderRadius: '8px',
          overflow: 'hidden',
          bgcolor: '#fff',
        }}
      >
        <Image
          src={resolveCartImageUrl(item.image)}
          width={88}
          height={88}
          alt={item.name}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, pr: 4 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.9rem',
            lineHeight: 1.3,
            mb: 0.5,
          }}
        >
          {item.name}
        </Typography>
        <Typography sx={{ fontSize: '0.78rem', color: '#666', mb: 0.25 }}>
          Size: {item.size}
          {item.color ? ` · ${item.color}` : ''}
        </Typography>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#5A6D57', mb: 1 }}>
          ${item.price}
        </Typography>

        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            bgcolor: '#D1D9CF',
            borderRadius: '6px',
            px: 1.25,
            py: 0.25,
            gap: 1.5,
          }}
        >
          <IconButton
            size="small"
            onClick={() => onQuantityChange(item.quantity - 1)}
            sx={{ p: 0.25, color: '#404E3E', fontSize: '1rem' }}
            aria-label="Decrease quantity"
          >
            −
          </IconButton>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, minWidth: 16, textAlign: 'center' }}>
            {item.quantity}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onQuantityChange(item.quantity + 1)}
            sx={{ p: 0.25, color: '#404E3E', fontSize: '1rem' }}
            aria-label="Increase quantity"
          >
            +
          </IconButton>
        </Box>
      </Box>

      <IconButton
        onClick={onRemove}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: '#888',
        }}
        aria-label="Remove item"
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

function YouMayAlsoLike({
  products,
  onClose,
}: {
  products: Product[];
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const { addToCart } = useAddToCart();

  if (products.length === 0) return null;

  const product = products[index % products.length];
  const goPrev = () => setIndex((i) => (i - 1 + products.length) % products.length);
  const goNext = () => setIndex((i) => (i + 1) % products.length);

  return (
    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>You May Also Like</Typography>
        <Box>
          <IconButton size="small" onClick={goPrev} aria-label="Previous suggestion">
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={goNext} aria-label="Next suggestion">
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box
        component={Link}
        href={`/shop/${product.id}`}
        onClick={onClose}
        sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
          p: 1,
          borderRadius: '10px',
          '&:hover': { bgcolor: '#f8f8f8' },
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '8px',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <Image
            src={getProductImageSrc(product)}
            width={72}
            height={72}
            alt={product.product_name}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 0.25 }} noWrap>
            {product.product_name}
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#5A6D57' }}>
            {formatPkr(Number(product.procuct_price))}
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product);
          }}
          sx={{
            textTransform: 'none',
            fontSize: '0.72rem',
            borderColor: '#5A6D57',
            color: '#5A6D57',
            flexShrink: 0,
            '&:hover': { borderColor: '#4a5a48', bgcolor: 'rgba(90,109,87,0.08)' },
          }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}

export default function SideCartDrawer() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);
  const isOpen = useSelector((state: RootState) => state.cart.isCartOpen);
  const allProducts = useSelector((state: RootState) => state.product.items);
  const [instructions, setInstructions] = useState('');

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  const suggestions = useMemo(() => {
    const cartIds = new Set(items.map((i) => i.id));
    return allProducts.filter((p) => !cartIds.has(p.id)).slice(0, 8);
  }, [allProducts, items]);

  const handleClose = () => dispatch(closeCart());

  const handleRemove = (item: CartItem) => {
    dispatch(
      RemoveItem({
        id: item.id,
        color: item.color ?? '',
        size: item.size,
      }),
    );
  };

  const handleQuantity = (item: CartItem, quantity: number) => {
    dispatch(
      updateItemQuantity({
        id: item.id,
        color: item.color,
        size: item.size,
        quantity,
      }),
    );
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 420 },
          maxWidth: '100vw',
          borderRadius: { xs: 0, sm: '16px 0 0 16px' },
        },
      }}
      BackdropProps={{
        sx: { bgcolor: 'rgba(0, 0, 0, 0.45)' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: '#fff',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            py: 2,
            borderBottom: '1px solid #eee',
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
            {itemCount === 0
              ? 'Your bag'
              : `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
          </Typography>
          <IconButton onClick={handleClose} aria-label="Close cart" size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {items.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              px: 3,
              textAlign: 'center',
              gap: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Your bag is empty
            </Typography>
            <Typography color="text.secondary">
              Discover Bustaniya and add pieces you love.
            </Typography>
            <Button
              component={Link}
              href="/shop"
              onClick={handleClose}
              variant="contained"
              disableElevation
              sx={{
                bgcolor: '#5A6D57',
                textTransform: 'none',
                px: 4,
                '&:hover': { bgcolor: '#4a5a48' },
              }}
            >
              Shop now
            </Button>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                px: 2,
                py: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              {items.map((item) => (
                <CartLineItem
                  key={`${item.id}-${item.color}-${item.size}`}
                  item={item}
                  onRemove={() => handleRemove(item)}
                  onQuantityChange={(qty) => handleQuantity(item, qty)}
                />
              ))}

              <TextField
                fullWidth
                size="small"
                placeholder="Write special instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <StickyNote2OutlinedIcon sx={{ fontSize: 18, color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mt: 0.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    bgcolor: '#fafafa',
                  },
                }}
              />

              <YouMayAlsoLike products={suggestions} onClose={handleClose} />
            </Box>

            <Box
              sx={{
                px: 2.5,
                py: 2,
                borderTop: '1px solid #eee',
                bgcolor: '#fff',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  mb: 2,
                }}
              >
                <Typography sx={{ fontWeight: 500, color: '#666' }}>Subtotal</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.35rem' }}>
                  ${subtotal.toFixed(0)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  component={Link}
                  href="/checkout"
                  onClick={handleClose}
                  fullWidth
                  variant="contained"
                  disableElevation
                  sx={{
                    bgcolor: '#2d2d2d',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.25,
                    borderRadius: '8px',
                    '&:hover': { bgcolor: '#1a1a1a' },
                  }}
                >
                  Checkout
                </Button>
                <Button
                  component={Link}
                  href="/shop"
                  onClick={handleClose}
                  fullWidth
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.25,
                    borderRadius: '8px',
                    borderColor: '#2d2d2d',
                    color: '#2d2d2d',
                    '&:hover': { borderColor: '#1a1a1a', bgcolor: 'rgba(0,0,0,0.04)' },
                  }}
                >
                  Shop more
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
