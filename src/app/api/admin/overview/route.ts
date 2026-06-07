import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/src/lib/admin/auth';
import { AdminSupabaseConfigError } from '@/src/lib/supabase/admin-data-client';
import { listSupabaseOrders } from '@/src/lib/orders/supabase-store';
import { createCatalogSupabase } from '@/src/lib/supabase/service';
import { mapDbProduct } from '@/src/lib/products/mapDbProduct';

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch Orders
    const orders = await listSupabaseOrders();

    // 2. Fetch Products
    const catalogSupabase = createCatalogSupabase();
    const { data: dbProducts, error: prodError } = await catalogSupabase
      .from('products')
      .select('*');

    if (prodError) throw prodError;
    const products = (dbProducts ?? []).map(mapDbProduct);

    // 3. Compute Metrics
    const totalOrders = orders.length;
    // Only calculate revenue for non-cancelled orders
    const nonCancelledOrders = orders.filter(o => o.status !== 'cancelled');
    const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + (o.totalPkr ?? 0), 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const totalProducts = products.length;

    // Status breakdown
    const statusBreakdown: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((o) => {
      const status = (o.status || 'pending').toLowerCase();
      if (status in statusBreakdown) {
        statusBreakdown[status]++;
      } else {
        statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
      }
    });

    // Recent 5 orders
    const recentOrders = orders.slice(0, 5);

    // Revenue by date (last 7 days of orders or similar)
    // Group by date formatted as YYYY-MM-DD
    const revenueByDateMap = new Map<string, { revenue: number; orders: number }>();
    
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      revenueByDateMap.set(dateStr, { revenue: 0, orders: 0 });
    }

    orders.forEach((o) => {
      if (!o.createdAt) return;
      const dateStr = o.createdAt.split('T')[0];
      if (revenueByDateMap.has(dateStr)) {
        const current = revenueByDateMap.get(dateStr)!;
        revenueByDateMap.set(dateStr, {
          revenue: current.revenue + (o.status !== 'cancelled' ? (o.totalPkr ?? 0) : 0),
          orders: current.orders + 1,
        });
      }
    });

    const revenueByDate = Array.from(revenueByDateMap.entries()).map(([date, val]) => ({
      date,
      revenue: val.revenue,
      orders: val.orders,
    }));

    // 5. Category breakdown
    const categoryMap: Record<string, number> = {};
    products.forEach((p) => {
      const cat = p.product_category || 'Uncategorized';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const categoryBreakdown = Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count,
    }));

    // 6. Top Selling Products
    const productSalesMap = new Map<string, { id: string; title: string; count: number; revenue: number; imageUrl?: string }>();
    orders.forEach((o) => {
      if (o.status === 'cancelled') return;
      o.items.forEach((item) => {
        const prodId = String(item.id || item.title);
        const current = productSalesMap.get(prodId) || {
          id: prodId,
          title: item.title,
          count: 0,
          revenue: 0,
          imageUrl: item.imageUrl ?? undefined,
        };
        current.count += item.quantity || 1;
        current.revenue += (item.lineTotalPkr ?? 0);
        productSalesMap.set(prodId, current);
      });
    });
    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      metrics: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        totalProducts,
      },
      statusBreakdown,
      recentOrders,
      revenueByDate,
      categoryBreakdown,
      topProducts,
    });
  } catch (err) {
    console.error('GET /api/admin/overview:', err);
    if (err instanceof AdminSupabaseConfigError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: 'Could not load overview stats' }, { status: 500 });
  }
}
