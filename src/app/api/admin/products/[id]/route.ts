import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/src/lib/admin/auth';
import { createAdminDataSupabase } from '@/src/lib/supabase/admin-data-client';
import { createAnonSupabase } from '@/src/lib/supabase/service';
import { getAdminOrdersAccessKey } from '@/src/lib/admin/orders-access-key';

function useServiceRoleForAdmin(): boolean {
  return Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const productId = params.id;
  if (!productId) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const {
      product_name,
      procuct_price,
      product_category,
      product_description,
      product_color,
      product_size,
      product_img,
      product_bestsellere,
      product_new,
      stock_quantity,
      low_stock_threshold,
      sku,
    } = body;

    let rawProduct: any = null;

    if (useServiceRoleForAdmin()) {
      const supabase = createAdminDataSupabase();
      
      const dbUpdates: any = {};
      if (product_name !== undefined) dbUpdates.name = product_name;
      if (procuct_price !== undefined) dbUpdates.price = Number(procuct_price) || 0;
      if (product_category !== undefined) dbUpdates.category = product_category;
      if (product_description !== undefined) dbUpdates.description = product_description;
      if (product_color !== undefined) dbUpdates.color = JSON.stringify(product_color);
      if (product_size !== undefined) dbUpdates.size = JSON.stringify(product_size);
      if (product_img !== undefined) dbUpdates.img = JSON.stringify(product_img);
      if (stock_quantity !== undefined) dbUpdates.instock = Number(stock_quantity) > 0;
      if (product_bestsellere !== undefined) dbUpdates.bestsellere = Boolean(product_bestsellere);
      if (product_new !== undefined) dbUpdates.new = Boolean(product_new);

      const { data, error: productError } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', productId)
        .select()
        .single();

      if (productError) throw productError;
      rawProduct = data;
    } else {
      // RPC Fallback
      const supabase = createAnonSupabase();
      const accessKey = getAdminOrdersAccessKey();

      const updates: Record<string, unknown> = {};
      if (product_name !== undefined) updates.product_name = product_name;
      if (procuct_price !== undefined) updates.procuct_price = procuct_price;
      if (product_category !== undefined) updates.product_category = product_category;
      if (product_description !== undefined) updates.product_description = product_description;
      if (product_color !== undefined) updates.product_color = product_color;
      if (product_size !== undefined) updates.product_size = product_size;
      if (product_img !== undefined) updates.product_img = product_img;
      if (stock_quantity !== undefined) updates.product_instock = Number(stock_quantity) > 0;
      if (product_bestsellere !== undefined) updates.product_bestsellere = product_bestsellere;
      if (product_new !== undefined) updates.product_new = product_new;

      const { data, error: rpcError } = await supabase.rpc('admin_update_product_rpc', {
        access_key: accessKey,
        p_id: productId,
        p_updates: updates as any,
      });

      if (rpcError) throw rpcError;
      rawProduct = data;
    }

    // Map returning database product to frontend structure
    const product = {
      id: rawProduct.id,
      product_name: rawProduct.name || '',
      procuct_price: String(rawProduct.price ?? '0'),
      product_category: rawProduct.category || '',
      product_description: rawProduct.description || '',
      product_color: typeof rawProduct.color === 'string' ? JSON.parse(rawProduct.color) : (rawProduct.color || []),
      product_size: typeof rawProduct.size === 'string' ? JSON.parse(rawProduct.size) : (rawProduct.size || []),
      product_img: typeof rawProduct.img === 'string' ? JSON.parse(rawProduct.img) : (rawProduct.img || []),
      product_instock: Boolean(rawProduct.instock),
      product_bestsellere: Boolean(rawProduct.bestsellere),
      product_new: Boolean(rawProduct.new),
    };

    // 2. Update inventory if provided (using UUID product_id)
    let inventory = null;
    const supabaseInventory = useServiceRoleForAdmin() ? createAdminDataSupabase() : createAnonSupabase();
    
    if (stock_quantity !== undefined || low_stock_threshold !== undefined || sku !== undefined) {
      const updates: Record<string, unknown> = {};
      if (stock_quantity !== undefined) updates.stock_quantity = Number(stock_quantity);
      if (low_stock_threshold !== undefined) updates.low_stock_threshold = Number(low_stock_threshold);
      if (sku !== undefined) updates.sku = sku || `SKU-${productId}`;

      const { data: invData, error: invError } = await supabaseInventory
        .from('inventory')
        .upsert({
          product_id: productId,
          ...updates,
        })
        .select()
        .single();

      if (invError) {
        console.error('Failed to update inventory during product update:', invError);
      } else {
        inventory = invData;
      }
    }

    // If inventory wasn't updated in this request, fetch existing inventory
    if (!inventory) {
      const { data: invData } = await supabaseInventory
        .from('inventory')
        .select('*')
        .eq('product_id', productId)
        .maybeSingle();
      inventory = invData;
    }

    return NextResponse.json({
      product: {
        ...product,
        inventory: inventory || {
          stock_quantity: product.product_instock ? 10 : 0,
          low_stock_threshold: 5,
          sku: `SKU-${productId}`,
        },
      },
    });
  } catch (err) {
    console.error(`PUT /api/admin/products/${params.id}:`, err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const productId = params.id;
  if (!productId) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    if (useServiceRoleForAdmin()) {
      const supabase = createAdminDataSupabase();
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
    } else {
      // RPC Fallback
      const supabase = createAnonSupabase();
      const accessKey = getAdminOrdersAccessKey();
      
      const { error: rpcError } = await supabase.rpc('admin_delete_product_rpc', {
        access_key: accessKey,
        p_id: productId,
      });

      if (rpcError) throw rpcError;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/admin/products/${params.id}:`, err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete product' },
      { status: 500 }
    );
  }
}
