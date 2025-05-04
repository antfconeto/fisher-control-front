import { NextResponse } from 'next/server';
import { CustomConsole } from '@/utils/customLogger';
import { cookies } from 'next/headers';
import { isTokenExpirated } from './utils/authUtils';

const consoler = new CustomConsole();

export async function middleware(request: Request) {
  const cookiesService = cookies();
  consoler.process(`🚦 Processing middleware for access: ${request.url}`);
  const token = (await cookiesService).get('access_token');

  if (!token) {
    consoler.warn(`⚠️ Token not received, redirecting for /login...`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isTokenExpirated(token!.value)) {
    consoler.warn(`⚠️ Token was received, but it's expired, redirecting for /login...`);
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  const pathname = request.url
  
  // Se for /login ou /signup, redireciona para /dashboard
  if (pathname.includes('/login') || pathname.includes('/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  consoler.success(`✅🚦 Token received, passing...`);
  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/dashboard','/login', '/signup']
};