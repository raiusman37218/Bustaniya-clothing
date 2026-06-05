-- Richer order data for admin panel and customer records
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS discount_amount_pkr numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_code text,
  ADD COLUMN IF NOT EXISTS billing_address jsonb;

COMMENT ON COLUMN public.orders.discount_amount_pkr IS 'Discount applied at checkout (PKR)';
COMMENT ON COLUMN public.orders.discount_code IS 'Discount code used at checkout';
COMMENT ON COLUMN public.orders.billing_address IS 'Separate billing address when different from shipping';

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS size text,
  ADD COLUMN IF NOT EXISTS color text,
  ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN public.order_items.size IS 'Selected size at checkout';
COMMENT ON COLUMN public.order_items.color IS 'Selected color at checkout';
COMMENT ON COLUMN public.order_items.image_url IS 'Product image URL at time of order';
