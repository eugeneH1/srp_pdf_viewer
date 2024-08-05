// middleware.js
import { NextResponse } from 'next/server';
import { parse } from 'cookie';

export function middleware(req) {
  const { auth_token } = parse(req.headers.get('cookie') || '');

  if (!auth_token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/books', '/reader', '/register'],
};
