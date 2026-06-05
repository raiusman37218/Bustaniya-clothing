const IMAGES_BUCKET = 'images';

export function getSupabaseProjectUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? null;
}

/** Public URL for a file in the `images` storage bucket. */
export function getStoragePublicUrl(path: string): string {
  const trimmed = path.trim().replace(/^\//, '');
  if (!trimmed) return '';

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const base = getSupabaseProjectUrl();
  if (!base) return trimmed;

  return `${base}/storage/v1/object/public/${IMAGES_BUCKET}/${trimmed}`;
}
