-- Customer email column (mirrors checkout email; guest_email retained for compatibility)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_email text;

UPDATE public.orders
SET customer_email = guest_email
WHERE customer_email IS NULL;

COMMENT ON COLUMN public.orders.customer_email IS 'Customer email for order confirmation and notifications';

-- Allow anonymous and authenticated clients to place orders (checkout)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;

CREATE POLICY "Public insert orders"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
