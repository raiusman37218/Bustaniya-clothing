-- 1. Create stock_entries table
CREATE TABLE IF NOT EXISTS public.stock_entries (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    description TEXT,
    expenses JSONB DEFAULT '[]'::jsonb NOT NULL
);

-- Enable RLS
ALTER TABLE public.stock_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for service role and public access
CREATE POLICY "Allow all access to service role" ON public.stock_entries
    FOR ALL TO service_role USING (true) WITH CHECK (true);
    
CREATE POLICY "Allow public select" ON public.stock_entries
    FOR SELECT TO public USING (true);

-- 2. Add stock_id column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_id TEXT REFERENCES public.stock_entries(id) ON DELETE SET NULL;

-- 3. Update the insert RPC to include stock_id
DROP FUNCTION IF EXISTS public.admin_insert_product_rpc(text, text, text, text, text, jsonb, jsonb, jsonb, boolean, boolean, boolean, text);
DROP FUNCTION IF EXISTS public.admin_insert_product_rpc(text, text, text, text, text, jsonb, jsonb, jsonb, boolean, boolean, boolean, text, text);

CREATE OR REPLACE FUNCTION public.admin_insert_product_rpc(
  access_key text,
  p_name text,
  p_price text,
  p_category text,
  p_description text,
  p_color jsonb,
  p_size jsonb,
  p_img jsonb,
  p_instock boolean,
  p_bestsellere boolean,
  p_new boolean,
  p_article_number text DEFAULT NULL,
  p_stock_id text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_id uuid;
  v_result jsonb;
BEGIN
  IF NOT admin_verify_orders_key(access_key) THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.products (
    name,
    price,
    category,
    description,
    color,
    size,
    img,
    instock,
    bestsellere,
    new,
    article_number,
    stock_id
  ) VALUES (
    p_name,
    p_price::numeric,
    p_category,
    p_description,
    p_color::text,
    p_size::text,
    p_img::text,
    p_instock,
    p_bestsellere,
    p_new,
    COALESCE(p_article_number, ('bu-p#'::text || lpad(nextval('public.product_article_number_seq'::regclass)::text, 3, '0'::text))),
    p_stock_id
  )
  RETURNING id INTO v_new_id;

  SELECT row_to_json(p)::jsonb INTO v_result
  FROM public.products p
  WHERE p.id = v_new_id;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_insert_product_rpc(text, text, text, text, text, jsonb, jsonb, jsonb, boolean, boolean, boolean, text, text) TO anon, authenticated;

-- 4. Update the update RPC to include stock_id
DROP FUNCTION IF EXISTS public.admin_update_product_rpc(text, uuid, jsonb);

CREATE OR REPLACE FUNCTION public.admin_update_product_rpc(
  access_key text,
  p_id uuid,
  p_updates jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  IF NOT admin_verify_orders_key(access_key) THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  UPDATE public.products
  SET
    name = COALESCE((p_updates->>'product_name'), name),
    price = COALESCE((p_updates->>'procuct_price')::numeric, price),
    category = COALESCE((p_updates->>'product_category'), category),
    description = COALESCE((p_updates->>'product_description'), description),
    color = CASE WHEN p_updates ? 'product_color' THEN (p_updates->'product_color')::text ELSE color END,
    size = CASE WHEN p_updates ? 'product_size' THEN (p_updates->'product_size')::text ELSE size END,
    img = CASE WHEN p_updates ? 'product_img' THEN (p_updates->'product_img')::text ELSE img END,
    instock = COALESCE((p_updates->>'product_instock')::boolean, instock),
    bestsellere = COALESCE((p_updates->>'product_bestsellere')::boolean, bestsellere),
    new = COALESCE((p_updates->>'product_new')::boolean, new),
    article_number = COALESCE((p_updates->>'article_number'), article_number),
    stock_id = CASE WHEN p_updates ? 'stock_id' THEN (p_updates->>'stock_id') ELSE stock_id END
  WHERE id = p_id;

  SELECT row_to_json(p)::jsonb INTO v_result
  FROM public.products p
  WHERE p.id = p_id;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_update_product_rpc(text, uuid, jsonb) TO anon, authenticated;

-- Force postgrest cache reload
NOTIFY pgrst, 'reload schema';
