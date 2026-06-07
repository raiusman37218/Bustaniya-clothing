'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  LAST_ORDER_STORAGE_KEY,
  OrderConfirmation,
} from '@/src/types/order';
import { formatPkr } from '@/src/lib/currency/formatCurrency';

const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const COUNTRY_LABELS: Record<string, string> = {
  PK: 'Pakistan',
  US: 'United States',
  GB: 'United Kingdom',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
};

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderConfirmation | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(LAST_ORDER_STORAGE_KEY);
    if (!raw) {
      router.replace('/shop');
      return;
    }
    try {
      const parsed = JSON.parse(raw) as OrderConfirmation;
      const paramNumber = searchParams.get('order');
      if (paramNumber && parsed.orderNumber !== paramNumber) {
        router.replace('/shop');
        return;
      }
      setOrder(parsed);
    } catch {
      router.replace('/shop');
    }
  }, [router, searchParams]);

  if (!order) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT,
        }}
      >
        <Typography color="#707070">Loading order summary…</Typography>
      </Box>
    );
  }

  const countryLabel =
    COUNTRY_LABELS[order.customer.country] ?? order.customer.country;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#fafafa',
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3 },
        fontFamily: FONT,
      }}
    >
      <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircleOutlineIcon
            sx={{ fontSize: 56, color: '#5A6D57', mb: 1 }}
          />
          <Typography
            sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 600, color: '#121212' }}
          >
            Order confirmed
          </Typography>
          <Typography sx={{ mt: 1, color: '#707070', fontSize: '0.9375rem' }}>
            Thank you, {order.customer.firstName}. Your order{' '}
            <strong>{order.orderNumber}</strong> has been placed.
          </Typography>
          {order.emailSent ? (
            <Typography sx={{ mt: 1, color: '#5A6D57', fontSize: '0.875rem' }}>
              A confirmation email was sent to {order.customer.email}.
            </Typography>
          ) : (
            <Typography sx={{ mt: 1, color: '#707070', fontSize: '0.875rem' }}>
              We saved your order details below.
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            bgcolor: '#fff',
            borderRadius: '12px',
            border: '1px solid #e1e1e1',
            overflow: 'hidden',
            mb: 3,
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: '1px solid #e1e1e1',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Typography sx={{ fontWeight: 600, color: '#121212' }}>
              Order summary
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#707070' }}>
              {new Date(order.createdAt).toLocaleString()}
            </Typography>
          </Box>

          <Box sx={{ px: 3, py: 2 }}>
            {order.items.map((item) => (
              <Box
                key={`${item.id}-${item.color}-${item.size}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  py: 1.5,
                  borderBottom: '1px solid #f0f0f0',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '8px',
                    border: '1px solid #e1e1e1',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#707070' }}>
                    Qty {item.quantity}
                    {item.size ? ` · ${item.size}` : ''}
                    {item.color ? ` · ${item.color}` : ''}
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 500, flexShrink: 0 }}>
                  {formatPkr(item.lineTotal)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: '#fafafa',
              borderTop: '1px solid #e1e1e1',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ fontSize: '0.9375rem' }}>Subtotal</Typography>
              <Typography sx={{ fontSize: '0.9375rem' }}>
                {formatPkr(order.subtotal)}
              </Typography>
            </Box>
            {order.discountAmount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '0.9375rem' }}>Discount</Typography>
                <Typography sx={{ fontSize: '0.9375rem' }}>
                  −{formatPkr(order.discountAmount)}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.9375rem' }}>Shipping</Typography>
              <Typography sx={{ fontSize: '0.9375rem' }}>FREE</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pt: 1.5,
                borderTop: '1px solid #e1e1e1',
              }}
            >
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 600 }}>
                Total
              </Typography>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 600 }}>
                {formatPkr(order.total)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: '#fff',
            borderRadius: '12px',
            border: '1px solid #e1e1e1',
            px: 3,
            py: 2.5,
            mb: 3,
          }}
        >
          <Typography sx={{ fontWeight: 600, mb: 1.5, color: '#121212' }}>
            Delivery details
          </Typography>
          <Typography sx={{ fontSize: '0.9375rem', color: '#121212', lineHeight: 1.6 }}>
            {order.customer.firstName} {order.customer.lastName}
            <br />
            {order.customer.address}
            <br />
            {order.customer.city}
            {order.customer.postalCode ? `, ${order.customer.postalCode}` : ''}
            <br />
            {countryLabel}
            <br />
            {order.customer.phone}
          </Typography>
          <Typography sx={{ mt: 2, fontSize: '0.875rem', color: '#707070' }}>
            Payment: {order.paymentMethod}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Button
            component={Link}
            href={`/order-track?order=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(order.customer.email)}`}
            fullWidth
            variant="contained"
            disableElevation
            sx={{
              bgcolor: '#5A6D57',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              borderRadius: '8px',
              '&:hover': { bgcolor: '#4a5a48' },
            }}
          >
            Track order
          </Button>
          <Button
            component={Link}
            href="/shop"
            fullWidth
            variant="contained"
            disableElevation
            sx={{
              bgcolor: '#121212',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              borderRadius: '8px',
              '&:hover': { bgcolor: '#000' },
            }}
          >
            Continue shopping
          </Button>
          <Button
            component={Link}
            href="/"
            fullWidth
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              borderRadius: '8px',
              borderColor: '#d9d9d9',
              color: '#121212',
              '&:hover': { borderColor: '#121212', bgcolor: '#f5f5f5' },
            }}
          >
            Back to home
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT,
          }}
        >
          <Typography color="#707070">Loading order summary…</Typography>
        </Box>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
