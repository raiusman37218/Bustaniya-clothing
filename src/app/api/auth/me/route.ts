import { NextResponse } from 'next/server';
import { getSessionUserFromSupabase } from '@/src/lib/auth/get-session-user';

export async function GET() {
  const session = await getSessionUserFromSupabase();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      email: session.email,
      firstName: session.firstName,
      lastName: session.lastName,
    },
  });
}
