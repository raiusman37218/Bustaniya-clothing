import { NextResponse } from 'next/server';
import { clearUserSessionCookie } from '@/src/lib/auth/session';
import { createSupabaseServerClient } from '@/src/lib/supabase/auth-server';

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // still clear legacy cookie below
  }

  const res = NextResponse.json({ message: 'Signed out successfully' });
  clearUserSessionCookie(res);
  return res;
}
