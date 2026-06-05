import { NextRequest, NextResponse } from 'next/server';
import {
  setAdminSessionCookie,
  verifyAdminPassword,
} from '@/src/lib/admin/auth';

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.ADMIN_PASSWORD?.trim()),
  });
}

export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD?.trim()) {
    return NextResponse.json(
      { error: 'Admin panel is not configured. Set ADMIN_PASSWORD in .env.local.' },
      { status: 503 },
    );
  }

  const { password } = (await req.json()) as { password?: string };
  if (!password || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  setAdminSessionCookie(res);
  return res;
}
