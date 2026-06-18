import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/src/lib/admin/auth';
import { createAdminDataSupabase } from '@/src/lib/supabase/admin-data-client';
import { createAnonSupabase, createCatalogSupabase } from '@/src/lib/supabase/service';
import { getAdminOrdersAccessKey } from '@/src/lib/admin/orders-access-key';

function useServiceRoleForAdmin(): boolean {
  return Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = useServiceRoleForAdmin()
      ? createAdminDataSupabase()
      : createCatalogSupabase();

    // 1. Fetch all stock entries
    const { data: stockEntries, error: stockErr } = await supabase
      .from('stock_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (stockErr) throw stockErr;

    // 2. Fetch all products with stock_id
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('id, name, stock_id')
      .not('stock_id', 'is', null);

    if (prodErr) throw prodErr;

    // 3. Fetch inventory stock quantities for all products
    const { data: inventory, error: invErr } = await supabase
      .from('inventory')
      .select('product_id, stock_quantity');

    if (invErr) throw invErr;

    // Map inventory stock quantity by product ID
    const stockQtyMap: Record<string, number> = {};
    (inventory || []).forEach((item: any) => {
      stockQtyMap[item.product_id] = item.stock_quantity ?? 0;
    });

    // 4. Fetch all order items and their parent order statuses
    const { data: orderItems, error: itemsErr } = await supabase
      .from('order_items')
      .select('product_id, line_total_pkr, order_id');

    if (itemsErr) throw itemsErr;

    const { data: orders, error: ordersErr } = await supabase
      .from('orders')
      .select('id, status');

    if (ordersErr) throw ordersErr;

    // Map order status by order ID
    const orderStatusMap: Record<string, string> = {};
    (orders || []).forEach((o: any) => {
      orderStatusMap[o.id] = o.status;
    });

    // Calculate revenue per product ID (excluding cancelled orders)
    const productRevenueMap: Record<string, number> = {};
    (orderItems || []).forEach((item: any) => {
      const status = orderStatusMap[item.order_id];
      if (status !== 'cancelled') {
        productRevenueMap[item.product_id] = (productRevenueMap[item.product_id] || 0) + (item.line_total_pkr || 0);
      }
    });

    // 5. Calculate statistics for each stock entry
    const enrichedStockEntries = (stockEntries || []).map((entry: any) => {
      const expensesList = Array.isArray(entry.expenses) ? entry.expenses : [];
      const totalExpense = expensesList.reduce((sum: number, exp: any) => sum + Number(exp.amount || 0), 0);

      // Find products linked to this stock entry
      const linkedProducts = (products || []).filter((p: any) => p.stock_id === entry.id);

      let isSoldOut = false;
      let totalRevenue = 0;
      let netProfit = 0;

      if (linkedProducts.length > 0) {
        // Sold out if ALL linked products have stock_quantity <= 0
        isSoldOut = linkedProducts.every((p: any) => (stockQtyMap[p.id] ?? 0) <= 0);

        // Calculate revenue only for the products of this stock
        linkedProducts.forEach((p: any) => {
          totalRevenue += productRevenueMap[p.id] || 0;
        });

        netProfit = totalRevenue - totalExpense;
      }

      return {
        ...entry,
        totalExpense,
        linkedProductsCount: linkedProducts.length,
        linkedProducts: linkedProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          stockQuantity: stockQtyMap[p.id] ?? 0,
        })),
        isSoldOut,
        totalRevenue,
        netProfit,
      };
    });

    return NextResponse.json({ success: true, stockEntries: enrichedStockEntries });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, description, expenses } = await req.json();

    if (!id || !id.trim()) {
      return NextResponse.json({ error: 'Stock ID is required' }, { status: 400 });
    }

    const supabase = useServiceRoleForAdmin()
      ? createAdminDataSupabase()
      : createCatalogSupabase();

    // Check if ID already exists
    const { data: existing } = await supabase
      .from('stock_entries')
      .select('id')
      .eq('id', id.trim())
      .single();

    if (existing) {
      return NextResponse.json({ error: `Stock Entry with ID "${id.trim()}" already exists` }, { status: 400 });
    }

    let resultData: any;
    if (useServiceRoleForAdmin()) {
      const { data, error } = await supabase
        .from('stock_entries')
        .insert({
          id: id.trim(),
          description: description || null,
          expenses: Array.isArray(expenses) ? expenses : [],
        })
        .select();

      if (error) throw error;
      resultData = data[0];
    } else {
      const anonSupabase = createAnonSupabase();
      const accessKey = getAdminOrdersAccessKey();
      const { data, error } = await anonSupabase.rpc('admin_insert_stock_entry_rpc', {
        access_key: accessKey,
        p_id: id.trim(),
        p_description: description || null,
        p_expenses: Array.isArray(expenses) ? expenses : [],
      });

      if (error) throw error;
      resultData = data;
    }

    return NextResponse.json({ success: true, stockEntry: resultData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create stock entry' }, { status: 500 });
  }
}
