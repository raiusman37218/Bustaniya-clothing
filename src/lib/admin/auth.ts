import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { ADMIN_COOKIE } from '@/src/lib/admin/constants';

export { ADMIN_COOKIE };

const SESSION_PAYLOAD = 'admin-authenticated';

function getAdminSecret(): string | undefined {
  return process.env.ADMIN_PASSWORD?.trim() || undefined;
}

export function createAdminSessionToken(): string | null {
  const secret = getAdminSecret();
  if (!secret) return null;
  return createHmac('sha256', secret).update(SESSION_PAYLOAD).digest('hex');
}

export function isValidAdminSessionToken(token: string | undefined): boolean {
  const expected = createAdminSessionToken();
  if (!expected || !token) return false;
  try {
    const a = Buffer.from(token, 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;
  try {
    const a = Buffer.from(password, 'utf8');
    const b = Buffer.from(secret, 'utf8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function setAdminSessionCookie(res: NextResponse): void {
  const token = createAdminSessionToken();
  if (!token) return;
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAdminSessionCookie(res: NextResponse): void {
  res.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function requireAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export function requireAdminFromRequest(req: NextRequest): boolean {
  return isValidAdminSessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
}
