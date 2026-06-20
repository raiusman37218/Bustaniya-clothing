import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/lib/supabase/database.types';

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set.');
  }
  return url;
}

/** Service-role client for admin APIs and privileged server reads. */
export function createServiceSupabase(): SupabaseClient<Database> {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set.');
  }

  return createClient<Database>(getSupabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Anon client for public catalog reads (RLS: Public read products). */
export function createAnonSupabase(): SupabaseClient<Database> {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.');
  }

  return createClient<Database>(getSupabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Prefer service role on server; use anon on client for product SELECT. */
export function createCatalogSupabase(): SupabaseClient<Database> {
  // Always use the public anon client for product catalog operations to avoid 
  // service key configuration issues on the server side.
  return createAnonSupabase();
}
