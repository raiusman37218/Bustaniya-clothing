-- Public bucket for product catalog, nav/editorial assets (matches legacy `images` bucket)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "images_public_read" ON storage.objects;
CREATE POLICY "images_public_read"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "images_authenticated_insert" ON storage.objects;
CREATE POLICY "images_authenticated_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "images_authenticated_update" ON storage.objects;
CREATE POLICY "images_authenticated_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images')
  WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "images_authenticated_delete" ON storage.objects;
CREATE POLICY "images_authenticated_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');
