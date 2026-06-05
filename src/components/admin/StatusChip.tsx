'use client';

import { Chip } from '@mui/material';
import { ORDER_STATUS_LABELS, OrderStatus } from '@/src/types/adminOrder';

const STATUS_COLORS: Record<
  OrderStatus,
  { bg: string; color: string }
> = {
  pending: { bg: '#fff8e6', color: '#8a6d00' },
  processing: { bg: '#e8f4fd', color: '#1565a8' },
  shipped: { bg: '#ede7f6', color: '#5e35b1' },
  delivered: { bg: '#e8f5e9', color: '#2e7d32' },
  cancelled: { bg: '#fce8e8', color: '#c62828' },
};

export default function StatusChip({ status }: { status: OrderStatus }) {
  const colors = STATUS_COLORS[status];
  return (
    <Chip
      label={ORDER_STATUS_LABELS[status]}
      size="small"
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        fontSize: '0.75rem',
        height: 24,
      }}
    />
  );
}
