import { profileFromSupabaseUser } from '@/src/lib/auth/supabase-profile';
import type { UserSessionPayload } from '@/src/lib/auth/session';
import { createSupabaseServerClient } from '@/src/lib/supabase/auth-server';

export async function getSessionUserFromSupabase(): Promise<UserSessionPayload | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user?.id || !user.email) return null;

    const profile = profileFromSupabaseUser(user);
    return {
      sub: user.id,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
    };
  } catch {
    return null;
  }
}
