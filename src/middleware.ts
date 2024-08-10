import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // If the user is authenticated and is trying to access the login page, redirect them to the home page
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the user is not authenticated and is trying to access a protected route, redirect them to the login page
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// In which pages should the middleware run
export const config = {
  matcher: ['/', '/login'], 
};