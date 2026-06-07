'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  CircularProgress,
  Paper,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

import AdminShell from '@/src/components/admin/AdminShell';
import StatusChip from '@/src/components/admin/StatusChip';
import { formatDate, formatPkr } from '@/src/components/admin/formatPkr';
import { brand, fonts } from '@/src/lib/designTokens';
import { AdminOrder } from '@/src/types/adminOrder';

interface TopProduct {
  id: string;
  title: string;
  count: number;
  revenue: number;
  imageUrl?: string;
}

interface CategoryCount {
  name: string;
  count: number;
}

interface OverviewMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalProducts: number;
}

interface RevenueDay {
  date: string;
  revenue: number;
  orders: number;
}

interface OverviewData {
  metrics: OverviewMetrics;
  statusBreakdown: Record<string, number>;
  recentOrders: AdminOrder[];
  revenueByDate: RevenueDay[];
  categoryBreakdown: CategoryCount[];
  topProducts: TopProduct[];
}

export default function AdminOverviewPage() {
  const router = useRouter();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [configError, setConfigError] = useState('');
  const [activeChart, setActiveChart] = useState<'revenue' | 'orders'>('revenue');

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError('');
    setConfigError('');
    try {
      const res = await fetch('/api/admin/overview');
      const resData = await res.json();
      if (!res.ok) {
        if (resData.code === 'MISSING_SERVICE_ROLE') {
          setConfigError(resData.error ?? 'Admin database access is not configured.');
        } else {
          setError(resData.error ?? 'Could not load overview stats');
        }
        return;
      }
      setData(resData);
    } catch {
      setError('Could not load overview stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  function formatChartDate(dateStr: string) {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  // Render SVG Sparkline Chart
  const renderRevenueChart = (revenueData: RevenueDay[]) => {
    if (!revenueData || revenueData.length === 0) return null;

    const chartWidth = 600;
    const chartHeight = 220;
    const padding = 30;

    const maxRevenue = Math.max(...revenueData.map((d) => d.revenue), 10000);
    const usableWidth = chartWidth - padding * 2;
    const usableHeight = chartHeight - padding * 2;

    const points = revenueData.map((day, idx) => {
      const x = padding + (idx / (revenueData.length - 1)) * usableWidth;
      const y = chartHeight - padding - (day.revenue / maxRevenue) * usableHeight;
      return { x, y, date: day.date, revenue: day.revenue };
    });

    const pathD = points.reduce(
      (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
      ''
    );

    const areaD = points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
      : '';

    return (
      <Box sx={{ width: '100%', overflowX: 'auto', py: 1 }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          width="100%"
          height={chartHeight}
          style={{ minWidth: 500 }}
        >
          <defs>
            <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={brand.sage} stopOpacity="0.25" />
              <stop offset="100%" stopColor={brand.sage} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={padding}
            y1={padding}
            x2={chartWidth - padding}
            y2={padding}
            stroke="#f0f0f0"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={padding + usableHeight / 2}
            x2={chartWidth - padding}
            y2={padding + usableHeight / 2}
            stroke="#f0f0f0"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke="#e0e0e0"
            strokeWidth={1}
          />

          {/* Area Fill */}
          <path d={areaD} fill="url(#chartAreaGradient)" />

          {/* Sparkline Line */}
          <path
            d={pathD}
            fill="none"
            stroke={brand.sage}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive dots and values */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r={4}
                fill={brand.white}
                stroke={brand.sage}
                strokeWidth={2.5}
                style={{ cursor: 'pointer' }}
              />
              {p.revenue > 0 && (
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  fontSize="9px"
                  fontWeight="600"
                  fill={brand.charcoal}
                >
                  {formatPkr(p.revenue).replace('Rs. ', '')}
                </text>
              )}
              {/* Date label */}
              <text
                x={p.x}
                y={chartHeight - 10}
                textAnchor="middle"
                fontSize="9px"
                fontWeight="500"
                fill={brand.muted}
              >
                {formatChartDate(p.date)}
              </text>
            </g>
          ))}
        </svg>
      </Box>
    );
  };

  // Render SVG Bar Chart for Orders Volume
  const renderOrdersChart = (revenueData: RevenueDay[]) => {
    if (!revenueData || revenueData.length === 0) return null;

    const chartWidth = 600;
    const chartHeight = 220;
    const padding = 30;

    const maxOrders = Math.max(...revenueData.map((d) => d.orders), 5);
    const usableWidth = chartWidth - padding * 2;
    const usableHeight = chartHeight - padding * 2;

    const barWidth = (usableWidth / revenueData.length) * 0.6;
    const spacing = (usableWidth / revenueData.length) * 0.4;

    return (
      <Box sx={{ width: '100%', overflowX: 'auto', py: 1 }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          width="100%"
          height={chartHeight}
          style={{ minWidth: 500 }}
        >
          {/* Grid lines */}
          <line
            x1={padding}
            y1={padding}
            x2={chartWidth - padding}
            y2={padding}
            stroke="#f0f0f0"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={padding + usableHeight / 2}
            x2={chartWidth - padding}
            y2={padding + usableHeight / 2}
            stroke="#f0f0f0"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke="#e0e0e0"
            strokeWidth={1}
          />

          {/* Bars */}
          {revenueData.map((day, idx) => {
            const x = padding + idx * (barWidth + spacing) + spacing / 2;
            const barHeight = (day.orders / maxOrders) * usableHeight;
            const y = chartHeight - padding - barHeight;

            return (
              <g key={idx}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 2)}
                  fill={brand.sageLight}
                  rx={3}
                  style={{ transition: 'all 0.3s', cursor: 'pointer' }}
                />

                {/* Orders Count Text */}
                {day.orders > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize="9px"
                    fontWeight="700"
                    fill={brand.charcoal}
                  >
                    {day.orders}
                  </text>
                )}

                {/* Date Label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fontSize="9px"
                  fontWeight="500"
                  fill={brand.muted}
                >
                  {formatChartDate(day.date)}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>
    );
  };

  return (
    <AdminShell title="Dashboard">
      {loading ? (
        <Box sx={{ py: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
          <CircularProgress size={40} sx={{ color: brand.sage }} />
          <Typography variant="body2" sx={{ color: brand.muted, fontFamily: fonts.sans }}>
            Loading dashboard data...
          </Typography>
        </Box>
      ) : configError ? (
        <Box sx={{ p: 4, bgcolor: '#fff', border: '1px solid #e5e5e5', borderRadius: 2 }}>
          <Typography sx={{ color: '#c62828', mb: 1, fontWeight: 600 }}>{configError}</Typography>
          <Typography variant="body2" sx={{ color: '#707070' }}>
            Supabase Dashboard → Project Settings → API → copy the{' '}
            <strong>service_role</strong> key into{' '}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> in <code>.env.local</code>, then restart{' '}
            <code>npm run dev</code>.
          </Typography>
        </Box>
      ) : error ? (
        <Paper elevation={0} sx={{ p: 4, border: '1px solid #ffcdd2', bgcolor: '#ffebee', borderRadius: 2 }}>
          <Typography sx={{ color: '#c62828', fontWeight: 600 }}>{error}</Typography>
          <Button onClick={loadOverview} size="small" variant="outlined" sx={{ mt: 2, borderColor: '#c62828', color: '#c62828', '&:hover': { bgcolor: '#ffebee' } }}>
            Try Again
          </Button>
        </Paper>
      ) : !data ? null : (
        <Box>
          {/* Welcome Banner */}
          <Box
            sx={{
              p: 3,
              mb: 4,
              borderRadius: '8px',
              background: `linear-gradient(135deg, ${brand.sage} 0%, ${brand.sageLight} 100%)`,
              color: brand.white,
              boxShadow: '0 4px 20px rgba(90, 109, 87, 0.15)',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: fonts.display, mb: 0.5 }}>
              Welcome back to Bustaniya Admin
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontFamily: fonts.sans, fontWeight: 300 }}>
              Here's a quick summary of your store's performance and inventory status.
            </Typography>
          </Box>

          {/* Metrics Row */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Revenue */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid #e5e5e5',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: brand.sage,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: 'rgba(90, 109, 87, 0.08)', color: brand.sage }}>
                  <MonetizationOnOutlinedIcon sx={{ fontSize: '1.75rem' }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: brand.muted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: brand.ink, mt: 0.25 }}>
                    {formatPkr(data.metrics.totalRevenue)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Orders */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid #e5e5e5',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: brand.sage,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: 'rgba(90, 109, 87, 0.08)', color: brand.sage }}>
                  <ShoppingBagOutlinedIcon sx={{ fontSize: '1.75rem' }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: brand.muted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Orders
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: brand.ink, mt: 0.25 }}>
                    {data.metrics.totalOrders}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Average Order Value */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid #e5e5e5',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: brand.sage,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: 'rgba(90, 109, 87, 0.08)', color: brand.sage }}>
                  <BarChartOutlinedIcon sx={{ fontSize: '1.75rem' }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: brand.muted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Avg. Order Value
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: brand.ink, mt: 0.25 }}>
                    {formatPkr(data.metrics.averageOrderValue)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Products */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid #e5e5e5',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: brand.sage,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: 'rgba(90, 109, 87, 0.08)', color: brand.sage }}>
                  <Inventory2OutlinedIcon sx={{ fontSize: '1.75rem' }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: brand.muted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Items
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: brand.ink, mt: 0.25 }}>
                    {data.metrics.totalProducts}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Visuals Row */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Chart */}
            <Grid item xs={12} lg={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid #e5e5e5',
                  borderRadius: 2,
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brand.ink }}>
                      {activeChart === 'revenue' ? 'Revenue Trend (Last 7 Days)' : 'Order Volume Trend (Last 7 Days)'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: brand.muted }}>
                      {activeChart === 'revenue' ? 'Daily orders sales performance' : 'Daily volume of incoming orders'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, bgcolor: '#f4f4f5', p: 0.5, borderRadius: '6px' }}>
                    <Button
                      size="small"
                      onClick={() => setActiveChart('revenue')}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '4px',
                        color: activeChart === 'revenue' ? '#fff' : brand.charcoal,
                        bgcolor: activeChart === 'revenue' ? brand.sage : 'transparent',
                        minWidth: 'auto',
                        lineHeight: 1.2,
                        '&:hover': { bgcolor: activeChart === 'revenue' ? brand.sage : 'rgba(0,0,0,0.05)' },
                      }}
                    >
                      Revenue
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setActiveChart('orders')}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '4px',
                        color: activeChart === 'orders' ? '#fff' : brand.charcoal,
                        bgcolor: activeChart === 'orders' ? brand.sage : 'transparent',
                        minWidth: 'auto',
                        lineHeight: 1.2,
                        '&:hover': { bgcolor: activeChart === 'orders' ? brand.sage : 'rgba(0,0,0,0.05)' },
                      }}
                    >
                      Orders
                    </Button>
                  </Box>
                </Box>
                {data.revenueByDate.length > 0 ? (
                  activeChart === 'revenue' ? renderRevenueChart(data.revenueByDate) : renderOrdersChart(data.revenueByDate)
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <Typography variant="body2" sx={{ color: brand.muted }}>
                      No data recorded for the past week.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Status breakdown & Quick actions */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                {/* Status Breakdown */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: '1px solid #e5e5e5',
                    borderRadius: 2,
                    flexGrow: 1,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brand.ink, mb: 2.5 }}>
                    Order Status Overview
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Object.entries(data.statusBreakdown).map(([status, count]) => {
                      const total = data.metrics.totalOrders || 1;
                      const percentage = Math.round((count / total) * 100);
                      
                      // Progress bar color based on status
                      let barColor: string = brand.sage;
                      if (status === 'pending') barColor = '#f59e0b';
                      if (status === 'processing') barColor = '#3b82f6';
                      if (status === 'shipped') barColor = '#6366f1';
                      if (status === 'delivered') barColor = '#10b981';
                      if (status === 'cancelled') barColor = '#ef4444';

                      return (
                        <Box key={status}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 600, color: brand.charcoal, fontSize: '0.8125rem' }}>
                              {status}
                            </Typography>
                            <Typography variant="caption" sx={{ color: brand.muted, fontWeight: 700 }}>
                              {count} ({percentage}%)
                            </Typography>
                          </Box>
                          <Box sx={{ width: '100%', height: 6, bgcolor: '#f4f4f5', borderRadius: 3, overflow: 'hidden' }}>
                            <Box sx={{ width: `${percentage}%`, height: '100%', bgcolor: barColor, borderRadius: 3 }} />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>

                {/* Quick actions */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: '1px solid #e5e5e5',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brand.ink, mb: 2 }}>
                    Quick Management Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Button
                      component={Link}
                      href="/admin/products?add=true"
                      variant="contained"
                      fullWidth
                      startIcon={<AddCircleOutlineIcon />}
                      sx={{
                        textTransform: 'none',
                        bgcolor: brand.sage,
                        fontFamily: fonts.sans,
                        fontWeight: 600,
                        '&:hover': { bgcolor: brand.sageLight },
                      }}
                    >
                      Add New Product
                    </Button>
                    <Button
                      component={Link}
                      href="/admin/orders"
                      variant="outlined"
                      fullWidth
                      startIcon={<VisibilityOutlinedIcon />}
                      sx={{
                        textTransform: 'none',
                        borderColor: '#e5e5e5',
                        color: brand.charcoal,
                        fontFamily: fonts.sans,
                        fontWeight: 500,
                        '&:hover': { borderColor: brand.sage, color: brand.sage, bgcolor: 'rgba(90, 109, 87, 0.02)' },
                      }}
                    >
                      Manage All Orders
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>

          {/* Top Products & Category Breakdown Row */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Top Products Card */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid #e5e5e5',
                  borderRadius: 2,
                  height: '100%',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brand.ink, mb: 2 }}>
                  Top Selling Products
                </Typography>
                {!data.topProducts || data.topProducts.length === 0 ? (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography sx={{ color: brand.muted, fontSize: '0.875rem' }}>
                      No items sold yet.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {data.topProducts.map((product, idx) => (
                      <Box
                        key={product.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          pb: 1.5,
                          borderBottom: idx === data.topProducts.length - 1 ? 'none' : '1px solid #eaeaea',
                        }}
                      >
                        <Box
                          sx={{
                            width: 44,
                            height: 54,
                            borderRadius: '4px',
                            overflow: 'hidden',
                            position: 'relative',
                            border: '1px solid #eaeaea',
                            bgcolor: '#f9f9f9',
                            flexShrink: 0,
                          }}
                        >
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Box sx={{ width: '100%', height: '100%', bgcolor: '#eee' }} />
                          )}
                        </Box>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography noWrap sx={{ fontSize: '0.875rem', fontWeight: 600, color: brand.ink, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {product.title}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: brand.muted, mt: 0.25 }}>
                            {product.count} sales
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: brand.sage }}>
                          {formatPkr(product.revenue)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Category Inventory Breakdown Card */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid #e5e5e5',
                  borderRadius: 2,
                  height: '100%',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brand.ink, mb: 2 }}>
                  Category Inventory Breakdown
                </Typography>
                {!data.categoryBreakdown || data.categoryBreakdown.length === 0 ? (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography sx={{ color: brand.muted, fontSize: '0.875rem' }}>
                      No categories found.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {data.categoryBreakdown.map((cat, idx) => {
                      const totalProducts = data.metrics.totalProducts || 1;
                      const percentage = Math.round((cat.count / totalProducts) * 100);
                      
                      const colors = [brand.sage, '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
                      const barColor = colors[idx % colors.length];

                      return (
                        <Box key={cat.name}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: brand.charcoal, textTransform: 'capitalize' }}>
                              {cat.name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: brand.muted }}>
                              {cat.count} items ({percentage}%)
                            </Typography>
                          </Box>
                          <Box sx={{ width: '100%', height: 7, bgcolor: '#f1f5f9', borderRadius: 3.5, overflow: 'hidden' }}>
                            <Box sx={{ width: `${percentage}%`, height: '100%', bgcolor: barColor, borderRadius: 3.5 }} />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Orders List */}
          <Paper
            elevation={0}
            sx={{ border: '1px solid #e5e5e5', borderRadius: 2, overflow: 'hidden' }}
          >
            <Box
              sx={{
                px: 3,
                py: 2.5,
                borderBottom: '1px solid #e5e5e5',
                bgcolor: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brand.ink }}>
                  Recent Activity
                </Typography>
                <Typography variant="caption" sx={{ color: brand.muted }}>
                  The most recently placed customer orders
                </Typography>
              </Box>
              <Button
                component={Link}
                href="/admin/orders"
                size="small"
                endIcon={<KeyboardArrowRightOutlinedIcon />}
                sx={{ textTransform: 'none', color: brand.sage, fontWeight: 600 }}
              >
                View all orders
              </Button>
            </Box>

            {data.recentOrders.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography sx={{ color: brand.muted, fontSize: '0.875rem' }}>
                  No orders recorded yet.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                      <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Order #</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">Items</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Total</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.recentOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        hover
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                        sx={{
                          cursor: 'pointer',
                          '&:last-child td': { borderBottom: 0 },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600, color: '#1773b0', py: 1.5 }}>
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          {order.guestName || order.shippingFullName || '—'}
                        </TableCell>
                        <TableCell align="center">
                          {order.items.reduce((n, i) => n + i.quantity, 0)}
                        </TableCell>
                        <TableCell>
                          <StatusChip status={order.status} />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500 }}>
                          {formatPkr(order.totalPkr)}
                        </TableCell>
                        <TableCell sx={{ color: brand.muted, whiteSpace: 'nowrap' }}>
                          {formatDate(order.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      )}
    </AdminShell>
  );
}
