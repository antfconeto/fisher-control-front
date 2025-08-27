import { NextResponse } from 'next/server';
import { CustomConsole } from '@/utils/customLogger';
import { cookies } from 'next/headers';
import { decodeToken, isTokenExpired } from '@/utils/authUtils';
import { Role } from '@/types/user';

const consoler = new CustomConsole();

// Rotas que requerem role de ADMIN
const ADMIN_ROUTES = [
  '/dashboard/users',
  '/dashboard/spawning/register',
  '/dashboard/spawning/update'
];

export async function middleware(request: Request) {
  const cookiesService = cookies();
  const token = (await cookiesService).get('access_token');
  const pathname = request.url;
  
  // Verifica se não há token e não está em páginas públicas
  if (!token && !pathname.includes('/login') && !pathname.includes('/signup')) {

    consoler.warn(`⚠️ Token not received, redirecting for /login...`);
    return NextResponse.redirect(new URL( '/login', request.url));
  }

  // Se for /login ou /signup e tem token, redireciona para /dashboard
  if (token && (pathname.includes('/login') || pathname.includes('/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Verifica se a rota requer permissão de admin
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.includes(route));
  
  if (isAdminRoute && token) {
    try {
      // Verifica se o token não está expirado
      if (isTokenExpired(token.value)) {
        consoler.warn(`⚠️ Token expired, redirecting for /login...`);
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Decodifica o token para verificar a role
      const decodedToken = decodeToken(token.value);
      
      if (!decodedToken || decodedToken.role !== Role.ADMIN) {
        consoler.warn(`⚠️ User is not admin, redirecting for /dashboard...`);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      consoler.success(`✅ Admin access granted for: ${pathname}`);
    } catch (error) {
      consoler.error(`❌ Error checking admin permissions: ${error}`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else if (isAdminRoute && !token) {
    // Se é rota de admin mas não tem token, redireciona para login
    consoler.warn(`⚠️ Admin route accessed without token, redirecting for /login...`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/dashboard/:path*','/login', '/signup']
};