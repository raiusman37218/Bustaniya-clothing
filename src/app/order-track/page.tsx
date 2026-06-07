'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BannerHeader from '@/src/components/headers/BannerHeader';
import NavBar from '@/src/components/layout/NavBar';
import Footer from '@/src/components/layout/Footer';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Image from 'next/image';
import { brand, fonts, radius } from '@/src/lib/designTokens';
import { formatPkr } from '@/src/lib/currency/formatCurrency';
import { AdminOrder } from '@/src/types/adminOrder';

// Order status mapping
const statusSteps = [
  { status: 'pending', label: 'Order Placed', desc: 'We have received your order.', icon: CheckCircleIcon },
  { status: 'processing', label: 'Processing', desc: 'Your order is being prepared.', icon: InventoryIcon },
  { status: 'shipped', label: 'Shipped', desc: 'Your package is on its way.', icon: LocalShippingIcon },
  { status: 'delivered', label: 'Delivered', desc: 'Delivered to your address.', icon: HomeIcon },
];

function getStatusIndex(status: string): number {
  switch (status) {
    case 'pending':
      return 0;
    case 'processing':
      return 1;
    case 'shipped':
      return 2;
    case 'delivered':
      return 3;
    default:
      return 0;
  }
}

function OrderTrackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Trigger search if params are already filled
  React.useEffect(() => {
    const orderParam = searchParams.get('order');
    const emailParam = searchParams.get('email');
    if (orderParam && emailParam) {
      handleSearch(orderParam, emailParam);
    }
  }, [searchParams]);

  const handleSearch = async (ordNum = orderNumber, mail = email) => {
    if (!ordNum.trim() || !mail.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    setError('');
    setSearched(true);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(ordNum.trim())}&email=${encodeURIComponent(mail.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'No order found with the provided details.');
      } else {
        setOrder(data.order);
      }
    } catch (err) {
      setError('Failed to fetch tracking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL params
    const params = new URLSearchParams();
    params.set('order', orderNumber);
    params.set('email', email);
    router.replace(`/order-track?${params.toString()}`);
    handleSearch();
  };

  const currentStepIndex = order ? getStatusIndex(order.status) : 0;
  const isCancelled = order?.status === 'cancelled';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fafafa' }}>
      <BannerHeader />
      <NavBar />

      <Container sx={{ py: 6, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: fonts.display,
              fontWeight: 600,
              textAlign: 'center',
              color: brand.ink,
              mb: 1.5,
            }}
          >
            Track Your Order
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: '0.95rem',
              textAlign: 'center',
              color: brand.muted,
              mb: 4,
            }}
          >
            Enter your order number and billing email address to trace its progress.
          </Typography>

          {/* Search Form */}
          <Paper
            elevation={0}
            component="form"
            onSubmit={onSubmit}
            sx={{
              p: 4,
              border: `1px solid ${brand.border}`,
              borderRadius: radius.product,
              bgcolor: brand.white,
              mb: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Order Number"
                  placeholder="e.g. BST-1718-2938"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  variant="outlined"
                  size="medium"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    fontFamily: fonts.sans,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: radius.button,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Billing Email"
                  placeholder="e.g. customer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  variant="outlined"
                  size="medium"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    fontFamily: fonts.sans,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: radius.button,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  disableElevation
                  sx={{
                    height: '56px',
                    bgcolor: brand.sage,
                    color: brand.white,
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderRadius: radius.button,
                    '&:hover': {
                      bgcolor: brand.sageLight,
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Track'}
                </Button>
              </Grid>
            </Grid>
            {error && (
              <Box
                sx={{
                  mt: 3,
                  p: 2.5,
                  bgcolor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                }}
              >
                <WarningAmberIcon sx={{ color: '#dc2626', mt: 0.2 }} />
                <Box sx={{ textAlign: 'left' }}>
                  <Typography sx={{ fontFamily: fonts.sans, fontSize: '0.9rem', fontWeight: 700, color: '#991b1b', mb: 0.5 }}>
                    Order Not Found
                  </Typography>
                  <Typography sx={{ fontFamily: fonts.sans, fontSize: '0.825rem', color: '#7f1d1d', lineHeight: 1.4 }}>
                    {error} Please check your order number (e.g. BST-XXXX) and billing email address and try again.
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          {/* Loading state */}
          {loading && !order && (
            <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress sx={{ color: brand.sage }} />
            </Box>
          )}

          {/* Tracking Details */}
          {searched && order && (
            <Box sx={{ mt: 2 }}>
              {/* Stepper Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: `1px solid ${brand.border}`,
                  borderRadius: radius.product,
                  bgcolor: brand.white,
                  mb: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: brand.muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                      Tracking Details for
                    </Typography>
                    <Typography variant="h5" sx={{ fontFamily: fonts.display, fontWeight: 700, color: brand.ink }}>
                      {order.orderNumber}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: { md: 'right' } }}>
                    <Typography variant="subtitle2" sx={{ color: brand.muted, fontSize: '0.8rem' }}>
                      Status:
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: isCancelled ? '#d32f2f' : brand.sage,
                        textTransform: 'uppercase',
                        fontSize: '0.9rem',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {isCancelled ? 'Cancelled' : order.status}
                    </Typography>
                  </Box>
                </Box>

                {isCancelled ? (
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: 'rgba(211, 47, 47, 0.04)',
                      border: '1px dashed #d32f2f',
                      borderRadius: radius.product,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <WarningAmberIcon sx={{ color: '#d32f2f' }} />
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#d32f2f' }}>
                        This order has been cancelled
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#707070' }}>
                        Please contact support if you believe this was an error.
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  /* Visual Stepper */
                  <Grid container spacing={2} sx={{ position: 'relative', mt: 2 }}>
                    {statusSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isActive = idx === currentStepIndex;
                      const StepIcon = step.icon;

                      return (
                        <Grid item xs={12} sm={3} key={step.status} sx={{ position: 'relative', textAlign: 'center' }}>
                          {/* Connection line for desktop */}
                          {idx < 3 && (
                            <Box
                              sx={{
                                display: { xs: 'none', sm: 'block' },
                                position: 'absolute',
                                top: '24px',
                                left: '50%',
                                right: '-50%',
                                height: '2px',
                                bgcolor: idx < currentStepIndex ? brand.sage : brand.border,
                                zIndex: 1,
                              }}
                            />
                          )}

                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              position: 'relative',
                              zIndex: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                bgcolor: isCompleted ? brand.sage : brand.white,
                                border: `2px solid ${isCompleted ? brand.sage : brand.border}`,
                                color: isCompleted ? brand.white : brand.muted,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1.5,
                                transition: 'all 0.3s ease',
                                boxShadow: isActive ? `0 0 0 4px rgba(90, 109, 87, 0.15)` : 'none',
                              }}
                            >
                              <StepIcon sx={{ fontSize: '1.4rem' }} />
                            </Box>
                            <Typography
                              sx={{
                                fontFamily: fonts.sans,
                                fontWeight: isCompleted ? 700 : 500,
                                fontSize: '0.85rem',
                                color: isCompleted ? brand.ink : brand.muted,
                                mb: 0.5,
                              }}
                            >
                              {step.label}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: brand.muted, px: 1 }}>
                              {step.desc}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Paper>

              {/* Order Information Grid */}
              <Grid container spacing={4}>
                {/* Left side: Items */}
                <Grid item xs={12} md={7}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      border: `1px solid ${brand.border}`,
                      borderRadius: radius.product,
                      bgcolor: brand.white,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                    }}
                  >
                    <Typography sx={{ fontFamily: fonts.display, fontSize: '1.25rem', fontWeight: 600, mb: 3 }}>
                      Items Ordered
                    </Typography>

                    {order.items.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          py: 2,
                          borderBottom: `1px solid ${brand.border}`,
                          '&:last-child': { borderBottom: 'none', pb: 0 },
                          '&:first-of-type': { pt: 0 },
                        }}
                      >
                        <Box
                          sx={{
                            width: 64,
                            height: 80,
                            borderRadius: '4px',
                            overflow: 'hidden',
                            position: 'relative',
                            border: `1px solid ${brand.border}`,
                            flexShrink: 0,
                            bgcolor: brand.imageBg,
                          }}
                        >
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <Box sx={{ width: '100%', height: '100%', bgcolor: '#f0f0f0' }} />
                          )}
                        </Box>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: brand.ink }}>
                            {item.title}
                          </Typography>
                          <Typography sx={{ fontSize: '0.8rem', color: brand.muted, mt: 0.5 }}>
                            Qty {item.quantity} · {item.size || 'No Size'}
                            {item.color ? ` · ${item.color}` : ''}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 600, color: brand.charcoal }}>
                          {formatPkr(item.lineTotalPkr)}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>

                {/* Right side: Shipping Details & Summary */}
                <Grid item xs={12} md={5}>
                  {/* Delivery Address */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      border: `1px solid ${brand.border}`,
                      borderRadius: radius.product,
                      bgcolor: brand.white,
                      mb: 4,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                    }}
                  >
                    <Typography sx={{ fontFamily: fonts.display, fontSize: '1.15rem', fontWeight: 600, mb: 2 }}>
                      Delivery Information
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.6, color: brand.charcoal }}>
                      <strong>{order.shippingFullName || order.guestName}</strong>
                      <br />
                      {order.shippingLine1}
                      {order.shippingLine2 && `, ${order.shippingLine2}`}
                      <br />
                      {order.shippingCity}
                      {order.shippingPostalCode && `, ${order.shippingPostalCode}`}
                      <br />
                      {order.shippingCountry === 'PK' ? 'Pakistan' : order.shippingCountry}
                      <br />
                      Phone: {order.shippingPhone || order.guestPhone}
                    </Typography>
                  </Paper>

                  {/* Summary */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      border: `1px solid ${brand.border}`,
                      borderRadius: radius.product,
                      bgcolor: brand.white,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                    }}
                  >
                    <Typography sx={{ fontFamily: fonts.display, fontSize: '1.15rem', fontWeight: 600, mb: 2.5 }}>
                      Payment Summary
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: brand.muted }}>Subtotal</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{formatPkr(order.subtotalPkr)}</Typography>
                    </Box>

                    {order.discountAmountPkr > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: brand.muted }}>
                          Discount {order.discountCode ? `(${order.discountCode})` : ''}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 500 }}>
                          -{formatPkr(order.discountAmountPkr)}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ color: brand.muted }}>Shipping</Typography>
                      <Typography variant="body2" sx={{ color: brand.sage, fontWeight: 600 }}>
                        {order.shippingFeePkr > 0 ? formatPkr(order.shippingFeePkr) : 'FREE'}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 700, color: brand.ink }}>Total</Typography>
                      <Typography sx={{ fontWeight: 700, color: brand.sage }}>
                        {formatPkr(order.totalPkr)}
                      </Typography>
                    </Box>

                    <Typography variant="caption" sx={{ color: brand.muted, display: 'block', mt: 2 }}>
                      Method: Cash on Delivery (COD)
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}

export default function OrderTrackPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ color: brand.sage }} />
        </Box>
      }
    >
      <OrderTrackContent />
    </Suspense>
  );
}
