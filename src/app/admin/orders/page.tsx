'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminShell from '@/src/components/admin/AdminShell';
import StatusChip from '@/src/components/admin/StatusChip';
import { formatDate, formatPkr } from '@/src/components/admin/formatPkr';
import { AdminOrder } from '@/src/types/adminOrder';
import { brand, radius } from '@/src/lib/designTokens';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [configError, setConfigError] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    setConfigError('');
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (!res.ok) {
        if (data.code === 'MISSING_SERVICE_ROLE') {
          setConfigError(data.error ?? 'Admin database access is not configured.');
        } else {
          setError(data.error ?? 'Could not load orders');
        }
        return;
      }
      setOrders(data.orders ?? []);
    } catch {
      setError('Could not load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <AdminShell title="Orders">
      <Paper
        elevation={0}
        sx={{ border: '1px solid #e5e5e5', borderRadius: 2, overflow: 'hidden' }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: '1px solid #e5e5e5',
            bgcolor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              All orders
            </Typography>
            <Typography variant="body2" sx={{ color: '#707070' }}>
              {orders.length} order{orders.length === 1 ? '' : 's'} total
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/orders/add')}
            sx={{
              textTransform: 'none',
              bgcolor: brand.sage,
              fontWeight: 600,
              fontSize: '0.875rem',
              borderRadius: radius.button || 1.5,
              '&:hover': { bgcolor: brand.sageLight || '#465544' },
            }}
          >
            Add Custom Order
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={32} sx={{ color: '#404040' }} />
          </Box>
        ) : configError ? (
          <Box sx={{ p: 4 }}>
            <Typography sx={{ color: '#c62828', mb: 1 }}>{configError}</Typography>
            <Typography variant="body2" sx={{ color: '#707070' }}>
              Supabase Dashboard → Project Settings → API → copy the{' '}
              <strong>service_role</strong> key into{' '}
              <code>SUPABASE_SERVICE_ROLE_KEY</code> in <code>.env.local</code>, then restart{' '}
              <code>npm run dev</code>.
            </Typography>
          </Box>
        ) : error ? (
          <Typography sx={{ p: 4, color: '#c62828' }}>{error}</Typography>
        ) : orders.length === 0 ? (
          <Typography sx={{ p: 4, color: '#707070' }}>
            No orders yet. Orders appear here after customers check out.
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Order #</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Items
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Total
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    sx={{
                      cursor: 'pointer',
                      '&:last-child td': { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500, color: '#1773b0' }}>
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      {order.guestName || order.shippingFullName || '—'}
                    </TableCell>
                    <TableCell>
                      {order.guestPhone || order.shippingPhone || '—'}
                    </TableCell>
                    <TableCell>{order.customerEmail || order.guestEmail}</TableCell>
                    <TableCell align="center">
                      {order.items.reduce((n, i) => n + i.quantity, 0)}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={order.status} />
                    </TableCell>
                    <TableCell align="right">{formatPkr(order.totalPkr)}</TableCell>
                    <TableCell sx={{ color: '#707070', whiteSpace: 'nowrap' }}>
                      {formatDate(order.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </AdminShell>
  );
}
