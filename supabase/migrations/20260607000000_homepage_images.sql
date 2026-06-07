-- Create homepage_images table for dynamic section image management
CREATE TABLE IF NOT EXISTS public.homepage_images (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  section     TEXT NOT NULL, -- 'hero', 'collection', 'mood_week', 'follow_us'
  image_url   TEXT NOT NULL,
  alt_text    TEXT,
  link_url    TEXT,
  sort_order  INTEGER DEFAULT 0 NOT NULL
);

-- Enable RLS
ALTER TABLE public.homepage_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Public can read homepage_images" ON public.homepage_images;
CREATE POLICY "Public can read homepage_images"
  ON public.homepage_images FOR SELECT
  USING (true);

-- RPC fallback functions for admin writes when service role key is not configured

CREATE OR REPLACE FUNCTION public.admin_insert_homepage_image_rpc(
  access_key text,
  p_section text,
  p_image_url text,
  p_alt_text text,
  p_link_url text,
  p_sort_order integer
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

  INSERT INTO public.homepage_images (
    section,
    image_url,
    alt_text,
    link_url,
    sort_order
  ) VALUES (
    p_section,
    p_image_url,
    p_alt_text,
    p_link_url,
    p_sort_order
  )
  RETURNING id INTO v_new_id;

  SELECT row_to_json(h)::jsonb INTO v_result
  FROM public.homepage_images h
  WHERE h.id = v_new_id;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_homepage_image_rpc(
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

  UPDATE public.homepage_images
  SET
    section = COALESCE((p_updates->>'section'), section),
    image_url = COALESCE((p_updates->>'image_url'), image_url),
    alt_text = CASE WHEN p_updates ? 'alt_text' THEN (p_updates->>'alt_text') ELSE alt_text END,
    link_url = CASE WHEN p_updates ? 'link_url' THEN (p_updates->>'link_url') ELSE link_url END,
    sort_order = COALESCE((p_updates->>'sort_order')::integer, sort_order)
  WHERE id = p_id;

  SELECT row_to_json(h)::jsonb INTO v_result
  FROM public.homepage_images h
  WHERE h.id = p_id;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_homepage_image_rpc(
  access_key text,
  p_id uuid
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

  DELETE FROM public.homepage_images
  WHERE id = p_id;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_insert_homepage_image_rpc(text, text, text, text, text, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_homepage_image_rpc(text, uuid, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_homepage_image_rpc(text, uuid) TO anon, authenticated;

-- Force postgrest cache reload
NOTIFY pgrst, 'reload schema';

-- Seed initial default hero slides
INSERT INTO public.homepage_images (section, image_url, alt_text, link_url, sort_order)
VALUES
  ('hero', '/images/suit_variation_olive.png', 'Bustaniya — Premium Pastel Suit Collection', '/shop', 0),
  ('hero', '/images/suit_black_white.png', 'Bustaniya — Elegant Black & White Suit Collection', '/shop', 1),
  ('hero', '/images/suit_variation_maroon (1).png', 'Bustaniya — Radiant Yellow & White Suit Collection', '/shop', 2)
ON CONFLICT DO NOTHING;
