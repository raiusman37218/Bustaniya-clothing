-- 1. Create sequence for article numbers starting at 1
CREATE SEQUENCE IF NOT EXISTS public.product_article_number_seq START WITH 1;

-- 2. Add article_number column to public.products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS article_number TEXT UNIQUE;

-- 3. Sequentially assign article numbers to existing products that don't have one
DO $$
DECLARE
  r RECORD;
  seq_val INT;
BEGIN
  FOR r IN SELECT id FROM public.products WHERE article_number IS NULL ORDER BY created_at ASC LOOP
    seq_val := nextval('public.product_article_number_seq');
    UPDATE public.products SET article_number = 'bu-p#' || lpad(seq_val::text, 3, '0') WHERE id = r.id;
  END LOOP;
END $$;

-- 4. Set the default value of article_number to auto-generate with prefix and padding
ALTER TABLE public.products ALTER COLUMN article_number SET DEFAULT ('bu-p#'::text || lpad(nextval('public.product_article_number_seq'::regclass)::text, 3, '0'::text));

-- 5. Drop and recreate the insert RPC to include article_number
DROP FUNCTION IF EXISTS public.admin_insert_product_rpc(text, text, text, text, text, jsonb, jsonb, jsonb, boolean, boolean, boolean);
DROP FUNCTION IF EXISTS public.admin_insert_product_rpc(text, text, text, text, text, jsonb, jsonb, jsonb, boolean, boolean, boolean, text);

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
  p_article_number text DEFAULT NULL
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
    article_number
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
    COALESCE(p_article_number, ('bu-p#'::text || lpad(nextval('public.product_article_number_seq'::regclass)::text, 3, '0'::text)))
  )
  RETURNING id INTO v_new_id;

  SELECT row_to_json(p)::jsonb INTO v_result
  FROM public.products p
  WHERE p.id = v_new_id;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_insert_product_rpc(text, text, text, text, text, jsonb, jsonb, jsonb, boolean, boolean, boolean, text) TO anon, authenticated;

-- 6. Drop and recreate the update RPC to include article_number
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
    article_number = COALESCE((p_updates->>'article_number'), article_number)
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
