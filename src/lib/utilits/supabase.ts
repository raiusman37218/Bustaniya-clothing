import { createBrowserSupabase } from '@/src/lib/supabase/client';

let browserClient: ReturnType<typeof createBrowserSupabase> | null = null;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserSupabase();
  }
  return browserClient;
}

export default getSupabaseBrowserClient;
