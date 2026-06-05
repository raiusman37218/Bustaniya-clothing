import { createServiceSupabase } from '@/src/lib/supabase/service';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/lib/supabase/database.types';

export class AdminSupabaseConfigError extends Error {
  readonly code = 'MISSING_SERVICE_ROLE' as const;

  constructor() {
    super(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Add it from Supabase Dashboard → Project Settings → API → service_role, then restart the dev server.',
    );
    this.name = 'AdminSupabaseConfigError';
  }
}

/** Supabase client for admin order reads/writes (bypasses RLS). */
export function createAdminDataSupabase(): SupabaseClient<Database> {
  try {
    return createServiceSupabase();
  } catch {
    throw new AdminSupabaseConfigError();
  }
}

export function isAdminSupabaseConfigError(
  err: unknown,
): err is AdminSupabaseConfigError {
  return err instanceof AdminSupabaseConfigError;
}
