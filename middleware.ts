import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/reader', '/books'];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log('Token:', token); // Debugging: Check the token

  const url = req.nextUrl.clone();
  const path = req.nextUrl.pathname;

  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!token) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/reader', '/books'],
};
