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

    // Fetch products
    const { data: dbProducts, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (productsError) {
      throw productsError;
    }

    // Fetch inventory
    const { data: inventory, error: inventoryError } = await supabase
      .from('inventory')
      .select('*');

    if (inventoryError) {
      throw inventoryError;
    }

    // Map database products to the format expected by the frontend
    const products = (dbProducts ?? []).map((p: any) => ({
      id: p.id,
      product_name: p.name || '',
      procuct_price: String(p.price ?? '0'),
      product_category: p.category || '',
      product_description: p.description || '',
      product_color: typeof p.color === 'string' ? JSON.parse(p.color) : (p.color || []),
      product_size: typeof p.size === 'string' ? JSON.parse(p.size) : (p.size || []),
      product_img: typeof p.img === 'string' ? JSON.parse(p.img) : (p.img || []),
      product_instock: Boolean(p.instock),
      product_bestsellere: Boolean(p.bestsellere),
      product_new: Boolean(p.new),
    }));

    // Combine products with inventory
    const combined = products.map((p) => {
      const inv = (inventory ?? []).find((i) => i.product_id === p.id);
      return {
        ...p,
        inventory: inv || {
          stock_quantity: p.product_instock ? 10 : 0,
          low_stock_threshold: 5,
          sku: `SKU-${p.id}`,
        },
      };
    });

    return NextResponse.json({ products: combined });
  } catch (err) {
    console.error('GET /api/admin/products:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      stock_quantity = 0,
      low_stock_threshold = 5,
      sku,
    } = body;

    if (!product_name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    let rawProduct: any = null;

    if (useServiceRoleForAdmin()) {
      const supabase = createAdminDataSupabase();
      
      const { data, error: productError } = await supabase
        .from('products')
        .insert({
          name: product_name,
          price: Number(procuct_price) || 0,
          category: product_category || '',
          description: product_description || '',
          color: JSON.stringify(product_color || []),
          size: JSON.stringify(product_size || []),
          img: JSON.stringify(product_img || []),
          instock: stock_quantity > 0,
          bestsellere: Boolean(product_bestsellere),
          new: Boolean(product_new),
        })
        .select()
        .single();

      if (productError) throw productError;
      rawProduct = data;
    } else {
      // RPC Fallback
      const supabase = createAnonSupabase();
      const accessKey = getAdminOrdersAccessKey();
      
      const { data, error: rpcError } = await supabase.rpc('admin_insert_product_rpc', {
        access_key: accessKey,
        p_name: product_name,
        p_price: procuct_price || '0',
        p_category: product_category || '',
        p_description: product_description || '',
        p_color: product_color || [],
        p_size: product_size || [],
        p_img: product_img || [],
        p_instock: stock_quantity > 0,
        p_bestsellere: Boolean(product_bestsellere),
        p_new: Boolean(product_new),
      });

      if (rpcError) throw rpcError;
      rawProduct = data;
    }

    // Map returning product back to frontend structure
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

    const finalSku = sku || `SKU-${product.id}`;

    // Update the auto-created inventory row (uuid product_id)
    const supabaseUpdate = useServiceRoleForAdmin() ? createAdminDataSupabase() : createAnonSupabase();
    const { data: inventory, error: inventoryError } = await supabaseUpdate
      .from('inventory')
      .update({
        stock_quantity: Number(stock_quantity),
        low_stock_threshold: Number(low_stock_threshold),
        sku: finalSku,
      })
      .eq('product_id', product.id)
      .select()
      .single();

    if (inventoryError) {
      console.error('Failed to update inventory for new product:', inventoryError);
    }

    return NextResponse.json({
      product: {
        ...product,
        inventory: inventory || {
          stock_quantity,
          low_stock_threshold,
          sku: finalSku,
        },
      },
    });
  } catch (err) {
    console.error('POST /api/admin/products:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create product' },
      { status: 500 }
    );
  }
}
