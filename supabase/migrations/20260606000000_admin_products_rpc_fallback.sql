-- Create RPC function to insert a product securely bypassing RLS via SECURITY DEFINER
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
  p_new boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_id bigint;
  v_result jsonb;
BEGIN
  IF NOT admin_verify_orders_key(access_key) THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.product (
    product_name,
    procuct_price,
    product_category,
    product_description,
    product_color,
    product_size,
    product_img,
    product_instock,
    product_bestsellere,
    product_new
  ) VALUES (
    p_name,
    p_price,
    p_category,
    p_description,
    p_color,
    p_size,
    p_img,
    p_instock,
    p_bestsellere,
    p_new
  )
  RETURNING id INTO v_new_id;

  SELECT row_to_json(p)::jsonb INTO v_result
  FROM public.product p
  WHERE p.id = v_new_id;

  RETURN v_result;
END;
$$;

-- Create RPC function to update a product securely bypassing RLS via SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.admin_update_product_rpc(
  access_key text,
  p_id bigint,
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

  UPDATE public.product
  SET
    product_name = COALESCE((p_updates->>'product_name'), product_name),
    procuct_price = COALESCE((p_updates->>'procuct_price'), procuct_price),
    product_category = COALESCE((p_updates->>'product_category'), product_category),
    product_description = COALESCE((p_updates->>'product_description'), product_description),
    product_color = CASE WHEN p_updates ? 'product_color' THEN (p_updates->'product_color') ELSE product_color END,
    product_size = CASE WHEN p_updates ? 'product_size' THEN (p_updates->'product_size') ELSE product_size END,
    product_img = CASE WHEN p_updates ? 'product_img' THEN (p_updates->'product_img') ELSE product_img END,
    product_instock = COALESCE((p_updates->>'product_instock')::boolean, product_instock),
    product_bestsellere = COALESCE((p_updates->>'product_bestsellere')::boolean, product_bestsellere),
    product_new = COALESCE((p_updates->>'product_new')::boolean, product_new)
  WHERE id = p_id;

  SELECT row_to_json(p)::jsonb INTO v_result
  FROM public.product p
  WHERE p.id = p_id;

  RETURN v_result;
END;
$$;

-- Create RPC function to delete a product securely bypassing RLS via SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.admin_delete_product_rpc(
  access_key text,
  p_id bigint
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT admin_verify_orders_key(access_key) THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  DELETE FROM public.product
  WHERE id = p_id;

  RETURN true;
END;
$$;
