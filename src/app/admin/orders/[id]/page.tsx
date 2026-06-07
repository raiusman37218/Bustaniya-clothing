'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AdminShell from '@/src/components/admin/AdminShell';
import StatusChip from '@/src/components/admin/StatusChip';
import { formatDate, formatPkr } from '@/src/components/admin/formatPkr';
import {
  AdminBillingAddress,
  AdminOrder,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  OrderStatus,
} from '@/src/types/adminOrder';
import { toast } from 'sonner';

const COUNTRY_LABELS: Record<string, string> = {
  PK: 'Pakistan',
  US: 'United States',
  GB: 'United Kingdom',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
};

function countryLabel(code: string | null | undefined): string {
  if (!code) return '—';
  return COUNTRY_LABELS[code] ?? code;
}

function paymentLabel(method: string): string {
  if (method === 'cod') return 'Cash on Delivery (COD)';
  return method;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="caption" sx={{ color: '#707070', display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

function AddressBlock({
  title,
  name,
  phone,
  line1,
  line2,
  city,
  region,
  country,
  postalCode,
}: {
  title: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  country: string;
  postalCode?: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{ p: 3, border: '1px solid #e5e5e5', borderRadius: 2, mb: 3 }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>
      <DetailRow label="Name" value={name} />
      <DetailRow label="Phone" value={phone} />
      <DetailRow label="Address line 1" value={line1} />
      {line2 ? <DetailRow label="Address line 2" value={line2} /> : null}
      <DetailRow label="City" value={city} />
      {region ? <DetailRow label="State / region" value={region} /> : null}
      <DetailRow label="Country" value={country} />
      {postalCode ? <DetailRow label="Postal code" value={postalCode} /> : null}
    </Paper>
  );
}

function billingToAddress(b: AdminBillingAddress) {
  return {
    name: `${b.firstName} ${b.lastName}`.trim(),
    phone: b.phone,
    line1: b.address,
    city: b.city,
    country: countryLabel(b.country),
    postalCode: b.postalCode || undefined,
  };
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Order not found');
        return;
      }
      setOrder(data.order);
    } catch {
      toast.error('Could not load order');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleStatusChange = async (status: OrderStatus) => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Could not update status');
        return;
      }
      setOrder(data.order);
      toast.success('Status updated');
    } catch {
      toast.error('Could not update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminShell title="Order details">
        <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={32} sx={{ color: '#404040' }} />
        </Box>
      </AdminShell>
    );
  }

  if (!order) {
    return (
      <AdminShell title="Order details">
        <Typography color="#707070">Order not found.</Typography>
        <Link href="/admin/orders" style={{ color: '#1773b0', marginTop: 16, display: 'inline-block' }}>
          ← Back to orders
        </Link>
      </AdminShell>
    );
  }

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <AdminShell title={`Order ${order.orderNumber}`}>
      <Link
        href="/admin/orders"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          color: '#1773b0',
          textDecoration: 'none',
          marginBottom: 20,
          fontSize: '0.875rem',
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to orders
      </Link>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{ p: 3, border: '1px solid #e5e5e5', borderRadius: 2, mb: 3 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {order.orderNumber}
                </Typography>
                <Typography variant="body2" sx={{ color: '#707070' }}>
                  Placed {formatDate(order.createdAt)} · {itemCount} item
                  {itemCount === 1 ? '' : 's'}
                </Typography>
              </Box>
              <StatusChip status={order.status} />
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
              Line items ({order.items.length})
            </Typography>
            {order.items.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#707070', mb: 2 }}>
                No line items recorded for this order.
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={56} />
                    <TableCell>Product</TableCell>
                    <TableCell>Variant</TableCell>
                    <TableCell align="center">Qty</TableCell>
                    <TableCell align="right">Unit</TableCell>
                    <TableCell align="right">Line total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.imageUrl ? (
                          <Box
                            sx={{
                              position: 'relative',
                              width: 48,
                              height: 48,
                              borderRadius: 1,
                              overflow: 'hidden',
                              bgcolor: '#f5f5f5',
                            }}
                          >
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              sizes="48px"
                              style={{ objectFit: 'cover' }}
                            />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 1,
                              bgcolor: '#f0f0f0',
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.title}
                        </Typography>
                        {item.productId != null ? (
                          <Typography variant="caption" sx={{ color: '#707070' }}>
                            Product ID: {item.productId}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell sx={{ color: '#707070', fontSize: '0.8125rem' }}>
                        {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`]
                          .filter(Boolean)
                          .join(' · ') || '—'}
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {formatPkr(item.unitPricePkr)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPkr(item.lineTotalPkr)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{ p: 3, border: '1px solid #e5e5e5', borderRadius: 2, mb: 3 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Update status
            </Typography>
            <FormControl fullWidth size="small" disabled={updating}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as OrderStatus)
                }
              >
                {ORDER_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {ORDER_STATUS_LABELS[s]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          <Paper
            elevation={0}
            sx={{ p: 3, border: '1px solid #e5e5e5', borderRadius: 2, mb: 3 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Customer
            </Typography>
            <DetailRow label="Name" value={order.guestName ?? ''} />
            <DetailRow label="Email" value={order.customerEmail || order.guestEmail} />
            <DetailRow
              label="Phone"
              value={order.guestPhone ?? order.shippingPhone ?? ''}
            />
            <DetailRow label="Order ID" value={order.id} />
          </Paper>

          <AddressBlock
            title="Shipping address"
            name={order.shippingFullName ?? order.guestName ?? ''}
            phone={order.shippingPhone ?? order.guestPhone ?? ''}
            line1={order.shippingLine1 ?? ''}
            line2={order.shippingLine2 ?? undefined}
            city={order.shippingCity ?? ''}
            region={order.shippingRegion ?? undefined}
            country={countryLabel(order.shippingCountry)}
            postalCode={order.shippingPostalCode ?? undefined}
          />

          {order.billingAddress ? (
            <AddressBlock
              title="Billing address"
              {...billingToAddress(order.billingAddress)}
            />
          ) : null}

          <Paper
            elevation={0}
            sx={{ p: 3, border: '1px solid #e5e5e5', borderRadius: 2 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Payment summary
            </Typography>
            <DetailRow label="Method" value={paymentLabel(order.paymentMethod)} />
            <DetailRow label="Subtotal" value={formatPkr(order.subtotalPkr)} />
            {order.discountAmountPkr > 0 ? (
              <DetailRow
                label={
                  order.discountCode
                    ? `Discount (${order.discountCode})`
                    : 'Discount'
                }
                value={`−${formatPkr(order.discountAmountPkr)}`}
              />
            ) : null}
            <DetailRow
              label="Shipping"
              value={formatPkr(order.shippingFeePkr)}
            />
            <DetailRow label="Total" value={formatPkr(order.totalPkr)} />
            {order.notes ? (
              <DetailRow label="Notes" value={order.notes} />
            ) : null}
          </Paper>
        </Grid>
      </Grid>
    </AdminShell>
  );
}
