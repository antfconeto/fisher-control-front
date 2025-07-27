import { NextResponse } from 'next/server';
import { CustomConsole } from '@/utils/customLogger';
import { cookies } from 'next/headers';

const consoler = new CustomConsole();

export async function middleware(request: Request) {
  const cookiesService = cookies();
  consoler.process(`🚦 Processing middleware for access: ${request.url}`);
  const token = (await cookiesService).get('access_token');
  const pathname = request.url
  if (!token && !pathname.includes('/login') && !pathname.includes('/signup')) {
    console.log(token)
    consoler.warn(`⚠️ Token not received, redirecting for /login...`);
    return NextResponse.redirect(new URL( '/login', request.url));
  }

  // Se for /login ou /signup, redireciona para /dashboard
  if (token && pathname.includes('/login') || pathname.includes('/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  consoler.success(`✅🚦 Middleware access, passing...`);
  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/dashboard/:path*','/login', '/signup']
};