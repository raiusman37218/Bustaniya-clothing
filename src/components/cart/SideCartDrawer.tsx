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
import { formatPkrNishat } from '@/src/lib/currency/formatCurrency';
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
        gap: 2,
        px: 3,
        py: 2.5,
        position: 'relative',
        alignItems: 'flex-start',
        borderBottom: '1px solid rgba(29, 45, 20, 0.1)',
      }}
    >
      <Box
        sx={{
          width: 90,
          height: 110,
          flexShrink: 0,
          borderRadius: '4px',
          overflow: 'hidden',
          bgcolor: '#fff',
        }}
      >
        <Image
          src={resolveCartImageUrl(item.image)}
          width={90}
          height={110}
          alt={item.name}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '1rem',
              lineHeight: 1.3,
              color: '#1d2d14',
            }}
          >
            {item.name}
          </Typography>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '0.95rem',
              color: '#1d2d14',
              whiteSpace: 'nowrap',
              ml: 1,
            }}
          >
            {formatPkrNishat(Number(item.price) * item.quantity)}
          </Typography>
        </Box>

        <Typography sx={{ fontSize: '0.85rem', color: 'rgba(29, 45, 20, 0.8)', mb: 0.5 }}>
          {item.size}
          {item.color ? ` / ${item.color}` : ''}
        </Typography>

        <Typography sx={{ fontSize: '0.85rem', color: 'rgba(29, 45, 20, 0.8)', mb: 2 }}>
          {formatPkrNishat(Number(item.price))}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              bgcolor: '#ffffff',
              borderRadius: '4px',
              px: 1,
              py: 0.5,
              gap: 1.5,
            }}
          >
            <IconButton
              size="small"
              onClick={() => onQuantityChange(item.quantity - 1)}
              sx={{ p: 0.25, color: '#1d2d14', fontSize: '0.9rem', width: 16, height: 16 }}
              aria-label="Decrease quantity"
            >
              −
            </IconButton>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, minWidth: 16, textAlign: 'center', color: '#1d2d14' }}>
              {item.quantity}
            </Typography>
            <IconButton
              size="small"
              onClick={() => onQuantityChange(item.quantity + 1)}
              sx={{ p: 0.25, color: '#1d2d14', fontSize: '0.9rem', width: 16, height: 16 }}
              aria-label="Increase quantity"
            >
              +
            </IconButton>
          </Box>

          <IconButton
            onClick={onRemove}
            size="small"
            sx={{
              color: '#1d2d14',
              p: 0.5,
              '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
            }}
            aria-label="Remove item"
          >
            <DeleteOutlineIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>
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
    <Box sx={{ mt: 2, pt: 2, px: 3, borderTop: '1px solid rgba(29, 45, 20, 0.1)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1d2d14' }}>You May Also Like</Typography>
        <Box>
          <IconButton size="small" onClick={goPrev} aria-label="Previous suggestion" sx={{ color: '#1d2d14' }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={goNext} aria-label="Next suggestion" sx={{ color: '#1d2d14' }}>
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
          borderRadius: '8px',
          bgcolor: 'rgba(255, 255, 255, 0.3)',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.4)' },
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '6px',
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
          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 0.25, color: '#1d2d14' }} noWrap>
            {product.product_name}
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1d2d14' }}>
            {formatPkrNishat(Number(product.procuct_price))}
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
            borderColor: '#1d2d14',
            color: '#1d2d14',
            flexShrink: 0,
            '&:hover': { borderColor: '#000000', bgcolor: 'rgba(0,0,0,0.04)' },
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
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountCode, setDiscountCode] = useState('');

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
          bgcolor: '#bbe983',
          color: '#1d2d14',
          backgroundImage: 'none',
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
          bgcolor: 'transparent',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            pt: 4,
            pb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '1.8rem', color: '#1d2d14' }}>
              Cart
            </Typography>
            {itemCount > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 24,
                  height: 24,
                  px: 0.75,
                  borderRadius: '50%',
                  bgcolor: 'rgba(29, 45, 20, 0.15)',
                  color: '#1d2d14',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                {itemCount}
              </Box>
            )}
          </Box>
          <IconButton onClick={handleClose} aria-label="Close cart" sx={{ color: '#1d2d14' }}>
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
            <Typography variant="h6" fontWeight={600} sx={{ color: '#1d2d14' }}>
              Your bag is empty
            </Typography>
            <Typography sx={{ color: 'rgba(29, 45, 20, 0.8)' }}>
              Discover Bustaniya and add pieces you love.
            </Typography>
            <Button
              component={Link}
              href="/shop"
              onClick={handleClose}
              variant="contained"
              disableElevation
              sx={{
                bgcolor: '#000000',
                color: '#ffffff',
                textTransform: 'none',
                px: 4,
                py: 1,
                borderRadius: '24px',
                '&:hover': { bgcolor: '#1a1a1a' },
              }}
            >
              Shop now
            </Button>
          </Box>
        ) : (
          <>
            {/* Scrollable list */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                py: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(29, 45, 20, 0.2)',
                  borderRadius: '4px',
                },
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

              {/* Special instructions */}
              <Box sx={{ px: 3, mt: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Write special instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <StickyNote2OutlinedIcon sx={{ fontSize: 18, color: '#1d2d14' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                      '& fieldset': { borderColor: 'rgba(29, 45, 20, 0.15)' },
                      '&:hover fieldset': { borderColor: 'rgba(29, 45, 20, 0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#1d2d14' },
                    },
                    '& .MuiInputBase-input': {
                      color: '#1d2d14',
                    }
                  }}
                />
              </Box>

              {/* Discount Accordion */}
              <Box sx={{ px: 3, mt: 1 }}>
                <Box
                  onClick={() => setShowDiscount(!showDiscount)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    py: 1,
                  }}
                >
                  <Typography sx={{ color: '#1d2d14', fontSize: '1rem', fontWeight: 500 }}>
                    Discount
                  </Typography>
                  <Typography sx={{ color: '#1d2d14', fontSize: '1.2rem', fontWeight: 500 }}>
                    {showDiscount ? '−' : '+'}
                  </Typography>
                </Box>
                {showDiscount && (
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, pb: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          bgcolor: 'rgba(255, 255, 255, 0.3)',
                          '& fieldset': { borderColor: 'rgba(29, 45, 20, 0.15)' },
                          '&:hover fieldset': { borderColor: 'rgba(29, 45, 20, 0.3)' },
                          '&.Mui-focused fieldset': { borderColor: '#1d2d14' },
                        },
                        '& .MuiInputBase-input': {
                          color: '#1d2d14',
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      disableElevation
                      sx={{
                        bgcolor: '#000000',
                        color: '#ffffff',
                        textTransform: 'none',
                        borderRadius: '8px',
                        '&:hover': { bgcolor: '#1a1a1a' }
                      }}
                    >
                      Apply
                    </Button>
                  </Box>
                )}
              </Box>

              <YouMayAlsoLike products={suggestions} onClose={handleClose} />
            </Box>

            {/* Footer */}
            <Box
              sx={{
                px: 3,
                pt: 2,
                pb: 4,
                borderTop: '1px solid rgba(29, 45, 20, 0.1)',
                bgcolor: 'transparent',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  mb: 1,
                }}
              >
                <Typography sx={{ fontWeight: 500, color: '#1d2d14', fontSize: '1.1rem' }}>
                  Estimated total
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1d2d14' }}>
                  {formatPkrNishat(subtotal)} PKR
                </Typography>
              </Box>

              <Typography sx={{ color: 'rgba(29, 45, 20, 0.8)', fontSize: '0.82rem', mb: 3 }}>
                Taxes and shipping calculated at checkout.
              </Typography>

              <Button
                component={Link}
                href="/checkout"
                onClick={handleClose}
                fullWidth
                variant="contained"
                disableElevation
                sx={{
                  bgcolor: '#000000',
                  color: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: '24px',
                  fontSize: '1rem',
                  '&:hover': { bgcolor: '#1a1a1a' },
                }}
              >
                Check out
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
