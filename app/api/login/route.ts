// app/api/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';
import { serialize } from 'cookie';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  // Fetch user from your database
  const response = await sql`
    SELECT * FROM users WHERE email = ${email}`;
  if (response.rowCount === 0) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }
  const user = response.rows[0];

  // Compare the provided password with the stored hashed password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  // Set a cookie to indicate the user is logged in
  const token = { userId: user.id, email: user.email }; // You can include other information if needed
  const serialized = serialize('auth_token', JSON.stringify(token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  const responseHeaders = new Headers();
  responseHeaders.append('Set-Cookie', serialized);

  return new NextResponse(
    JSON.stringify({ message: 'Login successful' }),
    { headers: responseHeaders, status: 200 }
  );
}
