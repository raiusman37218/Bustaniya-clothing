-- Fallback admin order reads when SUPABASE_SERVICE_ROLE_KEY is not set on the server.
-- Access key = HMAC-SHA256(ADMIN_PASSWORD, message "bustaniya-admin-orders-v1") as hex.
-- Default ADMIN_PASSWORD "bustaniya-admin" → key below. Update this row if you change ADMIN_PASSWORD.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.app_admin_config (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  orders_access_key text NOT NULL
);

INSERT INTO public.app_admin_config (id, orders_access_key)
VALUES (
  1,
  '3a8ff6de89bd471719a652902fcafbb903f4f68897a6ff1b7381a18ea118cd02'
)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.app_admin_config ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.admin_verify_orders_key(access_key text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT access_key IS NOT NULL
    AND access_key = (SELECT orders_access_key FROM app_admin_config WHERE id = 1);
$$;

CREATE OR REPLACE FUNCTION public.admin_list_orders_rpc(access_key text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT admin_verify_orders_key(access_key) THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  RETURN coalesce(
    (
      SELECT jsonb_agg(row_data ORDER BY created_at DESC)
      FROM (
        SELECT jsonb_build_object(
          'id', o.id,
          'order_number', o.order_number,
          'status', o.status,
          'created_at', o.created_at,
          'guest_email', o.guest_email,
          'customer_email', o.customer_email,
          'guest_name', o.guest_name,
          'guest_phone', o.guest_phone,
          'shipping_full_name', o.shipping_full_name,
          'shipping_phone', o.shipping_phone,
          'shipping_line1', o.shipping_line1,
          'shipping_line2', o.shipping_line2,
          'shipping_city', o.shipping_city,
          'shipping_region', o.shipping_region,
          'shipping_country', o.shipping_country,
          'shipping_postal_code', o.shipping_postal_code,
          'subtotal_pkr', o.subtotal_pkr,
          'shipping_fee_pkr', o.shipping_fee_pkr,
          'total_pkr', o.total_pkr,
          'discount_amount_pkr', coalesce(o.discount_amount_pkr, 0),
          'discount_code', o.discount_code,
          'billing_address', o.billing_address,
          'payment_method', o.payment_method,
          'notes', o.notes,
          'order_items', coalesce(
            (
              SELECT jsonb_agg(
                jsonb_build_object(
                  'id', oi.id,
                  'product_id', oi.product_id,
                  'title', oi.title,
                  'unit_price_pkr', oi.unit_price_pkr,
                  'quantity', oi.quantity,
                  'line_total_pkr', oi.line_total_pkr,
                  'size', oi.size,
                  'color', oi.color,
                  'image_url', oi.image_url
                )
                ORDER BY oi.id
              )
              FROM order_items oi
              WHERE oi.order_id = o.id
            ),
            '[]'::jsonb
          )
        ) AS row_data,
        o.created_at
        FROM orders o
      ) sub
    ),
    '[]'::jsonb
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_order_rpc(access_key text, p_order_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  IF NOT admin_verify_orders_key(access_key) THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  SELECT jsonb_build_object(
    'id', o.id,
    'order_number', o.order_number,
    'status', o.status,
    'created_at', o.created_at,
    'guest_email', o.guest_email,
    'customer_email', o.customer_email,
    'guest_name', o.guest_name,
    'guest_phone', o.guest_phone,
    'shipping_full_name', o.shipping_full_name,
    'shipping_phone', o.shipping_phone,
    'shipping_line1', o.shipping_line1,
    'shipping_line2', o.shipping_line2,
    'shipping_city', o.shipping_city,
    'shipping_region', o.shipping_region,
    'shipping_country', o.shipping_country,
    'shipping_postal_code', o.shipping_postal_code,
    'subtotal_pkr', o.subtotal_pkr,
    'shipping_fee_pkr', o.shipping_fee_pkr,
    'total_pkr', o.total_pkr,
    'discount_amount_pkr', coalesce(o.discount_amount_pkr, 0),
    'discount_code', o.discount_code,
    'billing_address', o.billing_address,
    'payment_method', o.payment_method,
    'notes', o.notes,
    'order_items', coalesce(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'title', oi.title,
            'unit_price_pkr', oi.unit_price_pkr,
            'quantity', oi.quantity,
            'line_total_pkr', oi.line_total_pkr,
            'size', oi.size,
            'color', oi.color,
            'image_url', oi.image_url
          )
          ORDER BY oi.id
        )
        FROM order_items oi
        WHERE oi.order_id = o.id
      ),
      '[]'::jsonb
    )
  )
  INTO result
  FROM orders o
  WHERE o.id = p_order_id;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_order_status_rpc(
  access_key text,
  p_order_id uuid,
  p_status text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT admin_verify_orders_key(access_key) THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  IF p_status NOT IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status' USING ERRCODE = '22023';
  END IF;

  UPDATE orders SET status = p_status WHERE id = p_order_id;

  RETURN admin_get_order_rpc(access_key, p_order_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_verify_orders_key(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_orders_rpc(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_order_rpc(text, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_order_status_rpc(text, uuid, text) TO anon, authenticated;
