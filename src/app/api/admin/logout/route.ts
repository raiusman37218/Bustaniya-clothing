import { NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/src/lib/admin/auth';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearAdminSessionCookie(res);
  return res;
}
