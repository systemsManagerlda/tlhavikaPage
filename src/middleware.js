import { NextResponse } from 'next/server';

export async function middleware(request) {
  const session = await request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard'];

  if (protectedRoutes.some(route => pathname.startsWith(route)) && !session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
