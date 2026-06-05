import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/src/lib/admin/constants';
import { isValidAdminSessionToken } from '@/src/lib/admin/auth-edge';
import { createSupabaseMiddlewareClient } from '@/src/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response: supabaseResponse } =
    createSupabaseMiddlewareClient(request);

  if (supabase) {
    await supabase.auth.getUser();
  }

  let response = supabaseResponse;

  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const authed = await isValidAdminSessionToken(token);

  if (pathname.startsWith('/api/admin')) {
    if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
      return response;
    }
    if (!authed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return response;
  }

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!authed) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
