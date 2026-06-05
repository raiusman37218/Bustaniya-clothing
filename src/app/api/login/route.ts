import { NextRequest, NextResponse } from 'next/server';
import { mapAuthError } from '@/src/lib/auth/errors';
import { profileFromSupabaseUser } from '@/src/lib/auth/supabase-profile';
import { clearUserSessionCookie } from '@/src/lib/auth/session';
import { createSupabaseServerClient } from '@/src/lib/supabase/auth-server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as {
      email?: string;
      password?: string;
    };

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: mapAuthError(error?.message ?? 'Invalid login credentials') },
        { status: 401 },
      );
    }

    const profile = profileFromSupabaseUser(data.user);
    const res = NextResponse.json({
      message: 'Signed in successfully',
      user: profile,
    });
    clearUserSessionCookie(res);
    return res;
  } catch {
    return NextResponse.json(
      { error: 'Could not sign in. Please try again.' },
      { status: 500 },
    );
  }
}
