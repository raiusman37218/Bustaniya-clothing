/** Server-only Supabase helpers without next/headers (safe for mixed imports). */
export {
  createAnonSupabase,
  createCatalogSupabase,
  createServiceSupabase,
} from '@/src/lib/supabase/service';
