import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { USER_SESSION_COOKIE } from '@/src/lib/auth/constants';

export type UserSessionPayload = {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
};

function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET?.trim() ||
    'bustaniya-local-dev-secret-change-in-production'
  );
}

export function signUserSession(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}): string {
  const payload: UserSessionPayload = {
    sub: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  return jwt.sign(payload, getAuthSecret(), { expiresIn: '7d' });
}

export function verifyUserSession(
  token: string | undefined,
): UserSessionPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, getAuthSecret()) as UserSessionPayload;
  } catch {
    return null;
  }
}

export function setUserSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(USER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearUserSessionCookie(res: NextResponse): void {
  res.cookies.set(USER_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function getUserSessionFromCookies(): Promise<UserSessionPayload | null> {
  const { getSessionUserFromSupabase } = await import(
    '@/src/lib/auth/get-session-user'
  );
  const supabaseUser = await getSessionUserFromSupabase();
  if (supabaseUser) return supabaseUser;

  const cookieStore = await cookies();
  return verifyUserSession(cookieStore.get(USER_SESSION_COOKIE)?.value);
}

export function getUserSessionFromRequest(
  req: NextRequest,
): UserSessionPayload | null {
  return verifyUserSession(req.cookies.get(USER_SESSION_COOKIE)?.value);
}
