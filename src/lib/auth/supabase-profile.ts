import type { User } from '@supabase/supabase-js';

export type PublicUserProfile = {
  email: string;
  firstName: string;
  lastName: string;
};

export function profileFromSupabaseUser(user: User): PublicUserProfile {
  const meta = user.user_metadata ?? {};
  const firstName = String(
    meta.first_name ?? meta.firstName ?? meta.firstname ?? '',
  ).trim();
  const lastName = String(
    meta.last_name ?? meta.lastName ?? meta.lastname ?? '',
  ).trim();

  return {
    email: user.email ?? '',
    firstName,
    lastName,
  };
}
