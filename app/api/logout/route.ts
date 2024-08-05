// app/api/logout/route.ts
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const serialized = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1, // Expire the cookie immediately
    path: '/',
  });

  const responseHeaders = new Headers();
  responseHeaders.append('Set-Cookie', serialized);

  return new NextResponse(
    JSON.stringify({ message: 'Logout successful' }),
    { headers: responseHeaders, status: 200 }
  );
}
