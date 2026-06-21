import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/lib/supabase/database.types';

function loadEnvFile() {
  if (typeof window !== 'undefined') return;
  try {
    const fsName = 'f' + 's';
    const pathName = 'pat' + 'h';
    const req = typeof (globalThis as any).__non_webpack_require__ !== 'undefined'
      ? (globalThis as any).__non_webpack_require__
      : require;
    const fs = req(fsName);
    const path = req(pathName);

    const pathsToTry = [
      path.join(process.cwd(), '.env.local'),
      path.join(process.cwd(), '.env'),
    ];
    for (const envPath of pathsToTry) {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const index = trimmed.indexOf('=');
            if (index !== -1) {
              const key = trimmed.substring(0, index).trim();
              const val = trimmed.substring(index + 1).trim();
              const cleanVal = val.replace(/^["']|["']$/g, '');
              if (key && (!process.env[key] || !process.env[key].trim())) {
                process.env[key] = cleanVal;
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to manually parse env files:', err);
  }
}

function getSupabaseUrl(): string {
  loadEnvFile();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set.');
  }
  return url;
}

/** Service-role client for admin APIs and privileged server reads. */
export function createServiceSupabase(): SupabaseClient<Database> {
  loadEnvFile();
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
  loadEnvFile();
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
