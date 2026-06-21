'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  Button,
  TextField,
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
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Edit / Delete states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    guestName: '',
    customerEmail: '',
    guestPhone: '',
    shippingFullName: '',
    shippingPhone: '',
    shippingLine1: '',
    shippingLine2: '',
    shippingCity: '',
    shippingRegion: '',
    shippingCountry: '',
    shippingPostalCode: '',
    paymentMethod: '',
    subtotalPkr: 0,
    shippingFeePkr: 0,
    discountAmountPkr: 0,
    discountCode: '',
    notes: '',
  });

  const handleStartEditing = () => {
    if (!order) return;
    setEditForm({
      guestName: order.guestName ?? '',
      customerEmail: order.customerEmail || order.guestEmail || '',
      guestPhone: order.guestPhone ?? '',
      shippingFullName: order.shippingFullName ?? order.guestName ?? '',
      shippingPhone: order.shippingPhone ?? order.guestPhone ?? '',
      shippingLine1: order.shippingLine1 ?? '',
      shippingLine2: order.shippingLine2 ?? '',
      shippingCity: order.shippingCity ?? '',
      shippingRegion: order.shippingRegion ?? '',
      shippingCountry: order.shippingCountry ?? 'PK',
      shippingPostalCode: order.shippingPostalCode ?? '',
      paymentMethod: order.paymentMethod ?? 'cod',
      subtotalPkr: order.subtotalPkr ?? 0,
      shippingFeePkr: order.shippingFeePkr ?? 0,
      discountAmountPkr: order.discountAmountPkr ?? 0,
      discountCode: order.discountCode ?? '',
      notes: order.notes ?? '',
    });
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      const total = Number(editForm.subtotalPkr) + Number(editForm.shippingFeePkr) - Number(editForm.discountAmountPkr);

      const payload = {
        guest_name: editForm.guestName,
        customer_email: editForm.customerEmail,
        guest_email: editForm.customerEmail,
        guest_phone: editForm.guestPhone,
        shipping_full_name: editForm.shippingFullName,
        shipping_phone: editForm.shippingPhone,
        shipping_line1: editForm.shippingLine1,
        shipping_line2: editForm.shippingLine2 || null,
        shipping_city: editForm.shippingCity,
        shipping_region: editForm.shippingRegion || null,
        shipping_country: editForm.shippingCountry,
        shipping_postal_code: editForm.shippingPostalCode || null,
        payment_method: editForm.paymentMethod,
        subtotal_pkr: Number(editForm.subtotalPkr),
        shipping_fee_pkr: Number(editForm.shippingFeePkr),
        discount_amount_pkr: Number(editForm.discountAmountPkr),
        discount_code: editForm.discountCode || null,
        notes: editForm.notes || null,
        total_pkr: total,
      };

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Could not update order details');
        return;
      }
      setOrder(data.order);
      setIsEditing(false);
      toast.success('Order details updated successfully');
    } catch (err) {
      toast.error('Could not update order details');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!window.confirm(`Are you sure you want to delete order ${order?.orderNumber}? This action cannot be undone.`)) {
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? 'Could not delete order');
        return;
      }
      toast.success('Order deleted successfully');
      router.push('/admin/orders');
    } catch (err) {
      toast.error('Could not delete order');
    } finally {
      setUpdating(false);
    }
  };

  // PostEx states
  const [booking, setBooking] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [cityNameInput, setCityNameInput] = useState('');
  const [pickupCodeInput, setPickupCodeInput] = useState('001');

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
      if (data.order?.shippingCity) {
        setCityNameInput(data.order.shippingCity);
      }
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

  const handleBookPostEx = async () => {
    if (!order) return;
    setBooking(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/book-postex`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName: cityNameInput,
          pickupAddressCode: pickupCodeInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Could not book order on PostEx');
        return;
      }
      toast.success('Order booked on PostEx successfully!');
      loadOrder();
    } catch {
      toast.error('Could not book order on PostEx');
    } finally {
      setBooking(false);
    }
  };

  const handleTrackPostEx = async () => {
    if (!order) return;
    setTrackingLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/track-postex`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Could not track order on PostEx');
        return;
      }
      setTrackingInfo(data);
      if (data.synced) {
        toast.success(`Order status synced from PostEx: ${data.orderStatus}`);
        loadOrder();
      } else {
        toast.success('Tracking details updated');
      }
    } catch {
      toast.error('Could not track order on PostEx');
    } finally {
      setTrackingLoading(false);
    }
  };

  // Auto-track on load if booked
  useEffect(() => {
    if (order) {
      const match = order.notes?.match(/\[PostEx Tracking:\s*(CX-[A-Z0-9]+)\]/i);
      if (match && match[1] && !trackingInfo && !trackingLoading) {
        handleTrackPostEx();
      }
    }
  }, [order, trackingInfo, trackingLoading]);

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2.5,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Link
          href="/admin/orders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            color: '#1773b0',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to orders
        </Link>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                size="small"
                disabled={updating}
                onClick={handleSaveChanges}
                sx={{
                  textTransform: 'none',
                  bgcolor: '#2e7d32',
                  color: '#fff',
                  '&:hover': { bgcolor: '#1b5e20' },
                }}
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                size="small"
                disabled={updating}
                onClick={() => setIsEditing(false)}
                sx={{
                  textTransform: 'none',
                  borderColor: '#707070',
                  color: '#707070',
                  '&:hover': { borderColor: '#404040', bgcolor: '#f5f5f5' },
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                size="small"
                onClick={handleStartEditing}
                sx={{
                  textTransform: 'none',
                  bgcolor: '#354531',
                  color: '#fff',
                  '&:hover': { bgcolor: '#2c3b28' },
                }}
              >
                Edit Details
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleDeleteOrder}
                sx={{
                  textTransform: 'none',
                }}
              >
                Delete Order
              </Button>
            </>
          )}
        </Box>
      </Box>

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

          {/* PostEx Shipping Card */}
          <Paper
            elevation={0}
            sx={{ p: 3, border: '1px solid #e5e5e5', borderRadius: 2, mb: 3 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: order.paymentMethod.toLowerCase() === 'cod' ? '#25d366' : '#d32f2f',
                }}
              />
              PostEx Shipping
            </Typography>

            {order.paymentMethod.toLowerCase() !== 'cod' ? (
              <Typography variant="body2" sx={{ color: '#707070' }}>
                PostEx COD shipping registration is only available for Cash on Delivery (COD) orders.
              </Typography>
            ) : (() => {
              const trackingMatch = order.notes?.match(/\[PostEx Tracking:\s*(CX-[A-Z0-9]+)\]/i);
              const trackingNumber = trackingMatch ? trackingMatch[1] : null;

              if (trackingNumber) {
                return (
                  <Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#707070', display: 'block' }}>
                        Tracking Number
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#354531' }}>
                        {trackingNumber}
                      </Typography>
                    </Box>

                    {trackingInfo?.trackDetails ? (
                      <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f9f9f9', borderRadius: 1, border: '1px solid #eee' }}>
                        <Typography variant="caption" sx={{ color: '#707070', display: 'block' }}>
                          Courier Status
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#e65100', mb: 0.5 }}>
                          {trackingInfo.trackDetails.status}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#555', display: 'block', lineHeight: 1.3 }}>
                          Remarks: {trackingInfo.trackDetails.remarks || 'No remarks available'}
                        </Typography>
                      </Box>
                    ) : trackingLoading ? (
                      <Box sx={{ py: 1.5, display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress size={20} sx={{ color: '#404040' }} />
                      </Box>
                    ) : (
                      <Typography variant="caption" sx={{ color: '#707070', display: 'block', mb: 2 }}>
                        No tracking details loaded yet.
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={trackingLoading}
                        onClick={handleTrackPostEx}
                        sx={{
                          textTransform: 'none',
                          borderColor: '#354531',
                          color: '#354531',
                          '&:hover': { borderColor: '#2c3b28', bgcolor: '#f4f6f3' },
                          flex: 1,
                        }}
                      >
                        {trackingLoading ? 'Syncing...' : 'Sync Status'}
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        href={`https://postex.pk/tracking?trackingNumber=${trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          textTransform: 'none',
                          bgcolor: '#354531',
                          color: '#fff',
                          '&:hover': { bgcolor: '#2c3b28' },
                          flex: 1,
                        }}
                      >
                        Track portal
                      </Button>
                    </Box>
                  </Box>
                );
              }

              return (
                <Box>
                  <Typography variant="body2" sx={{ color: '#707070', mb: 2, lineHeight: 1.4 }}>
                    Book this Cash on Delivery order (PKR {order.totalPkr.toLocaleString()}) on PostEx to generate tracking.
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Delivery City"
                      value={cityNameInput}
                      onChange={(e) => setCityNameInput(e.target.value)}
                      placeholder="e.g. Lahore, Karachi"
                      sx={{ mb: 1.5 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Pickup Code"
                      value={pickupCodeInput}
                      onChange={(e) => setPickupCodeInput(e.target.value)}
                      placeholder="e.g. 001"
                    />
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    disabled={booking || !cityNameInput.trim()}
                    onClick={handleBookPostEx}
                    sx={{
                      textTransform: 'none',
                      bgcolor: '#354531',
                      color: '#fff',
                      py: 1,
                      '&:hover': { bgcolor: '#2c3b28' },
                    }}
                  >
                    {booking ? 'Booking...' : 'Book PostEx COD Shipment'}
                  </Button>
                </Box>
              );
            })()}
          </Paper>

          <Paper
            elevation={0}
            sx={{ p: 3, border: '1px solid #e5e5e5', borderRadius: 2, mb: 3 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Customer
            </Typography>
            {isEditing ? (
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  label="Name"
                  value={editForm.guestName}
                  onChange={(e) => setEditForm({ ...editForm, guestName: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Email"
                  value={editForm.customerEmail}
                  onChange={(e) => setEditForm({ ...editForm, customerEmail: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Phone"
                  value={editForm.guestPhone}
                  onChange={(e) => setEditForm({ ...editForm, guestPhone: e.target.value })}
                  sx={{ mb: 2 }}
                />
              </Box>
            ) : (
              <Box>
                <DetailRow label="Name" value={order.guestName ?? ''} />
                <DetailRow label="Email" value={order.customerEmail || order.guestEmail} />
                <DetailRow
                  label="Phone"
                  value={order.guestPhone ?? order.shippingPhone ?? ''}
                />
              </Box>
            )}
            <DetailRow label="Order ID" value={order.id} />
          </Paper>

          {isEditing ? (
            <Paper
              elevation={0}
              sx={{ p: 3, border: '1px solid #e5e5e5', borderRadius: 2, mb: 3 }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Shipping address
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="Full Name"
                value={editForm.shippingFullName}
                onChange={(e) => setEditForm({ ...editForm, shippingFullName: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                size="small"
                label="Phone"
                value={editForm.shippingPhone}
                onChange={(e) => setEditForm({ ...editForm, shippingPhone: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                size="small"
                label="Address Line 1"
                value={editForm.shippingLine1}
                onChange={(e) => setEditForm({ ...editForm, shippingLine1: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                size="small"
                label="Address Line 2"
                value={editForm.shippingLine2}
                onChange={(e) => setEditForm({ ...editForm, shippingLine2: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                size="small"
                label="City"
                value={editForm.shippingCity}
                onChange={(e) => setEditForm({ ...editForm, shippingCity: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                size="small"
                label="State / Region"
                value={editForm.shippingRegion}
                onChange={(e) => setEditForm({ ...editForm, shippingRegion: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                size="small"
                label="Country Code"
                value={editForm.shippingCountry}
                onChange={(e) => setEditForm({ ...editForm, shippingCountry: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                size="small"
                label="Postal Code"
                value={editForm.shippingPostalCode}
                onChange={(e) => setEditForm({ ...editForm, shippingPostalCode: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Paper>
          ) : (
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
          )}

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
            {isEditing ? (
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  label="Method"
                  value={editForm.paymentMethod}
                  onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Subtotal (PKR)"
                  value={editForm.subtotalPkr}
                  onChange={(e) => setEditForm({ ...editForm, subtotalPkr: Number(e.target.value) })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Discount (PKR)"
                  value={editForm.discountAmountPkr}
                  onChange={(e) => setEditForm({ ...editForm, discountAmountPkr: Number(e.target.value) })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Discount Code"
                  value={editForm.discountCode}
                  onChange={(e) => setEditForm({ ...editForm, discountCode: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Shipping Fee (PKR)"
                  value={editForm.shippingFeePkr}
                  onChange={(e) => setEditForm({ ...editForm, shippingFeePkr: Number(e.target.value) })}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#707070', display: 'block' }}>
                    Calculated Total (PKR)
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {formatPkr(Number(editForm.subtotalPkr) + Number(editForm.shippingFeePkr) - Number(editForm.discountAmountPkr))}
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  label="Notes"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  sx={{ mb: 2 }}
                />
              </Box>
            ) : (
              <Box>
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
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </AdminShell>
  );
}
