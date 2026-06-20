-- Migration to fix order_items.product_id type from bigint to uuid
ALTER TABLE public.order_items DROP COLUMN IF EXISTS product_id;
ALTER TABLE public.order_items ADD COLUMN product_id uuid REFERENCES public.products(id) ON DELETE SET NULL;
